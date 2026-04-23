export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  tag?: "NEW" | "IMPROVED" | "FIX";
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v1.4.0",
    date: "2026-04-23",
    title: "도메인 권위 지표 · 신규 SERP/콘텐츠 툴 대거 추가",
    highlights: [
      "온페이지 감사에 Moz DA · Ahrefs DR · Majestic TF 통합",
      "도메인 권위 체커, 2-도메인 비교기, SERP 체커, 지역 SERP, People Also Ask, 롱테일 키워드 발굴기 출시",
      "백링크 체커 결과에 소스 도메인 DA 컬럼 및 품질 점수 추가",
      "공유 캐시(RapidAPI · Serper · VebAPI) 기반으로 조회 속도 향상 및 호출량 절약",
    ],
    tag: "NEW",
  },
  {
    version: "v1.3.0",
    date: "2026-04-15",
    title: "백링크샵 공용 캐시 API 연동",
    highlights: [
      "Serper 검색 결과 캐시 경유 → 중복 호출 제거",
      "온페이지 감사에 도메인 권위 지표 카드 추가",
    ],
    tag: "IMPROVED",
  },
  {
    version: "v1.2.0",
    date: "2026-04-08",
    title: "툴 결과 인라인 문의 · GA4 전환 이벤트",
    highlights: [
      "툴 완료 시 인라인 문의 폼 지원",
      "GA4 전환 이벤트 보강 — contact / 문의 성공 화면",
    ],
    tag: "IMPROVED",
  },
];

export const CURRENT_VERSION = CHANGELOG[0]?.version ?? "v1.0.0";
export const CURRENT_UPDATE_DATE = CHANGELOG[0]?.date ?? "";

export function latestEntry(): ChangelogEntry | null {
  return CHANGELOG[0] ?? null;
}
