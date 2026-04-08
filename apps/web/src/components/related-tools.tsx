"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Tool {
  name: string;
  desc: string;
  href: string;
  icon: string;
}

const TOOL_MAP: Record<string, Tool[]> = {
  "onpage-audit": [
    { icon: "🏷️", name: "메타태그 분석기", desc: "메타태그도 상세하게 점검해보세요", href: "/tools/meta-generator" },
    { icon: "🔗", name: "백링크 조회", desc: "외부 링크 현황을 확인하세요", href: "/tools/backlink-checker" },
    { icon: "🔍", name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
  ],
  "meta-generator": [
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체를 35개 항목으로 점검", href: "/tools/onpage-audit" },
    { icon: "🔍", name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { icon: "🗺️", name: "사이트맵 생성기", desc: "검색엔진 색인을 위한 사이트맵", href: "/tools/sitemap-generator" },
  ],
  "keyword-research": [
    { icon: "📏", name: "키워드 밀도 분석", desc: "페이지 내 키워드 비율을 확인", href: "/tools/keyword-density" },
    { icon: "💡", name: "연관 키워드", desc: "더 많은 키워드 아이디어 발굴", href: "/tools/keyword-related" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "키워드가 적용된 페이지를 점검", href: "/tools/onpage-audit" },
  ],
  "keyword-density": [
    { icon: "🔍", name: "키워드 분석", desc: "더 많은 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { icon: "💡", name: "연관 키워드", desc: "관련 키워드 아이디어 발굴", href: "/tools/keyword-related" },
    { icon: "🏷️", name: "메타태그 분석기", desc: "메타태그에 키워드가 반영됐는지 확인", href: "/tools/meta-generator" },
  ],
  "keyword-related": [
    { icon: "🔍", name: "키워드 분석", desc: "검색량과 경쟁도를 확인하세요", href: "/tools/keyword-research" },
    { icon: "📏", name: "키워드 밀도 분석", desc: "페이지 내 키워드 최적화 확인", href: "/tools/keyword-density" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
  ],
  "backlink-checker": [
    { icon: "📊", name: "온페이지 SEO 분석", desc: "내부 SEO도 함께 점검하세요", href: "/tools/onpage-audit" },
    { icon: "🔍", name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { icon: "🏷️", name: "메타태그 분석기", desc: "메타태그를 최적화하세요", href: "/tools/meta-generator" },
  ],
  "robots-generator": [
    { icon: "🗺️", name: "사이트맵 생성기", desc: "사이트맵도 함께 만들어보세요", href: "/tools/sitemap-generator" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
    { icon: "🏷️", name: "메타태그 분석기", desc: "메타태그도 확인해보세요", href: "/tools/meta-generator" },
  ],
  "sitemap-generator": [
    { icon: "🤖", name: "Robots.txt 생성기", desc: "robots.txt도 함께 만들어보세요", href: "/tools/robots-generator" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
    { icon: "🔗", name: "백링크 조회", desc: "백링크 현황을 확인하세요", href: "/tools/backlink-checker" },
  ],
};

export function RelatedTools({ currentTool }: { currentTool: string }) {
  const tools = TOOL_MAP[currentTool];
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/tool-usage")
      .then((r) => r.json())
      .then((d) => setTotalCount(d.totalAnalyses ?? null))
      .catch(() => {});
  }, []);

  if (!tools) return null;

  return (
    <div className="space-y-6">
      {/* 통합 CTA: 소셜 프루프 + 서비스 안내 + 문의 */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <div className="text-center">
          {totalCount !== null && totalCount > 0 && (
            <p className="text-xs font-medium text-blue-200 mb-3">
              지금까지 {totalCount.toLocaleString()}건의 SEO 분석이 완료되었습니다
            </p>
          )}
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            분석은 끝났습니다. 이제 순위를 올릴 차례입니다.
          </h3>
          <p className="text-blue-100 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            백링크 구축부터 기술 SEO까지, 전문 팀이 검색 1페이지로 올려드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-blue-700 font-bold px-6 py-3 text-sm hover:bg-blue-50 transition-colors shadow-md"
            >
              무료 SEO 진단 받기
            </Link>
            <Link
              href="/services/backlinks"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/15 text-white font-semibold px-6 py-3 text-sm hover:bg-white/25 transition-colors border border-white/30"
            >
              백링크 서비스 알아보기
            </Link>
          </div>
        </div>
      </div>

      {/* 다른 무료 도구 */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">다른 무료 SEO 도구도 사용해보세요</h3>
          <p className="text-sm text-gray-600 mt-1">SEO 최적화에 필요한 모든 도구를 무료로 제공합니다</p>
        </div>
        <div className="space-y-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-4 rounded-xl border border-blue-100 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl shrink-0 group-hover:bg-blue-100 transition-colors">
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900">{tool.name}</p>
                <p className="text-sm text-gray-500">{tool.desc}</p>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                사용하기
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
