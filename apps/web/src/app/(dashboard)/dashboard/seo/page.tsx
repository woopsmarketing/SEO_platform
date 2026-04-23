import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrackedKeywordsPanel } from "./tracked-keywords-panel";
import type { TrackedKeyword } from "./types";

export const metadata: Metadata = {
  title: "내 SEO 대시보드 | SEO월드",
  description: "추적 중인 키워드 순위 변화, 깨진 백링크 현황을 한눈에 확인하세요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard/seo" },
};

interface SerpTrackingRow {
  tracked_keyword_id: string;
  rank: number | null;
  checked_at: string;
}

interface TrackedKeywordRow {
  id: string;
  domain: string;
  keyword: string;
  gl: string | null;
  hl: string | null;
  is_active: boolean;
  created_at: string;
}

function toTrend(
  row: TrackedKeywordRow,
  tracking: SerpTrackingRow[],
): TrackedKeyword {
  // 최근 30일 순위 히스토리 (오래된 → 최신)
  const history = tracking
    .filter((t) => t.tracked_keyword_id === row.id)
    .slice()
    .sort((a, b) => a.checked_at.localeCompare(b.checked_at));

  const latest = history.length > 0 ? history[history.length - 1] : null;
  const oldest = history.length > 0 ? history[0] : null;

  let delta: number | null = null;
  if (latest && oldest && latest.rank != null && oldest.rank != null) {
    // delta > 0 → 순위 상승 (숫자가 작아짐)
    delta = oldest.rank - latest.rank;
  }

  return {
    id: row.id,
    domain: row.domain,
    keyword: row.keyword,
    gl: row.gl ?? "kr",
    hl: row.hl ?? "ko",
    createdAt: row.created_at,
    latestRank: latest?.rank ?? null,
    latestCheckedAt: latest?.checked_at ?? null,
    delta,
    history: history.map((h) => ({
      checkedAt: h.checked_at,
      rank: h.rank,
    })),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirect=/dashboard/seo");
  }

  // 내 tracked_keywords
  const { data: kwRows } = await supabase
    .from("tracked_keywords")
    .select("id, domain, keyword, gl, hl, is_active, created_at")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  const keywords = (kwRows ?? []) as TrackedKeywordRow[];

  // 최근 30일 serp_tracking (해당 키워드 전체)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  let tracking: SerpTrackingRow[] = [];
  if (keywords.length > 0) {
    const { data: serpRows } = await supabase
      .from("serp_tracking")
      .select("tracked_keyword_id, rank, checked_at")
      .in(
        "tracked_keyword_id",
        keywords.map((k) => k.id),
      )
      .gte("checked_at", thirtyDaysAgo)
      .order("checked_at", { ascending: true });
    tracking = (serpRows ?? []) as SerpTrackingRow[];
  }

  // 깨진 백링크 미복구 카운트
  const { count: brokenCount } = await supabase
    .from("broken_backlinks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("resolved", false);

  const trends: TrackedKeyword[] = keywords.map((k) => toTrend(k, tracking));

  // 집계
  const withRank = trends.filter(
    (t): t is TrackedKeyword & { latestRank: number } =>
      typeof t.latestRank === "number",
  );
  const avgRank =
    withRank.length > 0
      ? Math.round(
          withRank.reduce((s, t) => s + t.latestRank, 0) / withRank.length,
        )
      : null;

  // 이번 주 변동 TOP 3 (상승 / 하락)
  const withDelta = trends.filter(
    (t): t is TrackedKeyword & { delta: number } => typeof t.delta === "number",
  );
  const topGainers = [...withDelta]
    .filter((t) => t.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3);
  const topLosers = [...withDelta]
    .filter((t) => t.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, 3);

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    (user.email ? user.email.split("@")[0] : "사용자");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">내 SEO 대시보드</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {displayName}님, 오늘 키워드 추적 현황을 확인하세요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/tools/serp-checker">
            <Button variant="outline" size="sm">
              SERP 즉시 확인
            </Button>
          </Link>
          <Link href="/tools/broken-backlink-recovery">
            <Button variant="outline" size="sm">
              백링크 점검하기
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground">
              추적 중인 키워드
            </p>
            <p className="mt-1 text-2xl font-bold">{trends.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              평균 순위 {avgRank ?? "-"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground">
              미복구 깨진 백링크
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {brokenCount ?? 0}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              404/410 응답 백링크
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-muted-foreground">
              이번 주 순위 변동
            </p>
            <p className="mt-1 text-2xl font-bold">
              <span className="text-emerald-600">↑{topGainers.length}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className="text-red-600">↓{topLosers.length}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              30일 기준 상승/하락 키워드 수
            </p>
          </CardContent>
        </Card>
      </div>

      {(topGainers.length > 0 || topLosers.length > 0) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-emerald-700">
                상승 TOP 3
              </CardTitle>
              <CardDescription>30일 기준 순위 개선이 큰 키워드</CardDescription>
            </CardHeader>
            <CardContent>
              {topGainers.length > 0 ? (
                <ul className="space-y-2">
                  {topGainers.map((t) => (
                    <li key={t.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.keyword}</span>
                      <span className="font-mono text-xs">
                        <span className="text-muted-foreground">현재 </span>
                        {t.latestRank ?? "-"}위
                        <span className="ml-2 text-emerald-600">
                          ↑{t.delta}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">상승 키워드가 없습니다.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-700">하락 TOP 3</CardTitle>
              <CardDescription>30일 기준 순위가 떨어진 키워드</CardDescription>
            </CardHeader>
            <CardContent>
              {topLosers.length > 0 ? (
                <ul className="space-y-2">
                  {topLosers.map((t) => (
                    <li key={t.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.keyword}</span>
                      <span className="font-mono text-xs">
                        <span className="text-muted-foreground">현재 </span>
                        {t.latestRank ?? "-"}위
                        <span className="ml-2 text-red-600">
                          ↓{Math.abs(t.delta)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">하락 키워드가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <TrackedKeywordsPanel initialItems={trends} />
    </div>
  );
}
