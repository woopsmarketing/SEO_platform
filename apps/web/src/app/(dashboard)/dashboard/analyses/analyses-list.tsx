"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Analysis {
  id: number;
  tool_type: string;
  input_summary: string | null;
  score: number | null;
  result: Record<string, unknown> | null;
  created_at: string;
}

const TOOL_LABELS: Record<string, string> = {
  "onpage-audit": "온페이지 SEO 분석",
  "meta-analyzer": "메타태그 분석",
  "meta-generator": "메타태그 분석",
};

const TABS = [
  { key: "all", label: "전체" },
  { key: "onpage-audit", label: "온페이지 SEO" },
  { key: "meta-analyzer", label: "메타태그" },
];

export function AnalysesList({ analyses }: { analyses: Analysis[] }) {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? analyses
    : analyses.filter((a) => a.tool_type === activeTab || (activeTab === "meta-analyzer" && a.tool_type === "meta-generator"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">분석 이력</h1>
          <p className="mt-1 text-muted-foreground">저장된 SEO 분석 결과를 확인하고 관리합니다.</p>
        </div>
        <Link href="/tools">
          <Button>새 분석 시작</Button>
        </Link>
      </div>

      {/* 탭 필터 */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {TABS.map((tab) => {
          const count = tab.key === "all"
            ? analyses.length
            : analyses.filter((a) => a.tool_type === tab.key || (tab.key === "meta-analyzer" && a.tool_type === "meta-generator")).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 분석 목록 */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AnalysisCard key={a.id} analysis={a} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">아직 분석 결과가 없습니다</p>
            <p className="mt-1 text-sm">무료 SEO 도구로 웹사이트를 분석해보세요.</p>
            <Link href="/tools">
              <Button className="mt-4">무료 분석 시작하기</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalysisCard({ analysis: a }: { analysis: Analysis }) {
  const [expanded, setExpanded] = useState(false);
  const summary = (a.result as Record<string, unknown>)?.summary as Record<string, unknown> | undefined;
  const isAudit = a.tool_type === "onpage-audit";
  const isMeta = a.tool_type === "meta-analyzer" || a.tool_type === "meta-generator";

  return (
    <Card>
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                isAudit ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"
              }`}>
                {TOOL_LABELS[a.tool_type] || a.tool_type}
              </span>
              <p className="text-sm font-medium truncate">{a.input_summary || "(URL 없음)"}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(a.created_at).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {a.score != null && (
              <div className={`rounded-full px-3 py-1 text-sm font-bold ${
                a.score >= 80 ? "bg-green-100 text-green-700" :
                a.score >= 60 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {a.score}점
              </div>
            )}
            {summary && (
              <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="text-xs">
                {expanded ? "접기" : "상세"}
              </Button>
            )}
          </div>
        </div>

        {/* 요약 상세 (펼침) */}
        {expanded && summary && (
          <div className="mt-4 border-t pt-4">
            {isAudit && <AuditSummary summary={summary} />}
            {isMeta && <MetaSummary summary={summary} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`inline-block h-2 w-2 rounded-full ${ok ? "bg-green-500" : "bg-red-400"}`} />;
}

function AuditSummary({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 text-sm">
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">기본 정보</p>
        <div className="flex items-center gap-2"><StatusDot ok={(summary.statusCode as number) === 200} /><span>상태코드: {String(summary.statusCode)}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.isHttps} /><span>HTTPS: {summary.isHttps ? "적용됨" : "미적용"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={(summary.loadTimeMs as number) < 3000} /><span>로딩: {String(summary.loadTimeMs)}ms</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={(summary.h1Count as number) === 1} /><span>H1: {String(summary.h1Count)}개</span></div>
      </div>
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">SEO 요소</p>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasCanonical} /><span>Canonical: {summary.hasCanonical ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasOg} /><span>OG 태그: {summary.hasOg ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasJsonLd} /><span>JSON-LD: {summary.hasJsonLd ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={(summary.imgWithoutAlt as number) === 0} /><span>이미지 alt 미설정: {String(summary.imgWithoutAlt)}개</span></div>
      </div>
      {String(summary.title || "") && (
        <div className="sm:col-span-2 mt-1">
          <p className="text-xs text-muted-foreground">Title: <span className="text-foreground">{String(summary.title)}</span></p>
        </div>
      )}
    </div>
  );
}

function MetaSummary({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 text-sm">
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">메타태그</p>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.title} /><span>Title: {summary.title ? `${String(summary.titleLength)}자` : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.description} /><span>Description: {summary.description ? `${String(summary.descriptionLength)}자` : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasCanonical} /><span>Canonical: {summary.hasCanonical ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.lang} /><span>Lang: {summary.lang ? String(summary.lang) : "없음"}</span></div>
      </div>
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">소셜 & 구조화</p>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasOgTitle} /><span>OG Title: {summary.hasOgTitle ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasOgImage} /><span>OG Image: {summary.hasOgImage ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasTwitterCard} /><span>Twitter Card: {summary.hasTwitterCard ? "있음" : "없음"}</span></div>
        <div className="flex items-center gap-2"><StatusDot ok={!!summary.hasJsonLd} /><span>JSON-LD: {summary.hasJsonLd ? "있음" : "없음"}</span></div>
      </div>
      {(summary.issuesCount as number) > 0 && (
        <div className="sm:col-span-2 mt-1">
          <p className="text-xs text-amber-600">발견된 이슈: {String(summary.issuesCount)}개</p>
        </div>
      )}
    </div>
  );
}
