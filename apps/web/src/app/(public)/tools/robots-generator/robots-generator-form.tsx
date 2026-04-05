"use client";

import { useState } from "react";
import { saveDownload } from "@/lib/download-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackToolUsage } from "@/lib/gtag";
import { RelatedTools } from "@/components/related-tools";

interface CrawlerOption {
  name: string;
  label: string;
  category: "search" | "ai" | "seo" | "social";
  description: string;
}

const CRAWLERS: CrawlerOption[] = [
  // 검색엔진
  { name: "Googlebot", label: "Googlebot", category: "search", description: "Google 검색" },
  { name: "Bingbot", label: "Bingbot", category: "search", description: "Bing 검색" },
  { name: "Yandex", label: "Yandex", category: "search", description: "Yandex 검색" },
  { name: "Baiduspider", label: "Baiduspider", category: "search", description: "Baidu 검색" },
  { name: "DuckDuckBot", label: "DuckDuckBot", category: "search", description: "DuckDuckGo" },
  { name: "Slurp", label: "Slurp", category: "search", description: "Yahoo 검색" },
  { name: "NaverBot", label: "Yeti", category: "search", description: "Naver 검색" },
  // AI 크롤러
  { name: "GPTBot", label: "GPTBot", category: "ai", description: "OpenAI GPT 학습" },
  { name: "ChatGPT-User", label: "ChatGPT-User", category: "ai", description: "ChatGPT 브라우징" },
  { name: "ClaudeBot", label: "ClaudeBot", category: "ai", description: "Anthropic Claude" },
  { name: "Google-Extended", label: "Google-Extended", category: "ai", description: "Google AI 학습" },
  { name: "CCBot", label: "CCBot", category: "ai", description: "Common Crawl" },
  { name: "PerplexityBot", label: "PerplexityBot", category: "ai", description: "Perplexity AI" },
  { name: "Bytespider", label: "Bytespider", category: "ai", description: "ByteDance AI" },
  // SEO 도구
  { name: "AhrefsBot", label: "AhrefsBot", category: "seo", description: "Ahrefs" },
  { name: "SemrushBot", label: "SemrushBot", category: "seo", description: "Semrush" },
  { name: "MJ12bot", label: "MJ12bot", category: "seo", description: "Majestic" },
  { name: "DotBot", label: "DotBot", category: "seo", description: "Moz" },
  // 소셜
  { name: "facebot", label: "Facebot", category: "social", description: "Facebook" },
  { name: "Twitterbot", label: "Twitterbot", category: "social", description: "X (Twitter)" },
  { name: "LinkedInBot", label: "LinkedInBot", category: "social", description: "LinkedIn" },
];

const CATEGORY_LABELS: Record<string, string> = {
  search: "검색엔진",
  ai: "AI 크롤러",
  seo: "SEO 도구",
  social: "소셜 미디어",
};

const COMMON_PATHS = [
  "/admin/",
  "/api/",
  "/private/",
  "/tmp/",
  "/cgi-bin/",
  "/wp-admin/",
  "/wp-login.php",
  "/search",
  "/cart",
  "/checkout",
  "/account",
];

