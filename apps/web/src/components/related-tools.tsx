import Link from "next/link";

interface Tool {
  name: string;
  desc: string;
  href: string;
}

const TOOL_MAP: Record<string, Tool[]> = {
  "onpage-audit": [
    { name: "메타태그 분석기", desc: "메타태그도 상세하게 점검해보세요", href: "/tools/meta-generator" },
    { name: "백링크 조회", desc: "외부 링크 현황을 확인하세요", href: "/tools/backlink-checker" },
    { name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
  ],
  "meta-generator": [
    { name: "온페이지 SEO 분석", desc: "사이트 전체를 35개 항목으로 점검", href: "/tools/onpage-audit" },
    { name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { name: "사이트맵 생성기", desc: "검색엔진 색인을 위한 사이트맵", href: "/tools/sitemap-generator" },
  ],
  "keyword-research": [
    { name: "키워드 밀도 분석", desc: "페이지 내 키워드 비율을 확인", href: "/tools/keyword-density" },
    { name: "연관 키워드", desc: "더 많은 키워드 아이디어 발굴", href: "/tools/keyword-related" },
    { name: "온페이지 SEO 분석", desc: "키워드가 적용된 페이지를 점검", href: "/tools/onpage-audit" },
  ],
  "keyword-density": [
    { name: "키워드 분석", desc: "더 많은 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { name: "연관 키워드", desc: "관련 키워드 아이디어 발굴", href: "/tools/keyword-related" },
    { name: "메타태그 분석기", desc: "메타태그에 키워드가 반영됐는지 확인", href: "/tools/meta-generator" },
  ],
  "keyword-related": [
    { name: "키워드 분석", desc: "검색량과 경쟁도를 확인하세요", href: "/tools/keyword-research" },
    { name: "키워드 밀도 분석", desc: "페이지 내 키워드 최적화 확인", href: "/tools/keyword-density" },
    { name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
  ],
  "backlink-checker": [
    { name: "온페이지 SEO 분석", desc: "내부 SEO도 함께 점검하세요", href: "/tools/onpage-audit" },
    { name: "키워드 분석", desc: "타겟 키워드를 찾아보세요", href: "/tools/keyword-research" },
    { name: "메타태그 분석기", desc: "메타태그를 최적화하세요", href: "/tools/meta-generator" },
  ],
  "robots-generator": [
    { name: "사이트맵 생성기", desc: "사이트맵도 함께 만들어보세요", href: "/tools/sitemap-generator" },
    { name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
    { name: "메타태그 분석기", desc: "메타태그도 확인해보세요", href: "/tools/meta-generator" },
  ],
  "sitemap-generator": [
    { name: "Robots.txt 생성기", desc: "robots.txt도 함께 만들어보세요", href: "/tools/robots-generator" },
    { name: "온페이지 SEO 분석", desc: "사이트 전체 SEO를 점검하세요", href: "/tools/onpage-audit" },
    { name: "백링크 조회", desc: "백링크 현황을 확인하세요", href: "/tools/backlink-checker" },
  ],
};

export function RelatedTools({ currentTool }: { currentTool: string }) {
  const tools = TOOL_MAP[currentTool];
  if (!tools) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3">다른 무료 도구도 사용해보세요</h3>
      <div className="grid gap-2 sm:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900">{tool.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
            </div>
            <span className="text-gray-300 shrink-0 mt-0.5">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
