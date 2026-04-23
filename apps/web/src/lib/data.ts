export type ToolBadge = "NEW" | "HOT";

export interface Tool {
  title: string;
  href: string;
  description: string;
  icon: string;
  ready: boolean;
  badge?: ToolBadge;
}

export interface Service {
  title: string;
  href: string;
  description: string;
}

export const tools: Tool[] = [
  {
    title: "온페이지 SEO 분석",
    href: "/tools/onpage-audit",
    description: "URL을 입력하면 35개 항목을 검사하고 AI가 점수와 개선 방안을 제시합니다.",
    icon: "📊",
    ready: true,
    badge: "HOT",
  },
  {
    title: "백링크 분석기",
    href: "/tools/backlink-checker",
    description: "도메인의 백링크 목록, 참조 도메인, 품질 점수, 성장 추세를 분석합니다.",
    icon: "🔗",
    ready: true,
    badge: "HOT",
  },
  {
    title: "도메인 권위 체커",
    href: "/tools/domain-authority",
    description: "Moz DA, Ahrefs DR, Majestic TF를 한 번에 확인합니다.",
    icon: "🏆",
    ready: true,
    badge: "NEW",
  },
  {
    title: "도메인 비교기",
    href: "/tools/domain-compare",
    description: "두 도메인의 SEO 지표를 레이더 차트로 비교합니다.",
    icon: "⚖️",
    ready: true,
    badge: "NEW",
  },
  {
    title: "SERP 순위 체커",
    href: "/tools/serp-checker",
    description: "키워드로 내 도메인의 구글 순위를 즉시 확인합니다.",
    icon: "🎯",
    ready: true,
    badge: "NEW",
  },
  {
    title: "지역 SERP 체커",
    href: "/tools/local-serp",
    description: "국가·언어별로 구글 검색 결과를 비교합니다.",
    icon: "🌏",
    ready: true,
    badge: "NEW",
  },
  {
    title: "People Also Ask",
    href: "/tools/people-also-ask",
    description: "구글이 제안하는 연관 질문 목록을 추출합니다.",
    icon: "❓",
    ready: true,
    badge: "NEW",
  },
  {
    title: "SERP 난이도 맵",
    href: "/tools/serp-difficulty",
    description: "상위 10개 도메인 DA 평균으로 키워드 난이도를 평가합니다.",
    icon: "🗻",
    ready: true,
    badge: "NEW",
  },
  {
    title: "키워드 리서치",
    href: "/tools/keyword-research",
    description: "시드 키워드의 확장, 검색량, 경쟁도(DA)를 한 번에 확인합니다.",
    icon: "🔍",
    ready: true,
    badge: "HOT",
  },
  {
    title: "롱테일 키워드 발굴기",
    href: "/tools/longtail-keywords",
    description: "시드 키워드에서 질문형·롱테일 키워드를 추출합니다.",
    icon: "🌱",
    ready: true,
    badge: "NEW",
  },
  {
    title: "연관 키워드",
    href: "/tools/keyword-related",
    description: "확장 키워드를 발굴합니다.",
    icon: "🧩",
    ready: true,
  },
  {
    title: "키워드 밀도 분석",
    href: "/tools/keyword-density",
    description: "콘텐츠의 키워드 분포를 분석합니다.",
    icon: "📈",
    ready: true,
  },
  {
    title: "키워드 갭 분석",
    href: "/tools/keyword-gap",
    description: "경쟁사가 잡고 있는 키워드 중 내가 놓친 것을 찾아냅니다.",
    icon: "🎭",
    ready: true,
    badge: "NEW",
  },
  {
    title: "백링크 갭 분석",
    href: "/tools/backlink-gap",
    description: "경쟁사만 가진 백링크 소스를 DA 순으로 보여줍니다.",
    icon: "🔀",
    ready: true,
    badge: "NEW",
  },
  {
    title: "공통 백링크 도메인",
    href: "/tools/common-backlinks",
    description: "여러 경쟁사가 공통으로 받고 있는 백링크 소스를 찾습니다.",
    icon: "🔗",
    ready: true,
    badge: "NEW",
  },
  {
    title: "경쟁사 도메인 발굴",
    href: "/tools/competitor-discovery",
    description: "시드 키워드로 상위에 노출되는 경쟁 도메인을 발굴합니다.",
    icon: "🧭",
    ready: true,
    badge: "NEW",
  },
  {
    title: "내 노출 키워드 TOP 20",
    href: "/tools/my-top-keywords",
    description: "내 도메인이 구글에 노출되는 상위 20개 키워드와 순위를 확인합니다.",
    icon: "🥇",
    ready: true,
    badge: "NEW",
  },
  {
    title: "콘텐츠 갭 분석",
    href: "/tools/content-gap",
    description: "경쟁 콘텐츠가 다루지만 내가 놓친 토픽을 찾아냅니다.",
    icon: "📝",
    ready: true,
    badge: "NEW",
  },
  {
    title: "스니펫 옵티마이저",
    href: "/tools/snippet-optimizer",
    description: "AI가 CTR을 높이는 title/description을 제안합니다.",
    icon: "✨",
    ready: true,
    badge: "NEW",
  },
  {
    title: "깨진 백링크 복구",
    href: "/tools/broken-backlink-recovery",
    description: "내 도메인으로 향하는 404 백링크를 찾아 복구 방법을 제시합니다.",
    icon: "🔧",
    ready: true,
    badge: "NEW",
  },
  {
    title: "메타태그 분석기",
    href: "/tools/meta-generator",
    description: "URL을 입력하면 메타태그를 자동 분석하고 AI가 최적화된 제목, 설명, 키워드를 추천합니다.",
    icon: "🏷️",
    ready: true,
  },
  {
    title: "Robots.txt 생성기",
    href: "/tools/robots-generator",
    description: "검색엔진 크롤러를 위한 robots.txt 파일을 간편하게 생성합니다.",
    icon: "🤖",
    ready: true,
  },
  {
    title: "사이트맵 생성기",
    href: "/tools/sitemap-generator",
    description: "URL을 입력하면 사이트를 크롤링하여 sitemap.xml을 자동으로 생성합니다.",
    icon: "🗺️",
    ready: true,
  },
];

