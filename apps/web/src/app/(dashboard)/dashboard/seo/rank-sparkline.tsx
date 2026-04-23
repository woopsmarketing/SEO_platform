"use client";

import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { KeywordTrend } from "./types";

interface SparklineProps {
  history: KeywordTrend[];
}

// Tooltip 값 포맷터는 recharts의 Formatter 타입에 맞춰 unknown 반환으로 좁게 사용
function formatTooltipValue(value: unknown): [string, string] {
  if (value == null) return ["100위 밖", "순위"];
  return [`${value}위`, "순위"];
}

function formatTooltipLabel(label: unknown): string {
  if (typeof label !== "string") return "";
  const d = new Date(label);
  if (Number.isNaN(d.getTime())) return label;
  return d.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

export function RankSparkline({ history }: SparklineProps) {
  if (history.length === 0) {
    return <span className="text-xs text-muted-foreground">데이터 없음</span>;
  }

  // recharts는 null 값을 자동으로 gap으로 표시. 순위는 낮을수록 좋으므로 reversed.
  const data = history.map((h) => ({
    checkedAt: h.checkedAt,
    rank: h.rank == null ? null : h.rank,
  }));

  // 최신 순위 기반 색상 (1~10 emerald, 11~30 amber, 그 외 red)
  const latestRank = history[history.length - 1]?.rank;
  const strokeColor =
    latestRank == null
      ? "#94a3b8" // slate-400
      : latestRank <= 10
        ? "#059669" // emerald-600
        : latestRank <= 30
          ? "#d97706" // amber-600
          : "#dc2626"; // red-600

  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <YAxis
            reversed
            domain={[1, 100]}
            hide
          />
          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={formatTooltipLabel}
            contentStyle={{
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="rank"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
