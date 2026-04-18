"use client";

import { useEffect } from "react";
import { getTelegramUrl } from "@/lib/telegram";
import { trackTelegramClick } from "@/lib/analytics";

export default function ContactPage() {
  useEffect(() => {
    trackTelegramClick({ source: "home" });
    window.location.href = getTelegramUrl("general");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground text-sm">텔레그램으로 연결 중...</p>
    </div>
  );
}
