"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackInquirySubmit } from "@/lib/gtag";
import { trackTelegramClick } from "@/lib/analytics";
import Link from "next/link";

interface InquiryFormProps {
  serviceType: string;
  serviceLabel: string;
}

interface SuccessData {
  email: string;
  inquiryId: string;
}

const BUDGET_OPTIONS = [
  { value: "", label: "선택해주세요" },
  { value: "30만원 이하", label: "30만원 이하" },
  { value: "30~60만원", label: "30~60만원" },
  { value: "60~120만원", label: "60~120만원" },
  { value: "120만원 이상", label: "120만원 이상" },
  { value: "상담 후 결정", label: "상담 후 결정" },
];

function formatInquiryId(id: string): string {
  const numericPart = id.replace(/-/g, "").slice(0, 5).toUpperCase();
  return `INQ-${numericPart}`;
}

export function InquiryForm({ serviceType, serviceLabel }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email,
        company: data.get("company"),
        service_type: serviceType,
        message: data.get("message"),
        site_url: data.get("site_url") || undefined,
        budget: data.get("budget") || undefined,
        telegram: data.get("telegram") || undefined,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      trackInquirySubmit(serviceType);
      setSuccessData({
        email,
        inquiryId: json.id ? formatInquiryId(String(json.id)) : "INQ-00000",
      });
      setStatus("success");
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error || "문의 접수에 실패했습니다.");
      setStatus("error");
    }
  }

  if (status === "success" && successData) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">문의가 접수되었습니다!</h3>
            <p className="mt-2 text-muted-foreground">
              담당자가 <strong>24시간 이내</strong>에 맞춤 제안서를 이메일로 보내드립니다.
            </p>
          </div>

          <div className="mt-6 space-y-2 rounded-lg bg-background/60 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">확인 이메일:</span>
              <span className="font-medium">{successData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">문의 번호:</span>
              <span className="font-medium">{successData.inquiryId}</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 text-center">
            <p className="text-sm font-semibold text-blue-900">더 빠른 상담을 원하시면</p>
            <p className="mt-1 text-xs text-blue-700">텔레그램으로 바로 문의하시면 실시간으로 답변드립니다.</p>
            <a
              href="https://t.me/goat82"
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={() => trackTelegramClick({ source: "service_page", tool: serviceType })}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#2AABEE] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#229ED9] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              텔레그램으로 문의하기
            </a>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => { setStatus("idle"); setSuccessData(null); }}>
              추가 문의하기
            </Button>
            <Button asChild variant="outline">
              <Link href="/tools">무료 도구 사용하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{serviceLabel} 문의</CardTitle>
        <CardDescription>아래 양식을 작성해주시면 빠르게 연락드리겠습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "error" && (
          <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">이름 *</label>
              <Input id="name" name="name" required placeholder="홍길동" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">이메일 *</label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">회사명 (선택)</label>
              <Input id="company" name="company" placeholder="회사명" />
            </div>
            <div className="space-y-2">
              <label htmlFor="site_url" className="text-sm font-medium">사이트 URL (선택)</label>
              <Input id="site_url" name="site_url" type="url" placeholder="https://example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="budget" className="text-sm font-medium">예산 범위 (선택)</label>
            <select
              id="budget"
              name="budget"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="telegram" className="text-sm font-medium">텔레그램 ID (선택)</label>
              <Input id="telegram" name="telegram" placeholder="@username" />
            </div>
            <div />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">문의 내용 *</label>
            <Textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="문의 내용을 자유롭게 작성해주세요."
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "접수 중..." : "문의하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
