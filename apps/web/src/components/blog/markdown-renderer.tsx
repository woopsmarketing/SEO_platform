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

// 사이드바 sticky 목차
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
    <nav className="rounded-lg border bg-gray-50/80 p-4">
      <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">목차</p>
      <ul className="space-y-1 list-none">
        {headings.map((h, i) => (
          <li key={i} className={h.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${h.id}`}
              className={`block py-1 text-xs leading-snug transition-colors hover:text-blue-600 ${
                h.level === 2
                  ? "font-medium text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