export function RobotsGeneratorForm() {
  const [blockedCrawlers, setBlockedCrawlers] = useState<Set<string>>(new Set());
  const [globalAllow, setGlobalAllow] = useState<string[]>(["/"]);
  const [globalDisallow, setGlobalDisallow] = useState<string[]>(["/admin/", "/api/"]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [hostUrl, setHostUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  function toggleCrawler(name: string) {
    setBlockedCrawlers((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function toggleCategory(category: string) {
    const crawlersInCategory = CRAWLERS.filter((c) => c.category === category);
    const allBlocked = crawlersInCategory.every((c) => blockedCrawlers.has(c.name));

    setBlockedCrawlers((prev) => {
      const next = new Set(prev);
      crawlersInCategory.forEach((c) => {
        if (allBlocked) next.delete(c.name);
        else next.add(c.name);
      });
      return next;
    });
  }

  function addPath(type: "allow" | "disallow") {
    if (type === "allow") setGlobalAllow([...globalAllow, ""]);
    else setGlobalDisallow([...globalDisallow, ""]);
  }

  function updatePath(type: "allow" | "disallow", index: number, value: string) {
    if (type === "allow") setGlobalAllow(globalAllow.map((p, i) => (i === index ? value : p)));
    else setGlobalDisallow(globalDisallow.map((p, i) => (i === index ? value : p)));
  }

  function removePath(type: "allow" | "disallow", index: number) {
    if (type === "allow") setGlobalAllow(globalAllow.filter((_, i) => i !== index));
    else setGlobalDisallow(globalDisallow.filter((_, i) => i !== index));
  }

  function applyPreset(preset: "allow-all" | "block-all" | "block-ai" | "block-ai-seo") {
    if (preset === "allow-all") {
      setBlockedCrawlers(new Set());
      setGlobalAllow(["/"]);
      setGlobalDisallow([]);
    } else if (preset === "block-all") {
      setBlockedCrawlers(new Set());
      setGlobalAllow([]);
      setGlobalDisallow(["/"]);
    } else if (preset === "block-ai") {
      const aiCrawlers = CRAWLERS.filter((c) => c.category === "ai").map((c) => c.name);
      setBlockedCrawlers(new Set(aiCrawlers));
      setGlobalAllow(["/"]);
      setGlobalDisallow(["/admin/", "/api/"]);
    } else if (preset === "block-ai-seo") {
      const targets = CRAWLERS.filter((c) => c.category === "ai" || c.category === "seo").map((c) => c.name);
      setBlockedCrawlers(new Set(targets));
      setGlobalAllow(["/"]);
      setGlobalDisallow(["/admin/", "/api/"]);
    }
  }

  const output = generateRobotsTxt(globalAllow, globalDisallow, blockedCrawlers, sitemapUrl, hostUrl, crawlDelay);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    trackToolUsage("robots-generator");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    fetch("/api/tool-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool_type: "robots-generator", input_summary: `${blockedCrawlers.size} blocked` }),
    }).catch(() => {});
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robots.txt";
    a.click();
    URL.revokeObjectURL(url);
    saveDownload({ type: "robots.txt", filename: "robots.txt", content: output });
  }

  return (<>
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 설정 */}
      <div className="space-y-6">
        {/* 프리셋 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 설정</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyPreset("allow-all")}>전체 허용</Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("block-all")}>전체 차단</Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("block-ai")}>AI 크롤러 차단</Button>
            <Button variant="outline" size="sm" onClick={() => applyPreset("block-ai-seo")}>AI + SEO 도구 차단</Button>
          </CardContent>
        </Card>

        {/* 크롤러 차단 체크박스 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">차단할 크롤러 선택</CardTitle>
            <CardDescription>체크한 크롤러는 사이트 전체 크롤링이 차단됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {(["search", "ai", "seo", "social"] as const).map((category) => {
              const crawlersInCat = CRAWLERS.filter((c) => c.category === category);
              const allBlocked = crawlersInCat.every((c) => blockedCrawlers.has(c.name));
              const someBlocked = crawlersInCat.some((c) => blockedCrawlers.has(c.name));

              return (
                <div key={category}>
                  <label className="mb-2 flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allBlocked}
                      ref={(el) => { if (el) el.indeterminate = someBlocked && !allBlocked; }}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-semibold">{CATEGORY_LABELS[category]}</span>
                    <span className="text-xs text-muted-foreground">
                      ({crawlersInCat.filter((c) => blockedCrawlers.has(c.name)).length}/{crawlersInCat.length})
                    </span>
                  </label>
                  <div className="ml-6 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {crawlersInCat.map((crawler) => (
                      <label key={crawler.name} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={blockedCrawlers.has(crawler.name)}
                          onChange={() => toggleCrawler(crawler.name)}
                          className="h-3.5 w-3.5 rounded border-gray-300"
                        />
                        <span className="text-sm">{crawler.label}</span>
                        <span className="text-xs text-muted-foreground">{crawler.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 전역 경로 규칙 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">전역 경로 규칙</CardTitle>
            <CardDescription>모든 허용된 크롤러에 적용됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PathEditor
              label="Allow"
              color="text-green-700"
              paths={globalAllow}
              onAdd={() => addPath("allow")}
              onUpdate={(i, v) => updatePath("allow", i, v)}
              onRemove={(i) => removePath("allow", i)}
            />
            <PathEditor
              label="Disallow"
              color="text-red-700"
              paths={globalDisallow}
              onAdd={() => addPath("disallow")}
              onUpdate={(i, v) => updatePath("disallow", i, v)}
              onRemove={(i) => removePath("disallow", i)}
            />
          </CardContent>
        </Card>

        {/* 추가 설정 */}
        <Card>
          <CardHeader><CardTitle className="text-lg">추가 설정</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sitemap URL</label>
              <Input value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Host (선택)</label>
              <Input value={hostUrl} onChange={(e) => setHostUrl(e.target.value)} placeholder="https://example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Crawl-delay (초, 선택)</label>
              <Input value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" type="number" min="0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 출력 */}
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="text-lg">생성된 robots.txt</CardTitle>
            <CardDescription>이 파일을 웹사이트 루트 디렉토리에 robots.txt로 저장하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[500px] overflow-auto rounded-md bg-muted p-4 text-sm"><code>{output}</code></pre>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {blockedCrawlers.size > 0 ? `${blockedCrawlers.size}개 크롤러 차단` : "차단 없음"}
            </p>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleCopy} className="flex-1">{copied ? "복사됨!" : "복사"}</Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1">다운로드</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">robots.txt 가이드</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong>User-Agent:</strong> 규칙을 적용할 크롤러. *는 모든 크롤러를 의미합니다.</p>
            <p><strong>Allow:</strong> 크롤링을 허용할 경로. 기본적으로 모든 경로는 허용됩니다.</p>
            <p><strong>Disallow:</strong> 크롤링을 차단할 경로.</p>
            <p><strong>Sitemap:</strong> sitemap.xml 위치를 알려줍니다.</p>
            <p><strong>Crawl-delay:</strong> 요청 간 대기 시간(초). Google은 이를 무시합니다.</p>
            <p className="border-t pt-3"><strong>AI 크롤러 차단:</strong> GPTBot, ClaudeBot 등을 차단하면 AI 학습에 사이트 데이터가 사용되는 것을 방지할 수 있습니다.</p>
          </CardContent>
        </Card>
      </div>
    </div>
    <RelatedTools currentTool="robots-generator" />
  </>
  );
}

