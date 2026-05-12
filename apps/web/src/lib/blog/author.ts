import { SITE_URL } from "@/lib/constants";

/**
 * SEO월드 단일 저자 정보 (1인 운영).
 *
 * 추후 변경 시 이 파일만 수정하면 됩니다.
 * - 프로필 사진 추가: `image`를 실제 이미지 URL로 교체
 * - 소셜 계정 추가: `sameAs`에 LinkedIn/X URL 추가
 */
export const AUTHOR = {
  slug: "choi-hyukmyung",
  name: "최혁명",
  jobTitle: "SEO 컨설턴트",
  bio: "검색엔진 최적화(SEO) 전문가. SEO월드를 운영하며 실전 SEO 가이드와 무료 분석 도구를 만들고 있습니다. 국내외 SEO 트렌드를 실무 관점에서 풀어내는 콘텐츠를 만듭니다.",
  shortBio: "SEO 컨설턴트 · SEO월드 운영자",
  image: "https://ui-avatars.com/api/?name=%EC%B5%9C%ED%98%81%EB%AA%85&background=2563eb&color=fff&size=256&font-size=0.5&bold=true",
  knowsAbout: [
    "SEO",
    "검색엔진 최적화",
    "백링크",
    "키워드 분석",
    "테크니컬 SEO",
    "온페이지 SEO",
    "콘텐츠 SEO",
  ],
  /** 보유 소셜 계정 URL. 사용자가 알려주면 채워 넣을 것. */
  sameAs: [] as string[],
} as const;

export const AUTHOR_URL = `${SITE_URL}/author/${AUTHOR.slug}`;

/** Person schema 객체 (Article schema의 author로 사용) */
export function getAuthorPersonSchema() {
  const schema: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${AUTHOR_URL}#person`,
    name: AUTHOR.name,
    url: AUTHOR_URL,
    image: AUTHOR.image,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio,
    knowsAbout: AUTHOR.knowsAbout,
  };
  if (AUTHOR.sameAs.length > 0) {
    schema.sameAs = AUTHOR.sameAs;
  }
  return schema;
}
