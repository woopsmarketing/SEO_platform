import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedTools } from "@/components/related-tools";
import { PaaForm } from "./paa-form";

export const metadata: Metadata = {
  title: "People Also Ask 추출기 — 구글 연관 질문 무료 확인",
  description:
    "키워드를 입력하면 구글 PAA(People Also Ask) 박스의 연관 질문을 즉시 추출합니다. FAQ 소재 발굴, 피처드 스니펫 공략, 질문형 키워드 수집에 활용하세요.",
  openGraph: {
    title: "People Also Ask 추출기 | SEO월드",
    description:
      "구글 PAA 연관 질문을 무료로 추출해 FAQ 페이지와 피처드 스니펫 공략에 활용하세요.",
  },
  alternates: { canonical: "/tools/people-also-ask" },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "People Also Ask 추출기",
  description:
    "키워드 입력 시 구글 PAA 박스의 연관 질문을 추출하는 무료 SEO 도구",
  url: "https://seoworld.co.kr/tools/people-also-ask",
  inLanguage: "ko",
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "People Also Ask 추출기",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "구글 People Also Ask 박스에서 연관 질문을 자동으로 수집하는 무료 SEO 도구",
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "PAA 연관 질문 추출 방법",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "키워드 입력",
      text: "분석할 키워드를 입력창에 입력합니다.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "PAA 찾기 실행",
      text: "PAA 찾기 버튼을 클릭하면 구글 People Also Ask 박스의 연관 질문을 자동으로 추출합니다.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "질문 활용",
      text: "추출된 질문을 FAQ 페이지, 블로그 주제, 피처드 스니펫 공략에 활용합니다.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "People Also Ask가 정확히 뭔가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "People Also Ask(PAA)는 구글 검색결과 페이지 중간에 나타나는 '관련 질문' 박스입니다. 검색자가 추가로 궁금해할 만한 질문을 구글이 자동으로 수집·노출하며, 각 질문을 클릭하면 출처 페이지의 스니펫이 펼쳐집니다. PAA 박스는 전체 검색결과의 40~50%에서 등장할 정도로 흔하며, 여기 노출되면 클릭 없이도 브랜드 인지도가 높아지는 효과가 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "PAA에 노출되려면 어떻게 해야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "질문을 H2 또는 H3로 명시하고 바로 아래에 40~60단어의 간결한 답변을 작성하세요. FAQPage 구조화 데이터를 함께 마크업하면 구글이 콘텐츠를 PAA 후보로 인식할 가능성이 높아집니다. 답변은 사실 중심으로 짧게 작성하고, 페이지 권위(백링크·DA)도 함께 높이면 노출 확률이 올라갑니다.",
      },
    },
    {
      "@type": "Question",
      name: "PAA 질문과 연관 검색어 차이는?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PAA는 검색 의도를 확장하는 '질문 형식'의 제안이며, 구글이 답변 스니펫까지 함께 노출합니다. 반면 연관 검색어(Related Searches)는 검색결과 하단에 표시되는 키워드 목록으로, 질문 형태보다는 단어·구문 위주입니다. 콘텐츠 기획 시 PAA는 FAQ 구조, 연관 검색어는 내부 링크 앵커 텍스트에 각각 활용하면 효과적입니다.",
      },
    },
    {
      "@type": "Question",
      name: "추출된 질문을 그대로 써도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "질문 문구 자체는 검색자의 표현을 반영한 것이므로 그대로 H3 제목으로 사용해도 됩니다. 다만 답변은 반드시 직접 작성해야 하며, 타 페이지의 스니펫을 복사하면 중복 콘텐츠 문제가 생깁니다. 질문을 페이지 내 FAQ 섹션에 배치하고 FAQPage 스키마로 마크업하면 구글이 PAA에 연결할 가능성이 높아집니다.",
      },
    },
    {
      "@type": "Question",
      name: "영어·일본어 PAA도 확인할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "현재 도구는 한국어 구글 결과 기준으로 추출합니다. 다른 국가·언어별 검색결과를 확인하려면 지역 SERP 체커를 함께 활용하세요. 국가 코드와 언어를 지정해 현지화된 검색결과를 시뮬레이션할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "콘텐츠 작성 도움이 필요하면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PAA 질문 목록을 준비했지만 실제 콘텐츠 제작이나 피처드 스니펫 최적화까지 전문가 도움이 필요하다면 SEO월드 전문가 팀에 문의하세요. 키워드 분석부터 콘텐츠 설계, 구조화 데이터 마크업까지 맞춤 지원합니다.",
      },
    },
  ],
};

