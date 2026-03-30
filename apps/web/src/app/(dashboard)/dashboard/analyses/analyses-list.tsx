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
  "domain-checker": "도메인 분석",
  "keyword-analyzer": "키워드 분석",
  "keyword-research": "키워드 분석",
  "backlink-checker": "백링크 분석",
  "speed-test": "페이지 속도 분석",
  "keyword-density": "키워드 밀도 분석",
  "related-keywords": "관련 키워드",
};

const TOOL_COLORS: Record<string, string> = {
  "onpage-audit": "bg-blue-100 text-blue-700",
  "meta-analyzer": "bg-violet-100 text-violet-700",
  "meta-generator": "bg-violet-100 text-violet-700",
  "domain-checker": "bg-green-100 text-green-700",
  "keyword-analyzer": "bg-amber-100 text-amber-700",
  "keyword-research": "bg-amber-100 text-amber-700",
  "backlink-checker": "bg-rose-100 text-rose-700",
  "related-keywords": "bg-purple-100 text-purple-700",
  "speed-test": "bg-cyan-100 text-cyan-700",
  "keyword-density": "bg-orange-100 text-orange-700",
};

// 같은 도구로 취급할 타입 매핑 (meta-generator → meta-analyzer)
const TYPE_ALIAS: Record<string, string> = {
  "meta-generator": "meta-analyzer",
};

function normalizeType(type: string) {
  return TYPE_ALIAS[type] || type;
}

export function AnalysesList({ analyses }: { analyses: Analysis[] }) {
  const [activeTab, setActiveTab] = useState("all");

  // DB에 있는 tool_type을 기반으로 탭 자동 생성
  const toolTypes = Array.from(new Set(analyses.map((a) => normalizeType(a.tool_type))));
  const tabs = [
    { key: "all", label: "전체" },
    ...toolTypes.map((type) => ({
      key: type,
      label: TOOL_LABELS[type] || type,
    })),
  ];

  const filtered = activeTab === "all"
    ? analyses
    : analyses.filter((a) => normalizeType(a.tool_type) === activeTab);

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

      {/* 탭 필터 — DB의 tool_type 기반 자동 생성 */}
      <div className="flex gap-1 rounded-lg bg-muted p-1 overflow-x-auto">
        {tabs.map((tab) => {
          const count = tab.key === "all"
            ? analyses.length
            : analyses.filter((a) => normalizeType(a.tool_type) === tab.key).length;
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
  const normalizedType = normalizeType(a.tool_type);
  const isAudit = normalizedType === "onpage-audit";
  const isMeta = normalizedType === "meta-analyzer";
  const isBacklink = normalizedType === "backlink-checker";

  return (
    <Card>
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${
                TOOL_COLORS[normalizedType] || "bg-gray-100 text-gray-700"
              }`}>
                {TOOL_LABELS[normalizedType] || a.tool_type}
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
            {isAudit ? <AuditSummary summary={summary} /> :
             isMeta ? <MetaSummary summary={summary} /> :
             isBacklink ? <BacklinkSummary summary={summary} /> :
             <GenericSummary summary={summary} />}
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

function BacklinkSummary({ summary }: { summary: Record<string, unknown> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 text-sm">
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">백링크</p>
        <div>총 백링크: {String(summary.totalBacklinks ?? 0)}</div>
        <div>DoFollow: {String(summary.doFollowBacklinks ?? 0)}</div>
        <div>홈페이지 링크: {String(summary.toHomePage ?? 0)}</div>
      </div>
      <div className="space-y-1.5">
        <p className="font-medium text-xs text-muted-foreground mb-2">참조 도메인</p>
        <div>참조 도메인: {String(summary.totalDomains ?? 0)}</div>
        <div>DoFollow 도메인: {String(summary.doFollowDomains ?? 0)}</div>
      </div>
    </div>
  );
}

function GenericSummary({ summary }: { summary: Record<string, unknown> }) {
  const entries = Object.entries(summary).filter(([, v]) => v !== null && v !== undefined);
  return (
    <div className="grid gap-2 sm:grid-cols-2 text-sm">
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          {typeof value === "boolean" ? <StatusDot ok={value} /> : null}
          <span className="text-muted-foreground">{key}:</span>
          <span>{String(value)}</span>
        </div>
      ))}
    </div>
  );
}
