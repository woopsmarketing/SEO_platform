import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getToolBySlug } from "@/lib/data";

export interface ToolEmbedProps {
  /** 툴 슬러그. 예: "onpage-audit", "serp-checker", "domain-authority" */
  tool: string;
  /** 선택적 타이틀 오버라이드 */
  title?: string;
  /** 선택적 설명 오버라이드 */
  description?: string;
}

/**
 * 블로그 본문 중간에 삽입하는 툴 미니 CTA 카드.
 *
 * @example
 *   <ToolEmbed tool="onpage-audit" />
 *   <ToolEmbed
 *     tool="serp-checker"
 *     title="지금 바로 내 순위 확인"
 *     description="키워드를 넣으면 구글 순위가 즉시 나옵니다."
 *   />
 */
export function ToolEmbed({ tool, title, description }: ToolEmbedProps) {
  const meta = getToolBySlug(tool);

  // 툴을 못 찾아도 최소한의 fallback 으로 /tools 로 안내
  const icon = meta?.icon ?? "🛠️";
  const resolvedTitle = title ?? meta?.title ?? "SEO 도구 사용하기";
  const resolvedDesc = description ?? meta?.description ?? "무료 SEO 분석 도구를 바로 사용해보세요.";
  const href = meta?.href ?? `/tools/${tool.replace(/^\/?tools\//, "")}`;

  return (
    <aside className="not-prose my-8 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white text-3xl shadow-sm">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-900">{resolvedTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{resolvedDesc}</p>
        </div>
        <Link href={href} className="shrink-0">
          <Button size="sm" className="w-full sm:w-auto">
            이 도구 사용하기
          </Button>
        </Link>
      </div>
    </aside>
  );
}
