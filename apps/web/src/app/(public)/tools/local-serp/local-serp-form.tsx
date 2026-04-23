"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupModal } from "@/components/signup-modal";
import { SignupBanner } from "@/components/signup-banner";
import {
  trackToolAttempt,
  trackToolUsage,
  trackToolError,
  trackRateLimit,
} from "@/lib/gtag";

interface LocalSerpRow {
  position: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

interface LocalSerpResponse {
  keyword: string;
  gl: string;
  hl: string;
  location: string | null;
  results: LocalSerpRow[];
}

const LOCALES: Array<{ gl: string; hl: string; label: string }> = [
  { gl: "kr", hl: "ko", label: "🇰🇷 한국 / 한국어" },
  { gl: "us", hl: "en", label: "🇺🇸 미국 / 영어" },
  { gl: "jp", hl: "ja", label: "🇯🇵 일본 / 일본어" },
  { gl: "gb", hl: "en", label: "🇬🇧 영국 / 영어" },
  { gl: "de", hl: "de", label: "🇩🇪 독일 / 독일어" },
  { gl: "fr", hl: "fr", label: "🇫🇷 프랑스 / 프랑스어" },
  { gl: "ca", hl: "en", label: "🇨🇦 캐나다 / 영어" },
  { gl: "au", hl: "en", label: "🇦🇺 호주 / 영어" },
  { gl: "sg", hl: "en", label: "🇸🇬 싱가포르 / 영어" },
  { gl: "vn", hl: "vi", label: "🇻🇳 베트남 / 베트남어" },
];

function localeKey(gl: string, hl: string) {
  return `${gl}|${hl}`;
}

export function LocalSerpForm() {
  const [keyword, setKeyword] = useState("");
  const [primaryKey, setPrimaryKey] = useState("kr|ko");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [compareKey, setCompareKey] = useState("us|en");
  const [loading, setLoading] = useState(false);
  const [primary, setPrimary] = useState<LocalSerpResponse | null>(null);
  const [compare, setCompare] = useState<LocalSerpResponse | null>(null);
  const [error, setError] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  async function queryLocale(
    kw: string,
    key: string,
  ): Promise<LocalSerpResponse> {
    const [gl, hl] = key.split("|");
    const res = await fetch("/api/local-serp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: kw, gl, hl }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.upgrade) {
        setShowUpgrade(true);
        trackRateLimit("local-serp", "guest");
      }
      throw new Error(data.error || "분석 실패");
    }
    return data as LocalSerpResponse;
  }

  async function handleCheck() {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setPrimary(null);
    setCompare(null);
    setShowUpgrade(false);

    trackToolAttempt("local-serp");
    try {
      const primaryRes = await queryLocale(keyword.trim(), primaryKey);
      setPrimary(primaryRes);
      trackToolUsage("local-serp");
      if (compareEnabled && compareKey !== primaryKey) {
        const compareRes = await queryLocale(keyword.trim(), compareKey);
        setCompare(compareRes);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "분석에 실패했습니다.";
      setError(message);
      trackToolError("local-serp", message);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 (예: seo tools)"
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              className="flex-1"
            />
            <select
              value={primaryKey}
              onChange={(e) => setPrimaryKey(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {LOCALES.map((l) => (
                <option key={localeKey(l.gl, l.hl)} value={localeKey(l.gl, l.hl)}>
                  {l.label}
                </option>
              ))}
            </select>
            <Button onClick={handleCheck} disabled={loading || !keyword.trim()}>
              {loading ? "조회 중..." : "SERP 확인"}
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={compareEnabled}
              onChange={(e) => setCompareEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            다른 지역과 비교
          </label>

          {compareEnabled && (
            <div>
              <select
                value={compareKey}
                onChange={(e) => setCompareKey(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm w-full sm:w-auto"
              >
                {LOCALES.map((l) => (
                  <option key={localeKey(l.gl, l.hl)} value={localeKey(l.gl, l.hl)}>
                    비교 대상 — {l.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div>
              <p className="text-sm text-destructive">{error}</p>
              <SignupModal
                open={showUpgrade}
                onClose={() => setShowUpgrade(false)}
                toolName="지역 SERP"
              />
            </div>
          )}
          {loading && (
            <p className="text-sm text-muted-foreground">
              지역별 SERP를 조회 중입니다...
            </p>
          )}
        </CardContent>
      </Card>

      <SignupBanner />

      {(primary || compare) && (
        <div
          className={
            compare ? "grid gap-6 md:grid-cols-2" : ""
          }
        >
          {primary && <SerpResultTable data={primary} />}
          {compare && <SerpResultTable data={compare} />}
        </div>
      )}
    </div>
  );
}

function SerpResultTable({ data }: { data: LocalSerpResponse }) {
  const localeLabel =
    LOCALES.find((l) => l.gl === data.gl && l.hl === data.hl)?.label ||
    `${data.gl.toUpperCase()} / ${data.hl}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{localeLabel}</CardTitle>
        <CardDescription>
          &ldquo;{data.keyword}&rdquo; · {data.results.length}개 결과
          {data.location ? ` · ${data.location}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.results.length > 0 ? (
          <ol className="space-y-3">
            {data.results.map((row) => (
              <li
                key={`${row.position}-${row.url}`}
                className="border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground shrink-0 w-6 pt-0.5">
                    {row.position}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-700 hover:underline block"
                    >
                      {row.title}
                    </a>
                    <p className="text-xs text-muted-foreground truncate">
                      {row.domain}
                    </p>
                    {row.snippet && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {row.snippet}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            검색 결과가 없습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
