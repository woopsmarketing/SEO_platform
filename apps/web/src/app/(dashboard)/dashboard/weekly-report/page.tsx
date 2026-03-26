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

      {/* 안내 */}
      <Card className="bg-blue-50/50 border-blue-100">
        <CardContent className="pt-5 pb-5">
          <p className="text-xs text-blue-800/80 leading-relaxed">
            주간 SEO 리포트는 등록한 도메인을 자동으로 분석하여 SEO 점수, 주요 변경사항, 개선 권장사항을 이메일로 발송합니다.
            현재는 설정 저장 기능이 제공되며, 자동 발송 기능은 곧 추가될 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
