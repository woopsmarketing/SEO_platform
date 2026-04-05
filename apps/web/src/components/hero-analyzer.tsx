"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroAnalyzer() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    let target = url.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    router.push(`/tools/onpage-audit?url=${encodeURIComponent(target)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
      <div className="flex gap-2 rounded-xl bg-white shadow-lg border border-gray-200 p-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="분석할 사이트 URL을 입력하세요"
            className="border-0 pl-10 text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 text-base shrink-0"
        >
          무료 분석하기
        </Button>
      </div>
      <p className="mt-3 text-sm text-gray-400">
        예: seoworld.co.kr &middot; 회원가입 없이 바로 분석 &middot; 100% 무료
      </p>
    </form>
  );
}
