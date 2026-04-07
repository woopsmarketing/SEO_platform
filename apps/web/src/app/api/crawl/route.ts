import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp, isAuthenticated } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    // 로그인 유저는 무제한, 비로그인은 IP당 하루 2회
    const loggedIn = await isAuthenticated(request);
    if (!loggedIn) {
      const ip = getClientIp(request);
      const rateLimit = await checkRateLimit(ip, "crawl", 2, 1440);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: "일일 무료 사용 횟수(2회)를 초과했습니다.", upgrade: true, remaining: 0 },
          { status: 429, headers: { "Retry-After": String(rateLimit.resetIn) } }
        );
      }
    }

    let { url, maxPages = 30 } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "올바른 URL을 입력해주세요." }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    const baseUrl = new URL(url);
    const origin = baseUrl.origin;

    // 1단계: robots.txt에서 Sitemap 경로 확인
    const sitemapFromRobots = await findSitemapInRobots(origin);

    // 2단계: 기존 sitemap.xml 파싱 시도
    const sitemapUrls = await parseSitemap(sitemapFromRobots || `${origin}/sitemap.xml`);

    // 3단계: 크롤링으로 추가 페이지 발견
    const crawledUrls = await crawlSite(origin, url, maxPages);

    // 합치기 (중복 제거)
    const allUrls = new Map<string, { loc: string; lastmod?: string; source: string }>();

    for (const su of sitemapUrls) {
      allUrls.set(normalizeUrl(su.loc), { loc: su.loc, lastmod: su.lastmod, source: "sitemap" });
    }
    for (const cu of crawledUrls) {
      const key = normalizeUrl(cu);
      if (!allUrls.has(key)) {
        allUrls.set(key, { loc: cu, source: "crawl" });
      }
    }

    const urls = Array.from(allUrls.values());

    return NextResponse.json({
      baseUrl: origin,
      urls,
      count: urls.length,
      sources: {
        sitemap: sitemapUrls.length,
        crawl: crawledUrls.length,
        sitemapUrl: sitemapFromRobots || `${origin}/sitemap.xml`,
      },
      maxReached: crawledUrls.length >= maxPages,
    });
  } catch {
    return NextResponse.json({ error: "크롤링 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// robots.txt에서 Sitemap 경로 찾기
async function findSitemapInRobots(origin: string): Promise<string | null> {
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)" },
    });
    if (!res.ok) return null;
    const text = await res.text();
    const match = text.match(/^Sitemap:\s*(.+)$/im);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

// sitemap.xml 파싱 (일반 sitemap + sitemap index 지원)
async function parseSitemap(sitemapUrl: string): Promise<{ loc: string; lastmod?: string }[]> {
  try {
    const res = await fetch(sitemapUrl, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)" },
    });
    if (!res.ok) return [];

    const xml = await res.text();

    // sitemap index인지 확인
    if (xml.includes("<sitemapindex")) {
      const sitemapLocs = extractXmlTags(xml, "sitemap", "loc");
      const results: { loc: string; lastmod?: string }[] = [];
      // 하위 sitemap 최대 3개만 파싱 (시간 제한)
      for (const loc of sitemapLocs.slice(0, 3)) {
        const sub = await parseSitemap(loc);
        results.push(...sub);
      }
      return results;
    }

    // 일반 sitemap
    return extractUrlEntries(xml);
  } catch {
    return [];
  }
}

function extractUrlEntries(xml: string): { loc: string; lastmod?: string }[] {
  const entries: { loc: string; lastmod?: string }[] = [];
  const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
  let match;

  while ((match = urlRegex.exec(xml)) !== null) {
    const block = match[1];
    const loc = extractTag(block, "loc");
    if (loc) {
      entries.push({
        loc,
        lastmod: extractTag(block, "lastmod") || undefined,
      });
    }
  }
  return entries;
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]+)</${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractXmlTags(xml: string, parent: string, child: string): string[] {
  const results: string[] = [];
  const parentRegex = new RegExp(`<${parent}>([\\s\\S]*?)</${parent}>`, "gi");
  let match;
  while ((match = parentRegex.exec(xml)) !== null) {
    const val = extractTag(match[1], child);
    if (val) results.push(val);
  }
  return results;
}

// 크롤링
async function crawlSite(origin: string, startUrl: string, maxPages: number): Promise<string[]> {
  const visited = new Set<string>();
  const queue: string[] = [normalizeUrl(startUrl)];
  const found: string[] = [];

  while (queue.length > 0 && found.length < maxPages) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    try {
      const res = await fetch(current, {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SEOWorldBot/1.0; +https://seoworld.co.kr)", Accept: "text/html" },
        redirect: "follow",
      });

      if (!res.ok) continue;
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("text/html")) continue;

      const html = await res.text();
      found.push(current);

      const links = extractLinks(html, origin);
      for (const link of links) {
        if (!visited.has(link) && !queue.includes(link) && found.length + queue.length < maxPages * 2) {
          queue.push(link);
        }
      }
    } catch {
      continue;
    }
  }

  return found;
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    let path = u.pathname;
    if (path !== "/" && path.endsWith("/")) path = path.slice(0, -1);
    u.pathname = path;
    u.search = "";
    return u.toString();
  } catch {
    return url;
  }
}

function extractLinks(html: string, origin: string): string[] {
  const links: string[] = [];
  const seen = new Set<string>();
  const regex = /href=["']([^"']+)["']/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    if (href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;

    try {
      const resolved = new URL(href, origin);
      if (resolved.origin !== origin) continue;

      const ext = resolved.pathname.split(".").pop()?.toLowerCase();
      if (ext && ["jpg", "jpeg", "png", "gif", "svg", "webp", "css", "js", "pdf", "zip", "ico", "woff", "woff2", "ttf", "mp4", "mp3"].includes(ext)) continue;

      const normalized = normalizeUrl(resolved.toString());
      if (!seen.has(normalized)) {
        seen.add(normalized);
        links.push(normalized);
      }
    } catch {
      continue;
    }
  }
  return links;
}
