"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  dailyUsage: { date: string; count: number }[];
  dailySignups: { date: string; count: number }[];
  toolBreakdown: { tool_type: string; count: number }[];
};

function shortDate(date: string): string {
  const d = new Date(date + "T00:00:00+09:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const TOOL_LABELS: Record<string, string> = {
  "onpage-audit": "온페이지 감사",
  "meta-analyzer": "메타태그 분석",
  "backlink-checker": "백링크 검사",
  "keyword-research": "키워드 리서치",
  "keyword-density": "키워드 밀도",
  "related-keywords": "연관 키워드",
  "serp-checker": "SERP 순위",
  "domain-authority": "도메인 권위",
  "domain-compare": "도메인 비교",
  "local-serp": "로컬 SERP",
  "longtail-keywords": "롱테일 키워드",
  "people-also-ask": "PAA",
  "snippet-optimizer": "스니펫 최적화",
  "content-gap": "콘텐츠 갭",
  "serp-difficulty": "SERP 난이도",
  "common-backlinks": "공통 백링크",
  "my-top-keywords": "내 상위 키워드",
  "backlink-gap": "백링크 갭",
  "keyword-gap": "키워드 갭",
  "competitor-discovery": "경쟁사 발견",
  "broken-backlink-recovery": "깨진 백링크 복구",
  "competitor-analysis": "경쟁사 분석",
};

function toolLabel(t: string): string {
  return TOOL_LABELS[t] ?? t;
}

export function AdminCharts() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || "통계를 불러올 수 없습니다.");
        }
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setStats(data as Stats);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "통계 로딩 오류");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-red-600">{error}</CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">차트 로딩 중…</CardContent>
      </Card>
    );
  }

  const usageData = stats.dailyUsage.map((d) => ({ ...d, label: shortDate(d.date) }));
  const signupData = stats.dailySignups.map((d) => ({ ...d, label: shortDate(d.date) }));
  const breakdownData = stats.toolBreakdown.map((d) => ({ ...d, label: toolLabel(d.tool_type) }));

  const usageTotal = usageData.reduce((acc, r) => acc + r.count, 0);
  const signupTotal = signupData.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>최근 30일 툴 사용 추이</CardTitle>
          <CardDescription>
            KST 기준 일별 툴 사용 횟수 · 합계 {usageTotal.toLocaleString("ko-KR")}회
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={30} />
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
                  formatter={(v: unknown) => [`${v}회`, "사용"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#usageGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>최근 30일 신규 가입자</CardTitle>
          <CardDescription>
            KST 기준 일별 가입 수 · 합계 {signupTotal.toLocaleString("ko-KR")}명
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} width={30} />
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
                  formatter={(v: unknown) => [`${v}명`, "가입"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#signupGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>툴별 사용 분포 (최근 30일 · TOP 12)</CardTitle>
          <CardDescription>가장 많이 사용된 툴</CardDescription>
        </CardHeader>
        <CardContent>
          {breakdownData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">집계된 데이터가 없습니다.</p>
          ) : (
            <div className="w-full" style={{ height: `${Math.max(240, breakdownData.length * 32)}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={breakdownData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    width={130}
                    interval={0}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
                    formatter={(v: unknown) => [`${v}회`, "사용"]}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
