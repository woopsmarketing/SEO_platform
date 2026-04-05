"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackInquirySubmit } from "@/lib/gtag";
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

          <div className="mt-6 rounded-lg border bg-background px-4 py-4">
            <p className="mb-3 text-sm font-semibold">다음 단계</p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">1</span>
                이메일로 맞춤 제안서 수신
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">2</span>
                전화 또는 이메일 상담
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">3</span>
                서비스 시작
              </li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => { setStatus("idle"); setSuccessData(null); }}>
              추가 문의하기
            </Button>
            <Button asChild>
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
