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
    title: "Meta Tag Generator",
    href: "/tools/meta-generator",
    description: "SEO에 최적화된 메타 태그를 간편하게 생성합니다.",
    icon: "🏷️",
    ready: true,
  },
  {
    title: "Robots.txt Generator",
    href: "/tools/robots-generator",
    description: "검색엔진 크롤러를 위한 robots.txt 파일을 생성합니다.",
    icon: "🤖",
    ready: true,
  },
  {
    title: "Sitemap.xml Generator",
    href: "/tools/sitemap-generator",
    description: "sitemap.xml을 생성하여 검색엔진 색인을 최적화합니다.",
    icon: "🗺️",
    ready: true,
  },
  {
    title: "Domain Checker",
    href: "/tools/domain-checker",
    description: "도메인의 SEO 지표(DA, PA, 백링크)를 빠르게 확인합니다.",
    icon: "🔍",
    ready: false,
  },
  {
    title: "On-page SEO Audit",
    href: "/tools/onpage-audit",
    description: "URL을 입력하면 AI가 온페이지 SEO를 분석하고 개선 방안을 제시합니다.",
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
