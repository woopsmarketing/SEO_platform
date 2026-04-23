/**
 * 백링크샵 공용 캐시 API 클라이언트
 *
 * 3개 프로젝트(백링크샵/도메인체커/SEO월드)가 외부 API(RapidAPI/Serper/VebAPI)
 * 결과를 공유하기 위한 캐시. SEO월드는 consumer 역할.
 *
 * 사용 패턴:
 *   1. fetchWithCache(type, params)로 캐시 조회
 *   2. null이면 기존 외부 API를 직접 호출
 *   3. saveToCache(type, body)로 결과를 공유
 */

export type CacheType = "metrics" | "serp" | "backlink";

type CacheQueryParams = { domain: string } | { keyword: string };

/**
 * `/api/cache/metrics` 응답 data 필드 스키마 — RapidAPI Domain Metrics 원본을 그대로 반영.
 * Moz/Ahrefs/Majestic 각 소스에서 받아오는 도메인 권위/백링크/트래픽 지표.
 */
export interface DomainMetrics {
  mozDA?: number | string;
  mozPA?: number | string;
  mozRank?: number | string;
  mozSpam?: number | string;
  mozLinks?: number;
  ahrefsDR?: number;
  ahrefsRank?: number;
  ahrefsBacklinks?: number;
  ahrefsRefDomains?: number;
  ahrefsTraffic?: number;
  ahrefsTrafficValue?: number;
  ahrefsOrganicKeywords?: number;
  majesticTF?: number;
  majesticCF?: number;
  majesticLinks?: number;
  majesticRefDomains?: number;
  majesticRefGov?: number;
}

interface CacheGetResponse<T> {
  source: "cache" | "api";
  domain?: string;
  keyword?: string;
  data: T;
  fetched_at: string;
}

const READ_TIMEOUT_MS = 5000;
const WRITE_TIMEOUT_MS = 5000;

function getConfig() {
  const url = process.env.CACHE_API_URL;
  const key = process.env.CACHE_API_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

function buildQuery(params: CacheQueryParams): string {
  if ("domain" in params) return `domain=${encodeURIComponent(params.domain)}`;
  return `keyword=${encodeURIComponent(params.keyword)}`;
}

/**
 * 공용 캐시 조회. HIT이면 data를, MISS/미설정/오류이면 null을 반환.
 * null일 때만 호출 측에서 외부 API를 직접 호출하면 된다.
 */
export async function fetchWithCache<T>(
  type: CacheType,
  params: CacheQueryParams,
): Promise<T | null> {
  const config = getConfig();
  if (!config) return null;

  try {
    const res = await fetch(
      `${config.url}/api/cache/${type}?${buildQuery(params)}`,
      {
        method: "GET",
        headers: { "x-api-key": config.key },
        signal: AbortSignal.timeout(READ_TIMEOUT_MS),
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const json = (await res.json()) as CacheGetResponse<T>;
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * 직접 호출한 외부 API 결과를 공용 캐시에 저장. 실패해도 호출 측 흐름은 유지.
 */
export async function saveToCache(
  type: CacheType,
  body: Record<string, unknown>,
): Promise<void> {
  const config = getConfig();
  if (!config) return;

  try {
    await fetch(`${config.url}/api/cache/${type}`, {
      method: "POST",
      headers: {
        "x-api-key": config.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(WRITE_TIMEOUT_MS),
    });
  } catch {
    // 캐시 저장 실패는 무시 — 사용자 요청에는 영향 없음
  }
}