export const services: Service[] = [
  {
    title: "백링크 서비스",
    href: "/services/backlinks",
    description: "고품질 백링크 구축으로 도메인 권위를 높입니다.",
  },
  {
    title: "트래픽 서비스",
    href: "/services/traffic",
    description: "타겟 키워드 기반 오가닉 트래픽을 유입합니다.",
  },
  {
    title: "웹 디자인",
    href: "/services/web-design",
    description: "SEO 최적화된 웹사이트를 설계하고 제작합니다.",
  },
  {
    title: "도메인 브로커",
    href: "/services/domain-broker",
    description: "프리미엄 도메인 매입/매각을 중개합니다.",
  },
];

/** Homepage uses shorter descriptions */
export const homeTools = tools.slice(0, 4).map((t) => ({
  title: t.title,
  href: t.href,
  desc: t.description,
  icon: t.icon,
}));

export const homeServices = services.map((s) => ({
  title: s.title,
  href: s.href,
  desc: s.description,
}));

/**
 * 툴 슬러그 ("onpage-audit" 등)로 Tool 객체를 가져옵니다.
 * `/tools/` 접두사를 허용합니다.
 */
export function getToolBySlug(slug: string): Tool | undefined {
  const cleanSlug = slug.replace(/^\/?tools\//, "").replace(/^\/+|\/+$/g, "");
  const href = `/tools/${cleanSlug}`;
  return tools.find((t) => t.href === href);
}

/**
 * 주어진 슬러그를 제외한 툴 중에서 랜덤(결정적) 하게 N개를 반환합니다.
 * TOOL_MAP 수동 매핑에 없는 툴의 fallback 추천용.
 */
export function getFallbackRelatedTools(currentSlug: string, count = 3): Tool[] {
  const cleanSlug = currentSlug.replace(/^\/?tools\//, "").replace(/^\/+|\/+$/g, "");
  const currentHref = `/tools/${cleanSlug}`;

  // 슬러그 해시로 시드 산출 — SSR/CSR 동일 결과
  let seed = 0;
  for (let i = 0; i < cleanSlug.length; i++) {
    seed = (seed * 31 + cleanSlug.charCodeAt(i)) >>> 0;
  }

  const candidates = tools.filter((t) => t.ready && t.href !== currentHref);
  // 간단한 결정적 셔플 (LCG 기반)
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    const tmp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = tmp;
  }

  return shuffled.slice(0, count);
}
