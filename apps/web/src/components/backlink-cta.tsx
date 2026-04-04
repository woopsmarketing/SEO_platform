import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BacklinkCtaProps {
  /** 배너 타입에 따라 메시지를 다르게 표시 */
  variant?: "audit" | "backlink" | "general";
}

export function BacklinkCta({ variant = "general" }: BacklinkCtaProps) {
  const messages = {
    audit: {
      title: "백링크가 부족하신가요?",
      desc: "온페이지 SEO만으로는 한계가 있습니다. 고품질 백링크는 구글 순위를 올리는 가장 강력한 외부 요소입니다.",
    },
    backlink: {
      title: "더 많은 고품질 백링크가 필요하신가요?",
      desc: "직접 백링크를 구축하는 건 시간이 오래 걸립니다. 전문가가 DA 높은 사이트에서 doFollow 백링크를 확보해드립니다.",
    },
    general: {
      title: "SEO 순위를 더 올리고 싶으신가요?",
      desc: "고품질 백링크는 구글 검색 순위를 높이는 핵심 요소입니다. SEO월드의 백링크 서비스로 도메인 권한을 높이세요.",
    },
  };

  const { title, desc } = messages[variant];

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 max-w-lg">{desc}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <li className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
              DA 높은 사이트 백링크
            </li>
            <li className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
              doFollow 링크
            </li>
            <li className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500"><polyline points="20 6 9 17 4 12" /></svg>
              월간 리포트 제공
            </li>
          </ul>
        </div>
        <Link href="/services/backlinks" className="shrink-0">
          <Button className="w-full sm:w-auto">
            백링크 서비스 알아보기
          </Button>
        </Link>
      </div>
    </div>
  );
}
