"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 헤딩에 id 추가 (목차 앵커용)
        h2: ({ children }) => {
          const id = String(children).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-]/g, "").toLowerCase();
          return <h2 id={id} className="mt-10 mb-4 text-2xl font-bold scroll-mt-20">{children}</h2>;
        },
        h3: ({ children }) => {
          const id = String(children).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-]/g, "").toLowerCase();
          return <h3 id={id} className="mt-6 mb-3 text-xl font-semibold scroll-mt-20">{children}</h3>;
        },
        // 본문
        p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-700">{children}</p>,
        // 링크 — 내부/외부 구분
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return <Link href={href} className="text-blue-600 font-medium hover:underline">{children}</Link>;
          }
          return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>;
        },
        // 리스트
        ul: ({ children }) => <ul className="mb-4 ml-4 space-y-1 list-disc list-inside text-gray-700">{children}</ul>,
        ol: ({ children }) => <ol className="mb-4 ml-4 space-y-1 list-decimal list-inside text-gray-700">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        // 강조
        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        // 인용 (CTA 박스로 활용)
        blockquote: ({ children }) => (
          <div className="my-6 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
            <div className="text-sm font-medium text-blue-900">{children}</div>
          </div>
        ),
        // 구분선
        hr: () => <hr className="my-8 border-gray-200" />,
        // 코드
        code: ({ children }) => (
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-gray-800">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">{children}</pre>
        ),
        // 테이블
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b-2 border-gray-200 bg-gray-50">{children}</thead>,
        th: ({ children }) => <th className="px-4 py-2 text-left font-semibold text-gray-700">{children}</th>,
        td: ({ children }) => <td className="border-b border-gray-100 px-4 py-2 text-gray-600">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// 목차 자동 생성
export function TableOfContents({ content }: { content: string }) {
  const headings = content
    .split("\n")
    .filter((line) => /^#{2,3}\s/.test(line))
    .map((line) => {
      const level = line.startsWith("### ") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s+/, "").trim();
      const id = text.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-]/g, "").toLowerCase();
      return { level, text, id };
    });

  if (headings.length < 3) return null;

  return (
    <nav className="mb-10 rounded-xl border bg-gray-50 p-5">
      <p className="mb-3 text-sm font-bold text-gray-900">목차</p>
      <ul className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={i} className={h.level === 3 ? "ml-4" : ""}>
            <a
              href={`#${h.id}`}
              className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
