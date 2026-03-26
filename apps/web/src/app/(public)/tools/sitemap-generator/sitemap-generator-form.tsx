"use client";

import { useState } from "react";
import { saveDownload } from "@/lib/download-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SitemapUrl {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

const CHANGEFREQ_OPTIONS = [
  { label: "선택 안 함", value: "" },
  { label: "always", value: "always" },
  { label: "hourly", value: "hourly" },
  { label: "daily", value: "daily" },
  { label: "weekly", value: "weekly" },
  { label: "monthly", value: "monthly" },
  { label: "yearly", value: "yearly" },
  { label: "never", value: "never" },
];

const PRIORITY_OPTIONS = [
  { label: "선택 안 함", value: "" },
  { label: "1.0 (최고)", value: "1.0" },
  { label: "0.9", value: "0.9" },
  { label: "0.8", value: "0.8" },
  { label: "0.7", value: "0.7" },
  { label: "0.6", value: "0.6" },
  { label: "0.5 (기본)", value: "0.5" },
  { label: "0.4", value: "0.4" },
  { label: "0.3", value: "0.3" },
  { label: "0.2", value: "0.2" },
  { label: "0.1 (최저)", value: "0.1" },
];

function createId() {
  return Math.random().toString(36).slice(2, 9);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export function SitemapGeneratorForm() {
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [defaultChangefreq, setDefaultChangefreq] = useState("weekly");
  const [defaultPriority, setDefaultPriority] = useState("0.5");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"auto" | "manual" | "bulk">("auto");

  // 자동 크롤링
  const [crawlUrl, setCrawlUrl] = useState("");
  const [maxPages, setMaxPages] = useState(30);
  const [crawling, setCrawling] = useState(false);
  const [crawlStatus, setCrawlStatus] = useState("");

  // 벌크 입력
  const [bulkText, setBulkText] = useState("");

  async function handleCrawl() {
    if (!crawlUrl) return;
    setCrawling(true);
    setCrawlStatus("크롤링 중...");

    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: crawlUrl, maxPages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCrawlStatus(`오류: ${data.error}`);
        setCrawling(false);
        return;
      }

      const newUrls: SitemapUrl[] = data.urls.map((u: { loc: string; lastmod?: string; source: string }, i: number) => ({
        id: createId(),
        loc: u.loc,
        lastmod: u.lastmod || today(),
        changefreq: defaultChangefreq,
        priority: i === 0 ? "1.0" : defaultPriority,
      }));

      setUrls(newUrls);

      const src = data.sources || {};
      const parts = [];
      if (src.sitemap > 0) parts.push(`sitemap에서 ${src.sitemap}개`);
      if (src.crawl > 0) parts.push(`크롤링으로 ${src.crawl}개`);
      setCrawlStatus(
        `총 ${data.count}개 페이지 발견 (${parts.join(", ")})${data.maxReached ? " — 크롤링 제한 도달" : ""}`
      );
      setMode("manual");
    } catch {
      setCrawlStatus("크롤링 중 네트워크 오류가 발생했습니다.");
    }
    setCrawling(false);
  }

  function parseBulk() {
    const lines = bulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("http://") || l.startsWith("https://"));

    if (lines.length === 0) return;

    setUrls(
      lines.map((loc, i) => ({
        id: createId(),
        loc,
        lastmod: today(),
        changefreq: defaultChangefreq,
        priority: i === 0 ? "1.0" : defaultPriority,
      }))
    );
    setMode("manual");
  }

  function addUrl() {
    setUrls([...urls, { id: createId(), loc: "", lastmod: today(), changefreq: defaultChangefreq, priority: defaultPriority }]);
  }

  function removeUrl(id: string) {
    setUrls(urls.filter((u) => u.id !== id));
  }

  function updateUrl(id: string, field: keyof SitemapUrl, value: string) {
    setUrls(urls.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  }

  const activeUrls = urls.filter((u) => u.loc);
  const output = generateSitemap(activeUrls);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    fetch("/api/tool-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool_type: "sitemap-generator", input_summary: `${activeUrls.length} urls` }),
    }).catch(() => {});
  }

  function handleDownload() {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
    saveDownload({ type: "sitemap.xml", filename: "sitemap.xml", content: output });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 입력 */}
      <div className="space-y-6">
        {/* 모드 전환 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">입력 방식</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant={mode === "auto" ? "default" : "outline"} size="sm" onClick={() => setMode("auto")}>
              URL 자동 수집
            </Button>
            <Button variant={mode === "manual" ? "default" : "outline"} size="sm" onClick={() => setMode("manual")}>
              개별 입력
            </Button>
            <Button variant={mode === "bulk" ? "default" : "outline"} size="sm" onClick={() => setMode("bulk")}>
              벌크 입력
            </Button>
          </CardContent>
        </Card>

        {/* 자동 크롤링 */}
        {mode === "auto" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">URL 자동 수집</CardTitle>
              <CardDescription>
                웹사이트 URL을 입력하면 내부 링크를 자동으로 크롤링하여 페이지 목록을 수집합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">웹사이트 URL</label>
                <Input
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={(e) => e.key === "Enter" && handleCrawl()}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">최대 페이지 수</label>
                  <Input
                    type="number"
                    value={maxPages}
                    onChange={(e) => setMaxPages(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">기본 changefreq</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={defaultChangefreq}
                    onChange={(e) => setDefaultChangefreq(e.target.value)}
                  >
                    {CHANGEFREQ_OPTIONS.filter((o) => o.value).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleCrawl} disabled={crawling || !crawlUrl} className="w-full">
                {crawling ? "크롤링 중..." : "크롤링 시작"}
              </Button>
              {crawlStatus && (
                <p className={`text-sm ${crawlStatus.startsWith("오류") ? "text-destructive" : "text-muted-foreground"}`}>
                  {crawlStatus}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 벌크 입력 */}
        {mode === "bulk" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">URL 목록 붙여넣기</CardTitle>
              <CardDescription>한 줄에 하나의 URL을 입력하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"https://example.com/\nhttps://example.com/about\nhttps://example.com/blog"}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">기본 changefreq</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={defaultChangefreq}
                    onChange={(e) => setDefaultChangefreq(e.target.value)}
                  >
                    {CHANGEFREQ_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">기본 priority</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={defaultPriority}
                    onChange={(e) => setDefaultPriority(e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                  </select>
                </div>
              </div>
              <Button onClick={parseBulk} className="w-full">
                변환 ({bulkText.split("\n").filter((l) => l.trim().startsWith("http")).length}개 URL)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 개별 URL 편집 (manual 모드이거나 자동/벌크 후 URL 목록이 있을 때) */}
        {(mode === "manual" || urls.length > 0) && (
          <>
            {urls.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">URL 목록 ({urls.length})</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setUrls([])}>
                        전체 삭제
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {urls.map((entry, i) => (
                    <div key={entry.id} className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground w-6">{i + 1}</span>
                        <Input
                          value={entry.loc}
                          onChange={(e) => updateUrl(entry.id, "loc", e.target.value)}
                          placeholder="https://example.com/page"
                          className="h-8 text-sm"
                        />
                        <Button variant="ghost" size="sm" onClick={() => removeUrl(entry.id)} className="shrink-0 h-8 w-8 p-0">
                          x
                        </Button>
                      </div>
                      <div className="ml-8 grid gap-2 sm:grid-cols-3">
                        <Input
                          type="date"
                          value={entry.lastmod}
                          onChange={(e) => updateUrl(entry.id, "lastmod", e.target.value)}
                          className="h-7 text-xs"
                        />
                        <select
                          className="flex h-7 w-full rounded-md border border-input bg-background px-2 text-xs"
                          value={entry.changefreq}
                          onChange={(e) => updateUrl(entry.id, "changefreq", e.target.value)}
                        >
                          {CHANGEFREQ_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                        </select>
                        <select
                          className="flex h-7 w-full rounded-md border border-input bg-background px-2 text-xs"
                          value={entry.priority}
                          onChange={(e) => updateUrl(entry.id, "priority", e.target.value)}
                        >
                          {PRIORITY_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                        </select>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button variant="outline" onClick={addUrl} className="w-full">+ URL 추가</Button>
          </>
        )}
      </div>

      {/* 출력 */}
      <div className="space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="text-lg">생성된 sitemap.xml</CardTitle>
            <CardDescription>
              이 파일을 웹사이트 루트에 sitemap.xml로 저장하고 Google Search Console에 제출하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[500px] overflow-auto rounded-md bg-muted p-4 text-xs font-mono">
              <code>{output || "URL을 입력하거나 크롤링을 시작하세요."}</code>
            </pre>
            <p className="mt-2 text-center text-xs text-muted-foreground">{activeUrls.length}개 URL</p>
            <div className="mt-3 flex gap-2">
              <Button onClick={handleCopy} className="flex-1" disabled={activeUrls.length === 0}>
                {copied ? "복사됨!" : "복사"}
              </Button>
              <Button variant="outline" onClick={handleDownload} className="flex-1" disabled={activeUrls.length === 0}>
                다운로드
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">sitemap.xml 가이드</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong>자동 수집:</strong> URL을 입력하면 해당 사이트의 내부 링크를 크롤링하여 페이지를 발견합니다. 최대 100페이지까지 수집 가능합니다.</p>
            <p><strong>loc:</strong> 페이지의 전체 URL. 필수 항목입니다.</p>
            <p><strong>lastmod:</strong> 마지막 수정 날짜. 검색엔진이 재크롤링 시기를 판단합니다.</p>
            <p><strong>changefreq:</strong> 페이지 변경 빈도 힌트. 참고 정보이며 강제하지 않습니다.</p>
            <p><strong>priority:</strong> 사이트 내 상대적 중요도 (0.0~1.0). 기본값은 0.5입니다.</p>
            <p className="border-t pt-3">
              <strong>제출 방법:</strong> Google Search Console &gt; Sitemaps에서 URL을 입력하여 제출합니다.
              robots.txt에 Sitemap 경로를 추가하면 자동으로 인식됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function generateSitemap(urls: SitemapUrl[]): string {
  if (urls.length === 0) return "";

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  for (const url of urls) {
    if (!url.loc) continue;
    lines.push("  <url>");
    lines.push(`    <loc>${esc(url.loc)}</loc>`);
    if (url.lastmod) lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
    if (url.changefreq) lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
    if (url.priority) lines.push(`    <priority>${url.priority}</priority>`);
    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return lines.join("\n");
}
