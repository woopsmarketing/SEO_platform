"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SiteResult {
  url: string;
  score: number | null;
  title: string | null;
  titleLength: number;
  descLength: number;
  h1Count: number;
  hasCanonical: boolean;
  hasOg: boolean;
  hasJsonLd: boolean;
  loadTime: number;
  isHttps: boolean;
  loading: boolean;
  error: string | null;
}

export default function CompetitorsPage() {
  const [myUrl, setMyUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [results, setResults] = useState<SiteResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function analyze(url: string): Promise<SiteResult> {
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) return { url, score: null, title: null, titleLength: 0, descLength: 0, h1Count: 0, hasCanonical: false, hasOg: false, hasJsonLd: false, loadTime: 0, isHttps: false, loading: false, error: data.error };

      const p = data.parsed;
      // 점수 추출
      let score: number | null = null;
      if (data.analysis) {
        const match = data.analysis.match(/SEO\s*점수[:\s]*(\d+)/);
        if (match) score = parseInt(match[1]);
      }

      return {
        url: p.url,
        score,
        title: p.title,
        titleLength: p.titleLength,
        descLength: p.metaDescriptionLength,
        h1Count: p.h1?.length ?? 0,
        hasCanonical: !!p.canonical,
        hasOg: p.hasOgTitle && p.hasOgDescription,
        hasJsonLd: p.hasStructuredData,
        loadTime: p.loadTimeMs,
        isHttps: p.isHttps,
        loading: false,
        error: null,
      };
    } catch {
      return { url, score: null, title: null, titleLength: 0, descLength: 0, h1Count: 0, hasCanonical: false, hasOg: false, hasJsonLd: false, loadTime: 0, isHttps: false, loading: false, error: "분석 실패" };
    }
  }

  async function handleCompare() {
    if (!myUrl || !competitorUrl) return;
    setLoading(true);
    setResults([]);

    const [my, comp] = await Promise.all([analyze(myUrl), analyze(competitorUrl)]);
    setResults([my, comp]);
    setLoading(false);
  }

  function StatusBadge({ ok }: { ok: boolean }) {
    return ok
      ? <span className="text-green-600 text-xs font-medium">✔ 양호</span>
      : <span className="text-red-500 text-xs font-medium">✘ 미설정</span>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">경쟁사 SEO 비교</h1>
        <p className="mt-1 text-muted-foreground">내 사이트와 경쟁사의 SEO 점수를 나란히 비교합니다.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">내 사이트</label>
              <Input
                value={myUrl}
                onChange={(e) => setMyUrl(e.target.value)}
                placeholder="example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">경쟁사 사이트</label>
              <Input
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="competitor.com"
              />
            </div>
          </div>
          <Button onClick={handleCompare} disabled={loading || !myUrl || !competitorUrl} className="w-full sm:w-auto">
            {loading ? "분석 중... (최대 1분)" : "비교 분석 시작"}
          </Button>
        </CardContent>
      </Card>

      {results.length === 2 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {results.map((r, i) => (
            <Card key={r.url} className={i === 0 ? "border-blue-200" : "border-gray-200"}>
              <CardHeader>
                <CardDescription>{i === 0 ? "내 사이트" : "경쟁사"}</CardDescription>
                <CardTitle className="text-base truncate">{r.url}</CardTitle>
              </CardHeader>
              <CardContent>
                {r.error ? (
                  <p className="text-sm text-red-500">{r.error}</p>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-primary">{r.score ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">SEO 점수</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">로딩 속도</span><span className={r.loadTime < 3000 ? "text-green-600" : "text-red-500"}>{r.loadTime}ms</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Title</span><span>{r.titleLength}자</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span>{r.descLength}자</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">H1</span><span>{r.h1Count}개</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">HTTPS</span><StatusBadge ok={r.isHttps} /></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Canonical</span><StatusBadge ok={r.hasCanonical} /></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">OG 태그</span><StatusBadge ok={r.hasOg} /></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">JSON-LD</span><StatusBadge ok={r.hasJsonLd} /></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
