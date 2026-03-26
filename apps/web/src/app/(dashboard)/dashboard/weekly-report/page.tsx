"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReportDomain {
  url: string;
  addedAt: string;
}

export default function WeeklyReportPage() {
  const [domains, setDomains] = useState<ReportDomain[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [saved, setSaved] = useState(false);

  // 리포트 발송 상태
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sendProgress, setSendProgress] = useState("");

  useEffect(() => {
    const config = localStorage.getItem("seoworld_weekly_report");
    if (config) {
      const parsed = JSON.parse(config);
      setDomains(parsed.domains || []);
      setEnabled(parsed.enabled || false);
      setEmail(parsed.email || "");
    }
  }, []);

  function saveConfig(updates: { domains?: ReportDomain[]; enabled?: boolean; email?: string }) {
    const newConfig = {
      domains: updates.domains ?? domains,
      enabled: updates.enabled ?? enabled,
      email: updates.email ?? email,
    };
    setDomains(newConfig.domains);
    setEnabled(newConfig.enabled);
    setEmail(newConfig.email);
    localStorage.setItem("seoworld_weekly_report", JSON.stringify(newConfig));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function addDomain() {
    if (!newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    if (domains.some((d) => d.url === url)) return;
    saveConfig({ domains: [{ url, addedAt: new Date().toISOString() }, ...domains] });
    setNewUrl("");
  }

  function removeDomain(url: string) {
    saveConfig({ domains: domains.filter((d) => d.url !== url) });
  }

  async function handleSendReport() {
    if (!email || domains.length === 0) return;
    setSending(true);
    setSendStatus(null);
    setSendProgress("");

    try {
      const reports: { url: string; score: number | null; title: string | null; issues: string[] }[] = [];

      for (let i = 0; i < domains.length; i++) {
        const domain = domains[i];
        setSendProgress(`분석 중... (${i + 1}/${domains.length}) ${domain.url}`);

        try {
          const res = await fetch("/api/audit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: domain.url }),
          });

          if (!res.ok) {
            reports.push({ url: domain.url, score: null, title: null, issues: ["분석 실패"] });
            continue;
          }

          const data = await res.json();
          let score: number | null = null;
          const issues: string[] = [];

          if (data.analysis) {
            const scoreMatch = data.analysis.match(/SEO\s*점수[:\s]*([\d]+)/);
            if (scoreMatch) score = parseInt(scoreMatch[1], 10);

            const improvementMatch = data.analysis.match(/### 개선 필요\n([\s\S]*?)(?=###|$)/);
            if (improvementMatch) {
              const lines = improvementMatch[1].split("\n").filter((l: string) => l.startsWith("- **"));
              for (const line of lines.slice(0, 5)) {
                const titleMatch = line.match(/\*\*(.+?)\*\*/);
                if (titleMatch) issues.push(titleMatch[1]);
              }
            }
          }

          reports.push({
            url: domain.url,
            score,
            title: data.parsed?.title || null,
            issues,
          });
        } catch {
          reports.push({ url: domain.url, score: null, title: null, issues: ["네트워크 오류"] });
        }
      }

      setSendProgress("이메일 발송 중...");

      const sendRes = await fetch("/api/weekly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reports }),
      });

      if (!sendRes.ok) {
        const data = await sendRes.json();
        setSendStatus({ type: "error", message: data.error || "발송에 실패했습니다." });
      } else {
        setSendStatus({ type: "success", message: `${email}로 리포트가 발송되었습니다.` });
      }
    } catch {
      setSendStatus({ type: "error", message: "리포트 생성 중 오류가 발생했습니다." });
    }

    setSending(false);
    setSendProgress("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">주간 SEO 리포트</h1>
        <p className="mt-1 text-muted-foreground">
          등록한 도메인의 SEO 상태를 주 1회 이메일로 받아보세요.
        </p>
      </div>

      {/* 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">리포트 설정</CardTitle>
          <CardDescription>매주 월요일 오전에 SEO 분석 결과를 이메일로 발송합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => saveConfig({ enabled: !enabled })}
              className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ""}`} />
            </button>
            <span className="text-sm font-medium">{enabled ? "활성화됨" : "비활성화"}</span>
          </div>
          {enabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium">수신 이메일</label>
              <div className="flex gap-3">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="flex-1"
                />
                <Button onClick={() => saveConfig({ email })} disabled={!email}>저장</Button>
              </div>
            </div>
          )}
          {saved && <p className="text-sm text-green-600">설정이 저장되었습니다.</p>}
        </CardContent>
      </Card>

      {/* 모니터링 도메인 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">모니터링 도메인</CardTitle>
          <CardDescription>주간 리포트에 포함할 도메인을 등록하세요. (최대 5개)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {domains.length < 5 && (
            <div className="flex gap-3">
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="example.com"
                onKeyDown={(e) => e.key === "Enter" && addDomain()}
                className="flex-1"
              />
              <Button onClick={addDomain} disabled={!newUrl.trim()}>추가</Button>
            </div>
          )}
          {domains.length > 0 ? (
            <div className="space-y-2">
              {domains.map((d) => {
                let hostname = d.url;
                try { hostname = new URL(d.url).hostname; } catch {}
                return (
                  <div key={d.url} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <span className="text-sm">{hostname}</span>
                    <Button size="sm" variant="ghost" className="text-red-500 h-7" onClick={() => removeDomain(d.url)}>삭제</Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">등록된 도메인이 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 수동 발송 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">지금 리포트 받기</CardTitle>
          <CardDescription>등록된 도메인을 즉시 분석하여 이메일로 리포트를 발송합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleSendReport}
            disabled={sending || !email || domains.length === 0}
            className="w-full"
          >
            {sending ? "리포트 생성 중..." : "지금 리포트 받기"}
          </Button>
          {!email && domains.length > 0 && (
            <p className="text-sm text-muted-foreground">리포트를 받으려면 이메일을 설정하세요.</p>
          )}
          {email && domains.length === 0 && (
            <p className="text-sm text-muted-foreground">리포트를 받으려면 도메인을 등록하세요.</p>
          )}
          {sendProgress && (
            <p className="text-sm text-muted-foreground">{sendProgress}</p>
          )}
          {sendStatus && (
            <p className={`text-sm ${sendStatus.type === "success" ? "text-green-600" : "text-destructive"}`}>
              {sendStatus.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 안내 */}
      <Card className="bg-blue-50/50 border-blue-100">
        <CardContent className="pt-5 pb-5">
          <p className="text-xs text-blue-800/80 leading-relaxed">
            주간 SEO 리포트는 등록한 도메인을 자동으로 분석하여 SEO 점수, 주요 변경사항, 개선 권장사항을 이메일로 발송합니다.
            &ldquo;지금 리포트 받기&rdquo; 버튼으로 즉시 리포트를 받아볼 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
