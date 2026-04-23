"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { CURRENT_VERSION, CURRENT_UPDATE_DATE, latestEntry } from "@/lib/changelog";

const DISMISS_KEY = "changelog-dismiss-v";

export function ChangelogBanner({ variant = "default" }: { variant?: "default" | "compact" }) {
  const entry = latestEntry();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!entry) return;
    const dismissed = typeof window !== "undefined"
      ? window.localStorage.getItem(DISMISS_KEY + entry.version)
      : null;
    if (!dismissed) setVisible(true);
  }, [entry]);

  if (!entry || !visible) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY + entry.version, "1");
    setVisible(false);
  };

  const topHighlight = entry.highlights[0] ?? entry.title;

  if (variant === "compact") {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/40 px-3 py-2 text-xs flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="h-3 w-3" />
          {CURRENT_VERSION} · {CURRENT_UPDATE_DATE}
        </span>
        <span className="text-muted-foreground truncate">{topHighlight}</span>
        <Link href="/updates" className="ml-auto underline underline-offset-2 text-blue-700 dark:text-blue-300">
          전체 업데이트 →
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="닫기"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900/40 p-4 flex items-start gap-3">
      <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="inline-flex items-center rounded-full bg-blue-600 text-white px-2 py-0.5 font-semibold">
            {entry.tag ?? "NEW"}
          </span>
          <span className="font-semibold text-blue-700 dark:text-blue-300">{entry.version}</span>
          <span className="text-muted-foreground">· {entry.date}</span>
        </div>
        <p className="mt-1 font-semibold text-sm">{entry.title}</p>
        <ul className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
          {entry.highlights.slice(0, 2).map((h, i) => (
            <li key={i}>· {h}</li>
          ))}
        </ul>
        <Link href="/updates" className="mt-2 inline-block text-xs font-medium text-blue-700 dark:text-blue-300 underline underline-offset-2">
          전체 업데이트 내역 →
        </Link>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="닫기"
        className="text-muted-foreground hover:text-foreground flex-shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
