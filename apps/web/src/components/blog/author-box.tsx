export function AuthorBox() {
  return (
    <div className="mt-12 rounded-xl border bg-gray-50 p-6 flex items-start gap-4">
      <div className="shrink-0">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-blue-600">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="4.5" ry="10" stroke="currentColor" strokeWidth="1.2" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
      <div>
        <p className="font-bold text-gray-900">SEO월드</p>
        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
          검색엔진최적화(SEO) 전문 플랫폼. 무료 SEO 분석 도구와 전문 SEO 서비스를 제공합니다.
        </p>
        <div className="mt-2 flex gap-3">
          <a href="/tools" className="text-xs text-blue-600 hover:underline">무료 도구</a>
          <a href="/services" className="text-xs text-blue-600 hover:underline">서비스</a>
          <a href="/blog" className="text-xs text-blue-600 hover:underline">블로그</a>
        </div>
      </div>
    </div>
  );
}
