export interface KeywordTrend {
  checkedAt: string;
  rank: number | null;
}

export interface TrackedKeyword {
  id: string;
  domain: string;
  keyword: string;
  gl: string;
  hl: string;
  createdAt: string;
  latestRank: number | null;
  latestCheckedAt: string | null;
  delta: number | null; // 30일 기준 순위 변화 (양수=상승)
  history: KeywordTrend[];
}
