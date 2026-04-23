import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TelegramCTAButton } from "@/components/telegram-cta-button";

export const metadata: Metadata = {
  title: "백링크 서비스 — 오프페이지 SEO 전문 링크빌딩",
  description:
    "오프페이지 SEO의 핵심인 고품질 백링크를 전략적으로 구축합니다. 링크빌딩, 게스트 포스팅, 에디토리얼 링크로 도메인 권위를 높이세요.",
  alternates: { canonical: "/services/backlinks" },
};

/* ───── 정적 데이터 ───── */

const STATS = [
  { value: "150+", label: "사이트 SEO 개선" },
  { value: "DA 15↑", label: "평균 DA 향상" },
  { value: "78%", label: "3개월 내 1페이지 진입률" },
  { value: "96%", label: "고객 만족도" },
];

const FEATURES = [
  {
    icon: "🔗",
    title: "고품질 백링크 구축",
    description: "DA/DR 높은 권위 있는 사이트에서 자연스러운 에디토리얼 링크를 확보합니다. 스팸 링크 없이 안전하게 진행합니다.",
  },
  {
    icon: "📊",
    title: "경쟁사 분석 및 전략 수립",
    description: "상위 경쟁사의 백링크 프로필을 분석하고, 실제 효과 있는 링크 전략을 맞춤 설계합니다.",
  },
  {
    icon: "📈",
    title: "월간 성과 리포트",
    description: "매월 백링크 현황, DA/DR 변화, 검색 순위 추이를 한눈에 보여드립니다. 투명한 결과 보고가 기본입니다.",
  },
  {
    icon: "🛡️",
    title: "구글 가이드라인 완전 준수",
    description: "PBN, 링크 팜 등 위험한 방식은 사용하지 않습니다. 구글 패널티 없이 장기적으로 안전한 SEO를 추구합니다.",
  },
  {
    icon: "💬",
    title: "예산 맞춤 진행",
    description: "정해진 요금표 없이 사이트 현황과 목표, 예산에 맞게 최적의 플랜을 제안해드립니다. 부담 없이 문의하세요.",
  },
  {
    icon: "⚡",
    title: "앵커 텍스트 최적화",
    description: "자연스러운 앵커 텍스트 분포로 구글 알고리즘에 최적화된 링크 프로필을 구성합니다.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "현재 백링크 프로필 분석",
    description:
      "기존 백링크 현황, 참조 도메인, 앵커 텍스트 분포를 정밀하게 분석하여 현재 상태를 진단합니다.",
  },
  {
    step: "02",
    title: "경쟁사 분석 및 전략 수립",
    description:
      "상위 경쟁사의 백링크 전략을 분석하고, 갭을 파악하여 최적의 링크빌딩 전략을 수립합니다.",
  },
  {
    step: "03",
    title: "고품질 콘텐츠 작성 및 아웃리치",
    description:
      "타겟 사이트에 적합한 콘텐츠를 제작하고, 관련성 높은 사이트에 자연스러운 아웃리치를 진행합니다.",
  },
  {
    step: "04",
    title: "링크 확보 및 월간 리포트 제공",
    description:
      "확보된 백링크의 품질을 검증하고, DA/DR 변화 및 검색 순위 추이를 포함한 상세 리포트를 제공합니다.",
  },
];

const CASES = [
  {
    company: "A사 (이커머스)",
    result: "백링크 30개 구축 후 3개월 만에 DA 12 → 27 향상",
    detail: "구글 1페이지 진입 키워드 8개 확보, 오가닉 트래픽 340% 증가",
  },
  {
    company: "B사 (SaaS)",
    result: "6개월 백링크 전략으로 월 방문자 2,300 → 8,500 증가",
    detail: "핵심 키워드 15개 중 11개 구글 1페이지 진입 달성",
  },
];