function PathEditor({
  label, color, paths, onAdd, onUpdate, onRemove,
}: {
  label: string; color: string; paths: string[];
  onAdd: () => void; onUpdate: (i: number, v: string) => void; onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${color}`}>{label}</label>
        <Button variant="ghost" size="sm" onClick={onAdd}>+ 추가</Button>
      </div>
      {paths.map((path, i) => (
        <div key={i} className="flex gap-2">
          <select
            className="flex h-9 w-28 shrink-0 rounded-md border border-input bg-background px-2 text-xs"
            value={COMMON_PATHS.includes(path) ? path : ""}
            onChange={(e) => { if (e.target.value) onUpdate(i, e.target.value); }}
          >
            <option value="">직접 입력</option>
            {COMMON_PATHS.map((p) => (<option key={p} value={p}>{p}</option>))}
          </select>
          <Input value={path} onChange={(e) => onUpdate(i, e.target.value)} placeholder="/path/" className="h-9" />
          <Button variant="ghost" size="sm" onClick={() => onRemove(i)}>x</Button>
        </div>
      ))}
    </div>
  );
}

function generateRobotsTxt(
  allow: string[], disallow: string[], blocked: Set<string>,
  sitemap: string, host: string, crawlDelay: string
): string {
  const lines: string[] = [];
  lines.push("# robots.txt generated by SEO월드");
  lines.push(`# ${new Date().toISOString().split("T")[0]}`);
  lines.push("");

  // 전역 규칙
  lines.push("User-agent: *");
  if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
  for (const p of allow) { if (p) lines.push(`Allow: ${p}`); }
  for (const p of disallow) { if (p) lines.push(`Disallow: ${p}`); }
  lines.push("");

  // 차단된 크롤러
  for (const name of Array.from(blocked).sort()) {
    lines.push(`User-agent: ${name}`);
    lines.push("Disallow: /");
    lines.push("");
  }

  if (sitemap) lines.push(`Sitemap: ${sitemap}`);
  if (host) lines.push(`Host: ${host}`);

  return lines.join("\n").trim() + "\n";
}
