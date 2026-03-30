"use client";

import Link from "next/link";
import { useState } from "react";

interface ToolItem {
  title: string;
  href: string;
  description: string;
  ready?: boolean;
}

interface ToolCategory {
  name: string;
  icon: string;
  tools: ToolItem[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "온페이지 분석",
    icon: "📊",
    tools: [
      { title: "온페이지 SEO 분석", href: "/tools/onpage-audit", description: "35개 항목 자동 검사 + AI 점수" },
      { title: "메타태그 분석기", href: "/tools/meta-generator", description: "메타태그 파싱 + AI 최적화 추천" },
    ],
  },
  {
    name: "색인 도구",
    icon: "🗂️",
    tools: [
      { title: "Robots.txt 생성기", href: "/tools/robots-generator", description: "크롤러 허용/차단 규칙 설정" },
      { title: "사이트맵 생성기", href: "/tools/sitemap-generator", description: "sitemap.xml 자동 크롤링 생성" },
    ],
  },
  {
    name: "백링크 분석",
    icon: "🔗",
    tools: [
      { title: "백링크 분석기", href: "/tools/backlink-checker", description: "백링크 목록, 참조 도메인, doFollow 비율" },
    ],
  },
  {
    name: "도메인 도구",
    icon: "🌐",
    tools: [
      { title: "도메인 분석기", href: "/tools/domain-checker", description: "WHOIS, 도메인 점수 확인", ready: false },
    ],
  },
  {
    name: "키워드 분석",
    icon: "🔍",
    tools: [
      { title: "키워드 조사", href: "/tools/keyword-research", description: "검색량, CPC, 경쟁도 조회", ready: false },
      { title: "관련 키워드", href: "/tools/keyword-related", description: "키워드 추천 및 확장", ready: false },
    ],
  },
];

export function ToolsMegaMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/tools"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        무료 툴
      </Link>

      {open && (
        <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
          <div className="w-[640px] rounded-xl border bg-background p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">무료 SEO 분석 도구</p>
              <Link href="/tools" className="text-xs text-primary hover:underline">전체 보기</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {TOOL_CATEGORIES.map((cat) => (
                <div key={cat.name}>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <span>{cat.icon}</span>
                    {cat.name}
                  </p>
                  <div className="space-y-1">
                    {cat.tools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.ready === false ? "#" : tool.href}
                        className={`block rounded-lg px-3 py-2 transition-colors ${
                          tool.ready === false
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-muted"
                        }`}
                        onClick={(e) => {
                          if (tool.ready === false) e.preventDefault();
                          else setOpen(false);
                        }}
                      >
                        <p className="text-sm font-medium">
                          {tool.title}
                          {tool.ready === false && (
                            <span className="ml-1.5 text-[10px] text-muted-foreground">(준비중)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