const faqs = [
  {
    q: "People Also Ask가 정확히 뭔가요?",
    a: "People Also Ask(PAA)는 구글 검색결과 페이지 중간에 나타나는 &#39;관련 질문&#39; 박스입니다. 검색자가 추가로 궁금해할 만한 질문을 구글이 자동으로 수집·노출하며, 각 질문을 클릭하면 출처 페이지의 스니펫이 펼쳐집니다. PAA 박스는 전체 검색결과의 40~50%에서 등장할 정도로 흔하며, 여기 노출되면 클릭 없이도 브랜드 인지도가 높아지는 효과가 있습니다.",
  },
  {
    q: "PAA에 노출되려면 어떻게 해야 하나요?",
    a: "질문을 H2 또는 H3로 명시하고 바로 아래에 40~60단어의 간결한 답변을 작성하세요. FAQPage 구조화 데이터를 함께 마크업하면 구글이 콘텐츠를 PAA 후보로 인식할 가능성이 높아집니다. 답변은 사실 중심으로 짧게 작성하고, 페이지 권위(백링크·DA)도 함께 높이면 노출 확률이 올라갑니다.",
  },
  {
    q: "PAA 질문과 연관 검색어 차이는?",
    a: "PAA는 검색 의도를 확장하는 &#39;질문 형식&#39;의 제안이며, 구글이 답변 스니펫까지 함께 노출합니다. 반면 연관 검색어(Related Searches)는 검색결과 하단에 표시되는 키워드 목록으로, 질문 형태보다는 단어·구문 위주입니다. 콘텐츠 기획 시 PAA는 FAQ 구조, 연관 검색어는 내부 링크 앵커 텍스트에 각각 활용하면 효과적입니다.",
  },
  {
    q: "추출된 질문을 그대로 써도 되나요?",
    a: "질문 문구 자체는 검색자의 표현을 반영한 것이므로 그대로 H3 제목으로 사용해도 됩니다. 다만 답변은 반드시 직접 작성해야 하며, 타 페이지의 스니펫을 복사하면 중복 콘텐츠 문제가 생깁니다. 질문을 페이지 내 FAQ 섹션에 배치하고 FAQPage 스키마로 마크업하면 구글이 PAA에 연결할 가능성이 높아집니다.",
  },
  {
    q: "영어·일본어 PAA도 확인할 수 있나요?",
    a: "현재 도구는 한국어 구글 결과 기준으로 추출합니다. 다른 국가·언어별 검색결과를 확인하려면 지역 SERP 체커를 함께 활용하세요. 국가 코드와 언어를 지정해 현지화된 검색결과를 시뮬레이션할 수 있습니다.",
    link: { href: "/tools/local-serp", label: "지역 SERP 체커 사용하기" },
  },
  {
    q: "콘텐츠 작성 도움이 필요하면?",
    a: "PAA 질문 목록을 준비했지만 실제 콘텐츠 제작이나 피처드 스니펫 최적화까지 전문가 도움이 필요하다면 SEO월드 전문가 팀에 문의하세요. 키워드 분석부터 콘텐츠 설계, 구조화 데이터 마크업까지 맞춤 지원합니다.",
    link: { href: "/contact", label: "무료 상담 신청" },
  },
];

