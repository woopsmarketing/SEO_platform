"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DownloadItem {
  id: string;
  type: string;
  filename: string;
  content: string;
  url?: string;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  "robots.txt": "Robots.txt",
  "sitemap.xml": "사이트맵",
  "meta-tags": "메타태그 코드",
};

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("seoworld_downloads");
    if (saved) setDownloads(JSON.parse(saved));
  }, []);

  function downloadFile(item: DownloadItem) {
    const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function removeItem(id: string) {
    const updated = downloads.filter((d) => d.id !== id);
    setDownloads(updated);
    localStorage.setItem("seoworld_downloads", JSON.stringify(updated));
  }

  function clearAll() {
    setDownloads([]);
    localStorage.removeItem("seoworld_downloads");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">다운로드 센터</h1>
          <p className="mt-1 text-muted-foreground">생성한 robots.txt, sitemap.xml, 메타태그 코드를 다시 다운로드하세요.</p>
        </div>
        {downloads.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAll}>전체 삭제</Button>
        )}
      </div>

      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {TYPE_LABELS[item.type] || item.type}
                    {item.url && <> &middot; {item.url}</>}
                    {" "}&middot;{" "}
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" onClick={() => downloadFile(item)}>다운로드</Button>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => removeItem(item.id)}>삭제</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium">다운로드 이력이 없습니다</p>
            <p className="mt-1 text-sm">
              Robots.txt 생성기, 사이트맵 생성기, 메타태그 분석기에서 파일을 생성하면 여기에 저장됩니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
