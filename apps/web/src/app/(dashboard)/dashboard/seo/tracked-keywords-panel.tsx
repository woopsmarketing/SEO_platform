"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RankSparkline } from "./rank-sparkline";
import type { TrackedKeyword } from "./types";

interface PanelProps {
  initialItems: TrackedKeyword[];
}

interface AddApiResponse {
  item?: {
    id: string;
    domain: string;
    keyword: string;
    gl: string;
    hl: string;
    created_at: string;
  };
  error?: string;
}

export function TrackedKeywordsPanel({ initialItems }: PanelProps) {
  const [items, setItems] = useState<TrackedKeyword[]>(initialItems);
  const [domain, setDomain] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    if (!domain.trim() || !keyword.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tracked-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), keyword: keyword.trim() }),
      });
      const data = (await res.json()) as AddApiResponse;
      if (!res.ok || !data.item) {
        setError(data.error || "추가에 실패했습니다.");
      } else {
        const fresh: TrackedKeyword = {
          id: data.item.id,
          domain: data.item.domain,
          keyword: data.item.keyword,
          gl: data.item.gl ?? "kr",
          hl: data.item.hl ?? "ko",
          createdAt: data.item.created_at,
          latestRank: null,
          latestCheckedAt: null,
          delta: null,
          history: [],
        };
        // 중복 방지 — 같은 id 있으면 교체
        setItems((prev) => [
          fresh,
          ...prev.filter((p) => p.id !== fresh.id),
        ]);
        setKeyword("");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 키워드 추적을 중단하시겠습니까?")) return;
    const res = await fetch(`/api/tracked-keywords?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">키워드 추가</CardTitle>
          <CardDescription>
            도메인 + 키워드 조합을 등록하면 매일 자동으로 순위를 기록합니다 (하루 1회).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="도메인 (예: seoworld.co.kr)"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="키워드 (예: SEO 도구)"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
            />
            <Button
              onClick={handleAdd}
              disabled={loading || !domain.trim() || !keyword.trim()}
            >
              {loading ? "추가 중..." : "추가"}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">추적 키워드 ({items.length})</CardTitle>
          <CardDescription>
            최근 30일 순위 추이는 스파크라인으로 표시됩니다. 값이 없으면 100위 밖.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              아직 등록된 키워드가 없습니다. 위 폼에서 추가하세요.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">도메인 / 키워드</th>
                    <th className="pb-2 pr-3 font-medium w-20 text-right">현재 순위</th>
                    <th className="pb-2 pr-3 font-medium w-20 text-right">30일 변화</th>
                    <th className="pb-2 pr-3 font-medium w-40">30일 추세</th>
                    <th className="pb-2 pr-3 font-medium w-20 text-right">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => {
                    const deltaLabel = (() => {
                      if (t.delta == null) return "-";
                      if (t.delta === 0) return "0";
                      if (t.delta > 0) return `↑${t.delta}`;
                      return `↓${Math.abs(t.delta)}`;
                    })();
                    const deltaClass = (() => {
                      if (t.delta == null || t.delta === 0)
                        return "text-muted-foreground";
                      return t.delta > 0 ? "text-emerald-600" : "text-red-600";
                    })();
                    return (
                      <tr
                        key={t.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="py-2.5 pr-3 min-w-0">
                          <div className="font-medium">{t.keyword}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {t.domain}
                          </div>
                        </td>
                        <td className="py-2.5 pr-3 text-right tabular-nums font-semibold">
                          {t.latestRank ?? "—"}
                        </td>
                        <td
                          className={`py-2.5 pr-3 text-right tabular-nums font-semibold ${deltaClass}`}
                        >
                          {deltaLabel}
                        </td>
                        <td className="py-2.5 pr-3">
                          <RankSparkline history={t.history} />
                        </td>
                        <td className="py-2.5 pr-3 text-right">
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-xs text-red-600 hover:underline"
                            type="button"
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
