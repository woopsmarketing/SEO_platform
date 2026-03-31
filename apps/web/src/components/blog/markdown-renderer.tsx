"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => {
          const id = String(children).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-]/g, "").toLowerCase();
          return <h2 id={id} className="scroll-mt-20">{children}</h2>;
        },
        h3: ({ children }) => {
          const id = String(children).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-]/g, "").toLowerCase();
          return <h3 id={id} className="scroll-mt-20">{children}</h3>;
        },
        a: ({ href, children }) => {
          if (href?.startsWith("/")) {
            return <Link href={href}>{children}</Link>;
          }
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
        },
        table: ({ children }) => (
          <div className="overflow-x-auto"><table>{children}</table></div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// 목차 자동 생성 — 번호 매기기, H2 볼드, H3 들여쓰기
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

  let h2Counter = 0;
  let h3Counter = 0;

  return (
    <nav className="mb-10 rounded-xl border bg-gray-50/80 p-6">
      <p className="mb-4 text-sm font-bold text-gray-900">목차</p>
      <ol className="space-y-1.5 list-none">
        {headings.map((h, i) => {
          let label: string;
          if (h.level === 2) {
            h2Counter++;
            h3Counter = 0;
            label = `${h2Counter}.`;
          } else {
            h3Counter++;
            label = `${h2Counter}.${h3Counter}`;
          }

          return (
            <li key={i} className={h.level === 3 ? "ml-5" : ""}>
              <a
                href={`#${h.id}`}
                className={`text-sm hover:text-blue-600 transition-colors ${
                  h.level === 2
                    ? "font-semibold text-gray-800"
                    : "text-gray-500"
                }`}
              >
                <span className="inline-block w-8 text-gray-400">{label}</span>
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
