import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">페이지를 찾을 수 없습니다</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}
