import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DomainMetrics } from "@/lib/cache-api";

export function toNumber(v: number | string | undefined | null): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : null;
}

export function formatCount(v: number | string | undefined | null): string {
  const n = toNumber(v);
  if (n == null) return "-";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString("ko-KR");
}

export function metricTier(n: number | null): { label: string; color: string } {
  if (n == null) return { label: "-", color: "text-muted-foreground" };
  if (n >= 70) return { label: "최상위", color: "text-emerald-600" };
  if (n >= 50) return { label: "상위", color: "text-blue-600" };
  if (n >= 30) return { label: "평균", color: "text-amber-600" };
  return { label: "낮음", color: "text-muted-foreground" };
}

export function hasAnyCoreMetric(metrics: DomainMetrics | null | undefined): boolean {
  if (!metrics) return false;
  return toNumber(metrics.mozDA) != null || toNumber(metrics.ahrefsDR) != null || toNumber(metrics.majesticTF) != null;
}

export function DomainMetricsCard({
  domain,
  metrics,
  compact = false,
}: {
  domain: string;
  metrics: DomainMetrics;
  compact?: boolean;
}) {
  const da = toNumber(metrics.mozDA);
  const dr = toNumber(metrics.ahrefsDR);
  const tf = toNumber(metrics.majesticTF);

  if (da == null && dr == null && tf == null) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">도메인 권위 지표</CardTitle>
        <CardDescription>
          {domain} — Moz · Ahrefs · Majestic 외부 SEO 데이터
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricTile label="Moz DA" value={da} description="Domain Authority" />
          <MetricTile label="Ahrefs DR" value={dr} description="Domain Rating" />
          <MetricTile label="Majestic TF" value={tf} description="Trust Flow" />
        </div>
        {!compact ? (
          <div className="grid gap-y-2 gap-x-6 text-sm sm:grid-cols-2 border-t pt-4">
            <InfoRow label="참조 도메인" value={formatCount(metrics.ahrefsRefDomains)} sub="Ahrefs 기준 백링크 도메인 수" />
            <InfoRow label="예상 월간 트래픽" value={formatCount(metrics.ahrefsTraffic)} sub="Ahrefs 유기 트래픽 추정" />
            <InfoRow label="유기 키워드" value={formatCount(metrics.ahrefsOrganicKeywords)} sub="구글 유기 노출 키워드" />
            <InfoRow label="총 백링크" value={formatCount(metrics.ahrefsBacklinks)} sub="Ahrefs 기준" />
          </div>
        ) : null}
        <p className="text-[11px] text-muted-foreground">
          * 데이터는 Moz, Ahrefs, Majestic에서 집계된 외부 지표입니다. 도메인 종합 권위도를 가늠하는 참고 수치로 활용하세요.
        </p>
      </CardContent>
    </Card>
  );
}

export function MetricTile({ label, value, description }: { label: string; value: number | null; description: string }) {
  const tier = metricTier(value);
  return (
    <div className="rounded-lg border bg-muted/30 p-4 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-bold tabular-nums">{value != null ? Math.round(value) : "-"}</div>
      <div className={`mt-1 text-[11px] font-medium ${tier.color}`}>{tier.label}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{description}</div>
    </div>
  );
}

export function InfoRow({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{sub}</div>
      </div>
      <div className="tabular-nums font-semibold text-base shrink-0">{value}</div>
    </div>
  );
}
