"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
}

interface TocListProps {
  items: TocItem[];
}

/**
 * 사이드바 sticky TOC — 현재 보고 있는 섹션을 IntersectionObserver로 감지해
 * active 표시. 사용자가 스크롤 진척도와 위치를 즉시 인지 → 이탈 방지.
 */
export function TocList({ items }: TocListProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    // 화면에 보이는 헤딩들을 누적 추적
    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        // 가시 요소 중 문서 순서상 첫 번째를 active로 (=가장 위)
        if (visibleIds.size > 0) {
          const firstVisible = items.find((it) => visibleIds.has(it.id));
          if (firstVisible) setActiveId(firstVisible.id);
        }
      },
      {
        // 헤더 80px 밑에서 활성화 시작, 화면 중하단(70%)부터는 다음 섹션으로 양보
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <ol className="relative space-y-2.5 pl-4">
      {/* 좌측 인디케이터 트랙 */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-primary/15"
      />
      {items.map((item, i) => {
        const isActive = activeId === item.id;
        return (
          <li key={item.id} className="relative">
            {/* active 상태: 좌측 트랙 위에 진한 막대 + 글자 강조 */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute -left-4 top-0.5 bottom-0.5 w-[2px] rounded-full bg-primary"
              />
            )}
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              className={
                "block text-sm leading-relaxed transition-all " +
                (isActive
                  ? "text-primary font-semibold translate-x-0.5"
                  : "text-muted-foreground hover:text-primary")
              }
            >
              <span
                className={
                  "mr-2 font-semibold " +
                  (isActive ? "text-primary" : "text-muted-foreground/70")
                }
              >
                {i + 1}.
              </span>
              {item.title}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