export default function PeopleAlsoAskPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          People Also Ask 추출기 — 구글 연관 질문 추출
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          구글 PAA 박스의 질문형 키워드를 한 번에 수집
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          키워드를 입력하면 구글이 PAA(People Also Ask) 박스에 노출하는 연관
          질문을 즉시 추출합니다. FAQ 페이지 제작, 피처드 스니펫 공략, 블로그
          주제 발굴에 활용하세요.
        </p>
      </div>

      {/* 3 Info Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-blue-900">
              PAA가 SEO에 중요한 이유
            </h2>
            <p className="text-xs leading-relaxed text-blue-800/80">
              구글 검색결과의 약 40~50%에 PAA 박스가 등장합니다. PAA에 노출되면
              클릭 없이도 답변이 노출되어 브랜드 신뢰도가 올라가고, 박스 클릭
              시 CTR이 즉각 상승합니다. 질문형 키워드는 음성 검색에도
              직결됩니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50 border-green-100">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-green-900">
              FAQ 소재와 블로그 주제 발굴
            </h2>
            <p className="text-xs leading-relaxed text-green-800/80">
              추출된 질문은 FAQ 페이지 H3 제목으로 바로 쓸 수 있습니다.
              카테고리별로 분류하면 시리즈 콘텐츠 기획도 가능하며, 경쟁이
              답변하지 않은 질문을 선점하면 PAA 노출 기회를 빠르게 확보할 수
              있습니다.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="pb-5 pt-5">
            <h2 className="mb-2 text-sm font-semibold text-amber-900">
              피처드 스니펫 공략
            </h2>
            <p className="text-xs leading-relaxed text-amber-800/80">
              PAA 질문에 40~60단어의 간결한 답변을 작성하고 FAQPage 구조화
              데이터를 마크업하면 피처드 스니펫 후보가 됩니다. 스니펫 노출 시
              검색결과 최상단 &ldquo;0위&rdquo;를 선점해 클릭률이 크게
              높아집니다.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* HowTo 3단계 */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-bold">PAA 연관 질문 추출 방법</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "키워드 입력",
              desc: "분석할 키워드를 입력창에 입력합니다.",
            },
            {
              step: "2",
              title: "PAA 찾기 실행",
              desc: "PAA 찾기 버튼을 클릭하면 구글 PAA 박스 질문을 자동으로 수집합니다.",
            },
            {
              step: "3",
              title: "질문 활용",
              desc: "추출된 질문을 FAQ·블로그 주제·피처드 스니펫 공략에 사용하세요.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-3 rounded-xl border bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Form */}
      <PaaForm />

      {/* Guide Article */}
      <article className="tools-prose mt-16 border-t pt-12 max-w-none">
        <h2 className="mb-3 text-xl font-bold">
          People Also Ask 박스가 SEO에 중요한 이유
        </h2>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          구글은 검색결과 중간에 &ldquo;People Also Ask&rdquo;(연관 질문) 박스를
          삽입합니다. 이 박스는 검색자가 한 가지 키워드를 입력했을 때 추가로
          궁금해할 가능성이 높은 질문들을 자동으로 수집·정리해 노출하는
          기능입니다. SEMrush 데이터 기준 전체 구글 검색결과의 43% 이상에 PAA
          박스가 표시되며, 특히 정보성 쿼리에서 그 비율은 더욱 높습니다.
        </p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          PAA 박스에 내 페이지가 답변 출처로 노출되면 클릭 없이도 콘텐츠가
          검색자에게 전달됩니다. 이는 브랜드 신뢰도를 높이고 유기적 클릭률
          (CTR) 상승으로 이어집니다. 또한 음성 검색(스마트 스피커, 모바일
          어시스턴트)은 질문형 쿼리를 처리할 때 PAA 답변 출처를 우선 참조하므로,
          PAA 노출은 음성 검색 트래픽 확보로도 직결됩니다.
        </p>

        <h2 className="mb-3 mt-10 text-xl font-bold">
          PAA 질문으로 FAQ 페이지 만드는 법
        </h2>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          추출한 PAA 질문을 FAQ 페이지에 활용하는 가장 효과적인 방법은 질문을
          H3 태그로 마크업하고 바로 아래에 50~150단어의 간결한 답변을 배치하는
          것입니다. 답변은 질문의 핵심 키워드를 첫 문장에 포함하고, 이후 부연
          설명을 덧붙이는 구조로 작성하세요. 지나치게 긴 답변은 스니펫
          후보에서 제외될 가능성이 높습니다.
        </p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          FAQ 페이지가 완성되면 반드시 FAQPage 구조화 데이터(JSON-LD 스키마)를
          마크업하세요. 구글은 FAQPage 스키마를 인식하면 검색결과에서 FAQ
          리치 결과로 노출할 수 있으며, 이는 PAA 박스 외에도 검색결과
          리스팅의 높이를 늘려 CTR을 추가로 높이는 효과가 있습니다. 한
          페이지에 지나치게 많은 질문(20개 이상)을 몰아넣기보다 주제별로 나누어
          페이지를 분리하면 각 페이지가 더 좁은 의도를 다루어 관련성이 높아집니다.
        </p>

        <h2 className="mb-3 mt-10 text-xl font-bold">
          피처드 스니펫 공략 전략
        </h2>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          피처드 스니펫은 검색결과 최상단 &ldquo;0위&rdquo;에 표시되는 답변
          박스로, PAA와 긴밀하게 연결되어 있습니다. 스니펫 공략의 핵심은 첫
          단락에 40~60단어의 핵심 답변을 완결된 문장으로 작성하는 것입니다.
          질문을 H2·H3로 명시하고 곧바로 답변 단락을 이어붙이는 구조가 가장
          효과적입니다.
        </p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          리스트형 스니펫을 노리려면 번호 목록(ol) 또는 글머리 목록(ul)로
          단계나 항목을 정리하세요. 표 형태의 비교 정보는 테이블 스니펫 후보가
          됩니다. 어떤 형태든 공통 원칙은 &ldquo;짧고 명확하게&rdquo;입니다.
          구글은 복잡한 설명보다 핵심을 빠르게 전달하는 콘텐츠를 스니펫으로
          선택하는 경향이 있습니다.
        </p>

        <h2 className="mb-3 mt-10 text-xl font-bold">
          블로그 주제 발굴에 활용하기
        </h2>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          PAA 추출기를 활용하면 한 번에 8~10개의 연관 질문을 수집할 수 있습니다.
          이 질문들을 주제별로 분류하면 자연스러운 블로그 시리즈 콘텐츠 계획이
          만들어집니다. 예를 들어 &ldquo;백링크&rdquo; 키워드의 PAA를 추출하면
          &ldquo;백링크란?&rdquo;, &ldquo;백링크 얻는 방법&rdquo;,
          &ldquo;백링크 품질 확인법&rdquo; 등이 나오며 이를 3편짜리 입문
          시리즈로 기획할 수 있습니다.
        </p>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          경쟁사가 아직 답변하지 않은 질문을 우선 공략하세요. 검색량은 낮더라도
          PAA 박스에 기존 강력한 경쟁 페이지가 없는 틈새 질문은 빠르게 노출을
          확보할 수 있습니다. 각 질문에 대한 콘텐츠를 작성한 후 내부 링크로
          연결하면 주제 클러스터(Topic Cluster) 구조가 완성되어 사이트 전반의
          토픽 권위도가 상승합니다.
        </p>
      </article>

      {/* FAQ */}
      <section className="mt-12 border-t pt-10">
        <h2 className="mb-6 text-xl font-bold">자주 묻는 질문 (FAQ)</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {faqs.map((item, i) => (
            <div key={i} className="rounded-xl border bg-white p-5">
              <h3 className="mb-2 text-sm font-semibold">{item.q}</h3>
              <p
                className="text-sm text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
              {item.link && (
                <Link
                  href={item.link.href}
                  className="mt-2 inline-block text-xs text-blue-700 hover:underline"
                >
                  {item.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <div className="mt-12">
        <RelatedTools currentTool="people-also-ask" />
      </div>

      {/* Final CTA */}
      <section className="mt-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center text-white">
        <h2 className="mb-2 text-xl font-bold">
          PAA 전략 설계, 전문가와 함께하세요
        </h2>
        <p className="mb-5 text-sm text-blue-100">
          질문형 키워드 발굴부터 FAQ 페이지 제작, 피처드 스니펫 마크업까지
          SEO월드 전문가 팀이 맞춤 지원합니다.
        </p>
        <Link
          href="/contact"
          className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50 transition-colors"
        >
          무료 상담 신청하기
        </Link>
      </section>
    </div>
  );
}
