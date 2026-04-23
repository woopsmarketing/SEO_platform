import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CHANGELOG } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "업데이트 내역 | SEO월드",
  description: "SEO월드 플랫폼 기능 업데이트 및 변경 이력",
};

export default function UpdatesPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">업데이트 내역</h1>
        <p className="mt-2 text-muted-foreground">
          SEO월드의 신규 기능과 개선 사항을 확인하세요.
        </p>
      </header>

      <ol className="space-y-6">
        {CHANGELOG.map((entry) => (
          <li key={entry.version}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  {entry.tag ? (
                    <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5 font-semibold">
                      {entry.tag}
                    </span>
                  ) : null}
                  <span className="font-semibold text-blue-700 dark:text-blue-300">{entry.version}</span>
                  <span className="text-muted-foreground">· {entry.date}</span>
                </div>
                <CardTitle className="mt-2 text-xl">{entry.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {entry.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
