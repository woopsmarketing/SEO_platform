"use client";

import { getTelegramUrl } from "@/lib/telegram";
import { trackTelegramClick } from "@/lib/analytics";

interface TelegramCTAButtonProps {
  source: "tool_result" | "service_page" | "home" | "dashboard";
  tool?: string;
  label?: string;
  className?: string;
  variant?: "primary" | "outline";
}

export function TelegramCTAButton({
  source,
  tool,
  label = "텔레그램으로 무료 문의하기",
  className = "",
  variant = "primary",
}: TelegramCTAButtonProps) {
  const url = getTelegramUrl("general");

  const baseClass =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold px-8 py-3.5 text-base hover:bg-blue-700 transition-colors shadow-md"
      : "inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 font-semibold px-8 py-3.5 text-base hover:bg-gray-50 transition-colors";

  return (
    <a
      href={url}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={() => trackTelegramClick({ source, tool })}
      className={baseClass + (className ? " " + className : "")}
    >
      {label}
    </a>
  );
}
