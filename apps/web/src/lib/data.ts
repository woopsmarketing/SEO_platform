export interface Tool {
  title: string;
  href: string;
  description: string;
  icon: string;
  ready: boolean;
}

export interface Service {
  title: string;
  href: string;
  description: string;
}

export const tools: Tool[] = [
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
  {
    title: "도메인 분석기",
    href: "/tools/domain-checker",
    description: "도메인의 SEO 지표(DA, PA, 백링크)를 빠르게 확인합니다.",
    icon: "🔍",
    ready: false,
  },
  {
    title: "온페이지 SEO 분석",
    href: "/tools/onpage-audit",
    description: "URL을 입력하면 35개 항목을 검사하고 AI가 점수와 개선 방안을 제시합니다.",
    icon: "📊",
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
