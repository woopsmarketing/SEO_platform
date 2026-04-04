"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  toolName?: string;
}

export function SignupModal({ open, onClose, toolName }: SignupModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="닫기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* 아이콘 */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>

        {/* 타이틀 */}
        <h2 className="text-center text-xl font-bold text-gray-900">
          무료 사용량을 모두 사용했어요
        </h2>

        {/* 설명 */}
        <p className="mt-2 text-center text-sm text-gray-600">
          {toolName ? `${toolName}의 ` : ""}일일 무료 사용 횟수를 초과했습니다.
          <br />
          <span className="font-medium text-gray-900">무료 회원가입</span>만 하면 모든 도구를 <span className="font-medium text-primary">무제한</span>으로 사용할 수 있어요.
        </p>

        {/* 혜택 목록 */}
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            모든 SEO 분석 도구 무제한 사용
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            분석 결과 저장 및 이력 관리
          </li>
          <li className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-500 shrink-0">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Google 계정으로 3초 만에 가입
          </li>
        </ul>

        {/* CTA 버튼 */}
        <div className="mt-6 space-y-2">
          <Link href="/signup" className="block">
            <Button className="w-full text-base py-5">
              무료 회원가입하기
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              이미 계정이 있어요
            </Button>
          </Link>
        </div>

        {/* 하단 안내 */}
        <p className="mt-4 text-center text-xs text-gray-400">
          가입은 무료이며, 결제 정보가 필요하지 않습니다.
        </p>
      </div>
    </div>
  );
}
