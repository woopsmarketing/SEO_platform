import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ParsedSeo {
  loadTimeMs: number;
  isHttps: boolean;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1: string[];
  imgTotal: number;
  imgWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  hasOgTitle: boolean;
  hasOgDescription: boolean;
  hasOgImage: boolean;
  hasStructuredData: boolean;
  hasGzip: boolean;
  hasHsts: boolean;
  hasViewport: boolean;
  textToHtmlRatio: number;
  wordCount: number;
  duplicateH1: boolean;
  canonical: string | null;
  hasTwitterCard: boolean;
}

interface ServiceRecommendation {
  icon: string;
  title: string;
  desc: string;
  href: string;
  btnText: string;
  priority: number;
}

function detectIssues(parsed: ParsedSeo): ServiceRecommendation[] {
  const recs: ServiceRecommendation[] = [];

  // 1. 사이트 속도 느림
  if (parsed.loadTimeMs > 3000) {
    recs.push({
      icon: "⚡",
      title: "사이트 로딩 속도가 느립니다",
      desc: `현재 로딩 시간 ${(parsed.loadTimeMs / 1000).toFixed(1)}초 — Google은 3초 이내를 권장합니다. 로딩이 느리면 이탈률이 급격히 증가하고 검색 순위에 불이익을 받습니다.`,
      href: "/services/web-design",
      btnText: "속도 최적화 문의하기",
      priority: 10,
    });
  }

  // 2. 백링크/외부링크 부족
  if (parsed.externalLinks === 0) {
    recs.push({
      icon: "🔗",
      title: "외부 링크와 백링크가 부족합니다",
      desc: "외부 링크가 0개입니다. 고품질 백링크는 구글 순위를 올리는 가장 강력한 외부 요소입니다. 도메인 권한을 높여 검색 순위를 개선하세요.",
      href: "/services/backlinks",
      btnText: "백링크 서비스 알아보기",
      priority: 9,
    });
  }

  // 3. HTTPS 미적용
  if (!parsed.isHttps) {
    recs.push({
      icon: "🔒",
      title: "HTTPS(SSL)가 적용되지 않았습니다",
      desc: "Google은 HTTPS를 랭킹 시그널로 사용합니다. HTTP 사이트는 '안전하지 않음' 경고가 표시되어 사용자 신뢰도가 크게 떨어집니다.",
      href: "/services/web-design",
      btnText: "SSL 설치 문의하기",
      priority: 8,
    });
  }

  // 4. 메타태그 문제
  if (!parsed.title || parsed.titleLength < 15 || !parsed.metaDescription || parsed.metaDescriptionLength < 40) {
    recs.push({
      icon: "🏷️",
      title: "메타태그 최적화가 필요합니다",
      desc: `${!parsed.title ? "Title 태그가 없습니다. " : parsed.titleLength < 15 ? "Title이 너무 짧습니다. " : ""}${!parsed.metaDescription ? "Meta Description이 없습니다. " : parsed.metaDescriptionLength < 40 ? "Description이 너무 짧습니다. " : ""}검색 결과 클릭률에 직접 영향을 주는 핵심 요소입니다.`,
      href: "/services/backlinks",
      btnText: "SEO 최적화 문의하기",
      priority: 7,
    });
  }

  // 5. 구조화 데이터 없음
  if (!parsed.hasStructuredData) {
    recs.push({
      icon: "📊",
      title: "구조화 데이터(JSON-LD)가 없습니다",
      desc: "구조화 데이터를 추가하면 Google 검색 결과에서 리치 스니펫(별점, FAQ 등)으로 노출되어 클릭률이 최대 30% 향상됩니다.",
      href: "/services/web-design",
      btnText: "구조화 데이터 구현 문의",
      priority: 5,
    });
  }

  // 6. OG 태그 누락
  if (!parsed.hasOgTitle || !parsed.hasOgDescription || !parsed.hasOgImage) {
    recs.push({
      icon: "📱",
      title: "소셜 미디어 공유 설정이 부족합니다",
      desc: "Open Graph 태그가 완전하지 않아 카카오톡, 페이스북 등에서 링크 공유 시 미리보기가 제대로 표시되지 않습니다.",
      href: "/services/web-design",
      btnText: "OG 태그 설정 문의",
      priority: 4,
    });
  }

  // 7. 이미지 alt 누락
  if (parsed.imgTotal > 0 && parsed.imgWithoutAlt > 0) {
    const ratio = Math.round((parsed.imgWithoutAlt / parsed.imgTotal) * 100);
    recs.push({
      icon: "🖼️",
      title: "이미지 alt 태그가 누락되었습니다",
      desc: `전체 ${parsed.imgTotal}개 이미지 중 ${parsed.imgWithoutAlt}개(${ratio}%)에 alt 태그가 없습니다. 이미지 검색 노출 기회를 놓치고 있으며 웹 접근성에도 문제가 됩니다.`,
      href: "/services/web-design",
      btnText: "이미지 SEO 최적화 문의",
      priority: 3,
    });
  }

  // 8. 콘텐츠 부족
  if (parsed.wordCount < 300 && parsed.textToHtmlRatio >= 10) {
    recs.push({
      icon: "📝",
      title: "콘텐츠가 부족합니다",
      desc: `현재 단어 수 ${parsed.wordCount}개 — Google은 충분한 콘텐츠가 있는 페이지를 선호합니다. SEO에 최적화된 고품질 콘텐츠를 추가하면 검색 노출이 크게 개선됩니다.`,
      href: "/services/backlinks",
      btnText: "콘텐츠 SEO 문의하기",
      priority: 6,
    });
  }

  // 9. 모바일 최적화 안 됨
  if (!parsed.hasViewport) {
    recs.push({
      icon: "📱",
      title: "모바일 최적화가 되어 있지 않습니다",
      desc: "Viewport 메타태그가 없어 모바일에서 사이트가 제대로 표시되지 않을 수 있습니다. Google은 모바일 우선 색인을 사용합니다.",
      href: "/services/web-design",
      btnText: "반응형 웹 제작 문의",
      priority: 8,
    });
  }

  // 10. Gzip 미적용
  if (!parsed.hasGzip) {
    recs.push({
      icon: "📦",
      title: "Gzip 압축이 적용되지 않았습니다",
      desc: "Gzip 압축을 적용하면 페이지 크기를 60~80% 줄일 수 있어 로딩 속도가 크게 향상됩니다.",
      href: "/services/web-design",
      btnText: "서버 최적화 문의하기",
      priority: 4,
    });
  }

  // priority 높은 순으로 정렬, 최대 3개만
  return recs.sort((a, b) => b.priority - a.priority).slice(0, 3);
}

export function SmartServiceCta({ parsed }: { parsed: ParsedSeo }) {
  const recommendations = detectIssues(parsed);

  if (recommendations.length === 0) {
    // 문제가 없어도 백링크 일반 배너는 표시
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-green-900">SEO 상태가 양호합니다</h3>
            <p className="text-sm text-green-700 mt-1">이제 고품질 백링크로 검색 순위를 더 높여보세요.</p>
          </div>
          <Link href="/services/backlinks" className="shrink-0">
            <Button variant="outline" className="border-green-300 text-green-800 hover:bg-green-100">
              백링크 서비스 알아보기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">SEO월드가 해결해드립니다</h3>
      <p className="text-sm text-muted-foreground">분석 결과를 기반으로 가장 시급한 개선 사항을 추천해드립니다.</p>
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-3">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">{rec.icon}</div>
            <h4 className="text-sm font-bold text-gray-900">{rec.title}</h4>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">{rec.desc}</p>
            <Link href={rec.href} className="mt-3 block">
              <Button size="sm" className="w-full text-xs">
                {rec.btnText}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
