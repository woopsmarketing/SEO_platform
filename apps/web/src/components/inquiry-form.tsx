"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trackInquirySubmit } from "@/lib/gtag";

interface InquiryFormProps {
  serviceType: string;
  serviceLabel: string;
}

export function InquiryForm({ serviceType, serviceLabel }: InquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        company: data.get("company"),
        service_type: serviceType,
        message: data.get("message"),
      }),
    });

    if (res.ok) {
      trackInquirySubmit(serviceType);
      setStatus("success");
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMsg(json.error || "문의 접수에 실패했습니다.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-8 text-center">
          <p className="text-lg font-medium">문의가 접수되었습니다.</p>
          <p className="mt-2 text-muted-foreground">
            빠른 시일 내에 이메일로 답변 드리겠습니다.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => setStatus("idle")}>
            추가 문의하기
          </Button>
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
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">회사명 (선택)</label>
            <Input id="company" name="company" placeholder="회사명" />
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