const FAQS = [
  {
    q: "백링크란 무엇인가요?",
    a: "백링크는 다른 웹사이트에서 내 사이트로 연결되는 링크입니다. 구글은 백링크를 '추천 투표'로 간주하여 검색 순위 결정에 중요한 요소로 활용합니다. 양질의 백링크가 많을수록 도메인 권위(DA)가 높아지고 검색 결과에서 상위에 노출될 가능성이 커집니다.",
  },
  {
    q: "고품질 백링크와 저품질 백링크의 차이는?",
    a: "고품질 백링크는 DA/DR이 높고 관련성 있는 사이트에서 자연스럽게 연결된 링크입니다. 저품질 백링크는 스팸 사이트, 링크 팜 등에서 인위적으로 생성된 링크로, 구글 패널티를 유발할 수 있습니다. 저희는 모든 링크의 품질을 사전 검증하여 안전한 백링크만 제공합니다.",
  },
  {
    q: "효과를 보려면 얼마나 걸리나요?",
    a: "일반적으로 백링크 구축 후 1~3개월 내에 DA/DR 변화가 나타나기 시작하며, 검색 순위 개선은 2~4개월 후부터 확인됩니다. 경쟁 강도와 현재 사이트 상태에 따라 다를 수 있으며, 꾸준한 링크빌딩이 장기적 효과를 만듭니다.",
  },
  {
    q: "구글 패널티 위험은 없나요?",
    a: "저희는 구글 웹마스터 가이드라인을 철저히 준수합니다. 스팸 사이트나 PBN(Private Blog Network)을 사용하지 않으며, 자연스러운 에디토리얼 링크와 게스트 포스팅 위주로 진행하여 패널티 위험이 없습니다.",
  },
  {
    q: "언제든 취소할 수 있나요?",
    a: "월 단위 계약이므로 다음 결제일 전에 언제든 취소 가능합니다. 이미 구축된 백링크는 취소 후에도 유지됩니다. 다만 꾸준한 링크빌딩이 최상의 결과를 만들므로 최소 3개월 이상 진행을 권장합니다.",
  },
  {
    q: "어떤 사이트에 백링크를 구축하나요?",
    a: "업종과 관련성 높은 권위 있는 사이트를 선정합니다. 뉴스/미디어 사이트, 업계 전문 블로그, 포럼, 디렉토리 등 다양한 유형의 사이트에서 자연스러운 링크를 확보하며, 모든 타겟 사이트는 DA/스팸 점수를 사전 검증합니다.",
  },
];

/* ───── 페이지 컴포넌트 ───── */

export default function BacklinksServicePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* ── 히어로 섹션 ── */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          검색 순위를 끌어올리는
          <br className="sm:hidden" /> 전문 백링크 서비스
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          오프페이지 SEO의 핵심인 고품질 링크빌딩으로 도메인 권위를 높이고,
          구글 검색 상위 노출을 달성하세요.
        </p>
        <div className="mt-6">
          <TelegramCTAButton source="service_page" tool="backlinks" label="무료 상담 신청하기" />
        </div>
      </section>

      {/* ── 신뢰 지표 ── */}
      <section className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-card p-6 text-center"
          >
            <p className="text-2xl font-bold text-primary sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── 서비스 특징 ── */}
      <section className="mb-16">
        <h2 className="mb-2 text-center text-2xl font-bold">서비스 특징</h2>
        <p className="mb-8 text-center text-muted-foreground">
          예산과 목표에 맞게 맞춤 설계해드립니다. 부담 없이 문의하세요.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{f.icon}</span>
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <TelegramCTAButton source="service_page" tool="backlinks" label="맞춤 플랜 문의하기" />
        </div>
      </section>

      {/* ── 성과 사례 ── */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold">성과 사례</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {CASES.map((c) => (
            <Card key={c.company}>
              <CardHeader>
                <CardTitle className="text-lg">{c.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-primary">{c.result}</p>
                <p className="text-sm text-muted-foreground">{c.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 손실 프레이밍 CTA ── */}
      <section className="mb-16 rounded-lg bg-destructive/5 border border-destructive/20 p-8 text-center">
        <p className="text-lg font-semibold">
          경쟁사는 매달 백링크를 늘리고 있습니다.
        </p>
        <p className="mt-2 text-muted-foreground">
          지금 행동하지 않으면 검색 순위는 계속 밀려납니다.
        </p>
        <p className="mt-4 text-sm font-medium text-destructive">
          이번 달 신규 문의 마감이 임박했습니다
        </p>
        <div className="mt-4">
          <TelegramCTAButton source="service_page" tool="backlinks" label="지금 상담 신청하기" />
        </div>
      </section>

      {/* ── 진행 프로세스 ── */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-bold">서비스 진행 프로세스</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((s) => (
            <div key={s.step} className="rounded-lg border bg-card p-6">
              <span className="text-3xl font-bold text-primary/30">
                {s.step}
              </span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 문의 CTA ── */}
      <section id="inquiry" className="mb-16 scroll-mt-20">
        <h2 className="mb-8 text-center text-2xl font-bold">무료 상담 신청</h2>
        <div className="mx-auto max-w-lg text-center">
          <p className="text-muted-foreground mb-6">텔레그램으로 간편하게 문의하세요. 빠르게 답변드립니다.</p>
          <TelegramCTAButton source="service_page" tool="backlinks" label="텔레그램으로 무료 문의하기" />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t pt-12">
        <h2 className="mb-8 text-center text-2xl font-bold">
          백링크 서비스 FAQ
        </h2>
        <div className="mx-auto max-w-3xl space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b pb-6 last:border-b-0">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
