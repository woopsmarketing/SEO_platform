"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFallbackRelatedTools } from "@/lib/data";

interface Tool {
  name: string;
  desc: string;
  href: string;
  icon: string;
}

const TOOL_MAP: Record<string, Tool[]> = {
  "onpage-audit": [
    { icon: "🏷️", name: "메타태그 분석기", desc: "메타태그도 상세하게 점검해보세요", href: "/tools/meta-generator" },
    { icon: "🔗", name: "백링크 서비스", desc: "검색 순위를 높이는 고품질 백링크 구축", href: "/services/backlinks" },
  ],
  "meta-generator": [
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체를 35개 항목으로 점검", href: "/tools/onpage-audit" },
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
  "domain-authority": [
    { icon: "⚖️", name: "도메인 비교기", desc: "두 도메인의 DA/DR을 나란히 비교", href: "/tools/domain-compare" },
    { icon: "🔗", name: "백링크 분석기", desc: "백링크 프로필을 점검하세요", href: "/tools/backlink-checker" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "내부 SEO 35개 항목 진단", href: "/tools/onpage-audit" },
  ],
  "domain-compare": [
    { icon: "🏆", name: "도메인 권위 체커", desc: "단일 도메인의 DA/DR/TF 확인", href: "/tools/domain-authority" },
    { icon: "🔗", name: "백링크 분석기", desc: "백링크 프로필 비교", href: "/tools/backlink-checker" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "내부 SEO 진단", href: "/tools/onpage-audit" },
  ],
  "robots-generator": [
    { icon: "🗺️", name: "사이트맵 생성기", desc: "사이트맵도 함께 만들어보세요", href: "/tools/sitemap-generator" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
  ],
  "sitemap-generator": [
    { icon: "📊", name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
    { icon: "🤖", name: "Robots.txt 생성기", desc: "robots.txt도 함께 만들어보세요", href: "/tools/robots-generator" },
  ],
  "serp-checker": [
    { icon: "🌏", name: "지역 SERP 체커", desc: "국가·언어별 결과를 비교", href: "/tools/local-serp" },
    { icon: "🗻", name: "SERP 난이도 맵", desc: "키워드 난이도를 평가", href: "/tools/serp-difficulty" },
    { icon: "🥇", name: "내 노출 키워드 TOP 20", desc: "노출 키워드 상위 20개 확인", href: "/tools/my-top-keywords" },
  ],
  "local-serp": [
    { icon: "🎯", name: "SERP 순위 체커", desc: "한국 기준 순위 확인", href: "/tools/serp-checker" },
    { icon: "❓", name: "People Also Ask", desc: "연관 질문 추출", href: "/tools/people-also-ask" },
  ],
  "people-also-ask": [
    { icon: "🔍", name: "키워드 리서치", desc: "관련 키워드 발굴", href: "/tools/keyword-research" },
    { icon: "📝", name: "콘텐츠 갭 분석", desc: "경쟁이 다루는 토픽 발굴", href: "/tools/content-gap" },
  ],
  "serp-difficulty": [
    { icon: "🎯", name: "SERP 순위 체커", desc: "내 순위도 즉시 확인", href: "/tools/serp-checker" },
    { icon: "🌱", name: "롱테일 키워드", desc: "경쟁 낮은 롱테일 발굴", href: "/tools/longtail-keywords" },
  ],
  "longtail-keywords": [
    { icon: "🔍", name: "키워드 리서치", desc: "검색량·경쟁도 확인", href: "/tools/keyword-research" },
    { icon: "🗻", name: "SERP 난이도 맵", desc: "상위 도메인 평균 DA", href: "/tools/serp-difficulty" },
  ],
  "snippet-optimizer": [
    { icon: "🏷️", name: "메타태그 분석기", desc: "현재 메타태그 점검", href: "/tools/meta-generator" },
    { icon: "📊", name: "온페이지 SEO 분석", desc: "내부 SEO 종합 진단", href: "/tools/onpage-audit" },
  ],
  "content-gap": [
    { icon: "❓", name: "People Also Ask", desc: "다룰 만한 질문 발굴", href: "/tools/people-also-ask" },
    { icon: "🎭", name: "키워드 갭 분석", desc: "경쟁이 잡은 키워드 탐색", href: "/tools/keyword-gap" },
  ],
  "keyword-gap": [
    { icon: "🥇", name: "내 노출 키워드 TOP 20", desc: "이미 노출된 키워드 확인", href: "/tools/my-top-keywords" },
    { icon: "📝", name: "콘텐츠 갭 분석", desc: "경쟁 콘텐츠 분석", href: "/tools/content-gap" },
  ],
  "backlink-gap": [
    { icon: "🔗", name: "공통 백링크 도메인", desc: "경쟁사 공통 소스 탐색", href: "/tools/common-backlinks" },
    { icon: "🔗", name: "백링크 분석기", desc: "내 백링크 점검", href: "/tools/backlink-checker" },
  ],
  "common-backlinks": [
    { icon: "🔀", name: "백링크 갭 분석", desc: "경쟁사만 가진 백링크", href: "/tools/backlink-gap" },
    { icon: "🧭", name: "경쟁사 도메인 발굴", desc: "경쟁 도메인 탐색", href: "/tools/competitor-discovery" },
  ],
  "competitor-discovery": [
    { icon: "🏆", name: "도메인 권위 체커", desc: "발굴한 도메인을 심층 분석", href: "/tools/domain-authority" },
    { icon: "⚖️", name: "도메인 비교기", desc: "두 도메인을 나란히 비교", href: "/tools/domain-compare" },
  ],
  "my-top-keywords": [
    { icon: "🎯", name: "SERP 순위 체커", desc: "특정 키워드 순위 재확인", href: "/tools/serp-checker" },
    { icon: "🎭", name: "키워드 갭 분석", desc: "경쟁사 키워드와 비교", href: "/tools/keyword-gap" },
  ],
};

function fallbackFromData(currentTool: string): Tool[] {
  return getFallbackRelatedTools(currentTool, 3).map((t) => ({
    name: t.title,
    desc: t.description,
    href: t.href,
    icon: t.icon,
  }));
}

export function RelatedTools({ currentTool }: { currentTool: string }) {
  // TOOL_MAP 수동 큐레이션 우선, 없으면 data.ts 기반 fallback
  const tools = TOOL_MAP[currentTool] ?? fallbackFromData(currentTool);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="space-y-6">
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
