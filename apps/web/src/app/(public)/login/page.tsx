import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "로그인",
  description: "SEO월드에 로그인하여 분석 결과를 저장하고 관리하세요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const message = typeof searchParams.message === "string" ? searchParams.message : undefined;
  const redirectTo = typeof searchParams.redirect === "string" ? searchParams.redirect : "/dashboard";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>
            계정에 로그인하여 분석 결과를 저장하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-md bg-primary/10 p-3 text-sm text-primary">
              {message}
            </div>
          )}
          <form action={signIn} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
