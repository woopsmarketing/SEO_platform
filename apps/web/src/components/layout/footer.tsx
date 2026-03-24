import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold">도메인</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/domains" className="hover:text-foreground">도메인 검색</Link></li>
              <li><Link href="/domains/auction" className="hover:text-foreground">경매 도메인</Link></li>
              <li><Link href="/domains/history" className="hover:text-foreground">도메인 히스토리</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">무료 툴</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/domain-checker" className="hover:text-foreground">Domain Checker</Link></li>
              <li><Link href="/tools/onpage-audit" className="hover:text-foreground">On-page Audit</Link></li>
              <li><Link href="/tools/meta-generator" className="hover:text-foreground">Meta Generator</Link></li>
              <li><Link href="/tools/robots-generator" className="hover:text-foreground">Robots Generator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">서비스</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services/backlinks" className="hover:text-foreground">백링크</Link></li>
              <li><Link href="/services/traffic" className="hover:text-foreground">트래픽</Link></li>
              <li><Link href="/services/web-design" className="hover:text-foreground">웹 디자인</Link></li>
              <li><Link href="/services/domain-broker" className="hover:text-foreground">도메인 브로커</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">SEO월드</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground">블로그</Link></li>
              <li><Link href="/guides" className="hover:text-foreground">가이드</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SEO월드. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
