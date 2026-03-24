import type { Metadata } from "next";

interface DomainDetailPageProps {
  params: { domain: string };
}

export async function generateMetadata({
  params,
}: DomainDetailPageProps): Promise<Metadata> {
  return {
    title: `${params.domain} 도메인 분석`,
    description: `${params.domain}의 SEO 지표, 백링크, 히스토리 분석 결과`,
  };
}

export default function DomainDetailPage({ params }: DomainDetailPageProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">{params.domain}</h1>
      <p className="mt-2 text-muted-foreground">도메인 상세 분석 결과</p>
      {/* TODO: SEO 지표 카드 (DA, PA, 백링크 수 등) */}
      {/* TODO: Whois 정보 */}
      {/* TODO: 히스토리 타임라인 */}
      {/* TODO: 관련 도메인 추천 */}
    </div>
  );
}
