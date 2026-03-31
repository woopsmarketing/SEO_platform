import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SEO 컨설팅 및 서비스 — 백링크 · 트래픽 · 웹 디자인 전문",
  description: "SEO 컨설팅, 백링크 구축, 트래픽 유입, SEO 웹 디자인, 도메인 브로커 등 전문 SEO 서비스. 무료 상담 가능.",
  openGraph: {
    title: "전문 SEO 서비스 | SEO월드",
    description: "백링크, 트래픽, 웹 디자인, 도메인 브로커 — 전문가에게 맡기세요.",
  },
  alternates: { canonical: "/services" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "SEO 전문 서비스",
  description: "백링크 구축, 트래픽 유입, SEO 웹 디자인, 도메인 브로커 등 전문 SEO 서비스",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <h1 className="text-3xl font-bold">SEO 서비스</h1>
      <p className="mt-2 text-muted-foreground">
        SEO 컨설팅과 전문 서비스로 웹사이트 검색 성과를 극대화하세요.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {services.map((svc) => (
          <Link
            key={svc.href}
            href={svc.href}
            className="rounded-lg border p-6 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">{svc.title}</h2>
            <p className="mt-2 text-muted-foreground">{svc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
