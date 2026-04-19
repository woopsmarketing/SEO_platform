"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackInquirySubmit } from "@/lib/gtag";

interface QuickContactFormProps {
  toolName?: string;
  siteUrl?: string;
}

export function QuickContactForm({ toolName, siteUrl }: QuickContactFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const data = new FormData(e.currentTarget);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        service_type: toolName ? `tool-${toolName}` : "general",
        site_url: siteUrl || undefined,
      }),
    });

    if (res.ok) {
      trackInquirySubmit(toolName ? `tool-${toolName}` : "general");
      setStatus("success");
    } else {
      const json = await res.json().catch(() => ({}));
      setError(json.error || "접수에 실패했습니다. 다시 시도해주세요.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-semibold text-white">문의가 접수됐습니다!</p>
        <p className="text-sm text-blue-200 mt-1">24시간 이내 이메일로 연락드립니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <Input
          name="name"
          required
          placeholder="이름"
          className="bg-white/15 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/20"
        />
        <Input
          name="email"
          type="email"
          required
          placeholder="이메일"
          className="bg-white/15 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/20"
        />
      </div>
      <Textarea
        name="message"
        required
        rows={2}
        placeholder="문의 내용을 간단히 적어주세요"
        className="bg-white/15 border-white/30 text-white placeholder:text-blue-200 focus:bg-white/20 resize-none"
      />
      {error && <p className="text-xs text-red-300">{error}</p>}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold"
      >
        {status === "loading" ? "접수 중..." : "무료 상담 신청하기"}
      </Button>
    </form>
  );
}
