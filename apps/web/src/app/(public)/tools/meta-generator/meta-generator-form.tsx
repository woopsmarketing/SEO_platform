"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetaFields {
  title: string;
  description: string;
  keywords: string;
  url: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  author: string;
  robots: string;
}

const defaultFields: MetaFields = {
  title: "",
  description: "",
  keywords: "",
  url: "",
  ogImage: "",
  ogType: "website",
  twitterCard: "summary_large_image",
  author: "",
  robots: "index, follow",
};

export function MetaGeneratorForm() {
  const [fields, setFields] = useState<MetaFields>(defaultFields);
  const [copied, setCopied] = useState(false);

  const update = (key: keyof MetaFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const titleLength = fields.title.length;
  const descLength = fields.description.length;

  const generatedCode = generateMetaTags(fields);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // 툴 사용 로그
    fetch("/api/tool-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool_type: "meta-generator", input_summary: fields.title }),
    }).catch(() => {});
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 입력 폼 */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                페이지 제목 <span className={titleLength > 60 ? "text-destructive" : "text-muted-foreground"}>({titleLength}/60)</span>
              </label>
              <Input
                placeholder="SEO월드 - 무료 SEO 분석 도구"
                value={fields.title}
                onChange={(e) => update("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                메타 설명 <span className={descLength > 160 ? "text-destructive" : "text-muted-foreground"}>({descLength}/160)</span>
              </label>
              <Textarea
                className="min-h-[80px]"
                placeholder="무료 SEO 분석 도구로 웹사이트를 점검하세요."
                value={fields.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">키워드 (쉼표로 구분)</label>
              <Input
                placeholder="SEO, 메타태그, 검색엔진최적화"
                value={fields.keywords}
                onChange={(e) => update("keywords", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">페이지 URL</label>
              <Input
                placeholder="https://seoworld.co.kr"
                value={fields.url}
                onChange={(e) => update("url", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">작성자</label>
              <Input
                placeholder="SEO월드"
                value={fields.author}
                onChange={(e) => update("author", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Graph / Twitter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">OG 이미지 URL</label>
              <Input
                placeholder="https://seoworld.co.kr/og-image.jpg"
                value={fields.ogImage}
                onChange={(e) => update("ogImage", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">OG 타입</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={fields.ogType}
                onChange={(e) => update("ogType", e.target.value)}
              >
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Twitter Card</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={fields.twitterCard}
                onChange={(e) => update("twitterCard", e.target.value)}
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Robots</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={fields.robots}
                onChange={(e) => update("robots", e.target.value)}
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 미리보기 + 코드 출력 */}
      <div className="space-y-6">
        {/* Google 검색 결과 미리보기 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Google 검색 미리보기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border bg-white p-4">
              <p className="text-sm text-green-700 truncate">
                {fields.url || "https://example.com"}
              </p>
              <p className="text-xl text-blue-800 hover:underline truncate">
                {fields.title || "페이지 제목을 입력하세요"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {fields.description || "메타 설명을 입력하세요. 검색 결과에 표시되는 설명문입니다."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 생성된 코드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">생성된 메타 태그</CardTitle>
            <CardDescription>아래 코드를 HTML &lt;head&gt; 안에 붙여넣으세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="max-h-[400px] overflow-auto rounded-md bg-muted p-4 text-sm">
                <code>{generatedCode}</code>
              </pre>
              <Button
                size="sm"
                className="absolute right-2 top-2"
                onClick={handleCopy}
                disabled={!fields.title}
              >
                {copied ? "복사됨!" : "복사"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function generateMetaTags(f: MetaFields): string {
  const lines: string[] = [];

  lines.push(`<!-- 기본 메타 태그 -->`);
  lines.push(`<meta charset="UTF-8">`);
  lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);

  if (f.title) lines.push(`<title>${esc(f.title)}</title>`);
  if (f.description) lines.push(`<meta name="description" content="${esc(f.description)}">`);
  if (f.keywords) lines.push(`<meta name="keywords" content="${esc(f.keywords)}">`);
  if (f.author) lines.push(`<meta name="author" content="${esc(f.author)}">`);
  if (f.robots) lines.push(`<meta name="robots" content="${esc(f.robots)}">`);
  if (f.url) lines.push(`<link rel="canonical" href="${esc(f.url)}">`);

  lines.push(``);
  lines.push(`<!-- Open Graph -->`);
  if (f.title) lines.push(`<meta property="og:title" content="${esc(f.title)}">`);
  if (f.description) lines.push(`<meta property="og:description" content="${esc(f.description)}">`);
  if (f.url) lines.push(`<meta property="og:url" content="${esc(f.url)}">`);
  lines.push(`<meta property="og:type" content="${esc(f.ogType)}">`);
  lines.push(`<meta property="og:locale" content="ko_KR">`);
  if (f.ogImage) lines.push(`<meta property="og:image" content="${esc(f.ogImage)}">`);

  lines.push(``);
  lines.push(`<!-- Twitter Card -->`);
  lines.push(`<meta name="twitter:card" content="${esc(f.twitterCard)}">`);
  if (f.title) lines.push(`<meta name="twitter:title" content="${esc(f.title)}">`);
  if (f.description) lines.push(`<meta name="twitter:description" content="${esc(f.description)}">`);
  if (f.ogImage) lines.push(`<meta name="twitter:image" content="${esc(f.ogImage)}">`);

  return lines.join("\n");
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
