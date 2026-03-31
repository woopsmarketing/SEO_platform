import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogCta() {
  return (
    <div className="mt-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
      <p className="text-xl font-bold">내 사이트의 SEO 상태가 궁금하신가요?</p>
      <p className="mt-2 text-sm text-blue-100">
        무료 SEO 도구로 35개 항목을 자동 검사하고 개선 방안을 확인하세요.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <Link href="/tools">
          <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">무료 도구 사용하기</Button>
        </Link>
        <Link href="/services">
          <Button className="bg-blue-500 text-white border-2 border-white hover:bg-blue-400 font-semibold">서비스 문의</Button>
        </Link>
      </div>
    </div>
  );
}
