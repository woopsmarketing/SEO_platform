"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FavoriteDomain {
  url: string;
  addedAt: string;
}

export default function FavoritesPage() {
  const [domains, setDomains] = useState<FavoriteDomain[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("seoworld_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [newUrl, setNewUrl] = useState("");

  function saveDomains(updated: FavoriteDomain[]) {
    setDomains(updated);
    localStorage.setItem("seoworld_favorites", JSON.stringify(updated));
  }

  function addDomain() {
    if (!newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    if (domains.some((d) => d.url === url)) return;
    saveDomains([{ url, addedAt: new Date().toISOString() }, ...domains]);
    setNewUrl("");
  }

  function removeDomain(url: string) {
    saveDomains(domains.filter((d) => d.url !== url));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">즐겨찾기 도메인</h1>
        <p className="mt-1 text-muted-foreground">자주 분석하는 도메인을 등록하고 원클릭으로 재분석하세요.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>

      {domains.length > 0 ? (
        <div className="space-y-3">
          {domains.map((d) => {
            let hostname = d.url;
            try { hostname = new URL(d.url).hostname; } catch {}
            return (
              <Card key={d.url}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{hostname}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(d.addedAt).toLocaleDateString("ko-KR")} 등록
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`/tools/onpage-audit?url=${encodeURIComponent(d.url)}`}>
                      <Button size="sm" variant="outline">SEO 분석</Button>
                    </a>
                    <a href={`/tools/meta-generator?url=${encodeURIComponent(d.url)}`}>
                      <Button size="sm" variant="outline">메타태그</Button>
                    </a>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => removeDomain(d.url)}>
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">등록된 도메인이 없습니다</p>
            <p className="mt-1 text-sm">자주 분석하는 도메인을 추가하면 원클릭으로 재분석할 수 있습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
