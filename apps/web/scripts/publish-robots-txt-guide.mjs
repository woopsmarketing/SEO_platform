import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// .env.local에서 환경변수 읽기
const envContent = readFileSync('/mnt/d/Documents/SEO_platform/apps/web/.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const slug = 'how-to-write-robots-txt';

const content = `<div class="blog-box blog-box-summary">
  <h4>핵심 요약</h4>
  <ul>
    <li>robots.txt는 검색엔진 크롤러에게 사이트의 어떤 경로를 크롤링해도 되는지 알려주는 텍스트 파일입니다.</li>
    <li>User-agent, Disallow, Allow, Sitemap 4가지 디렉티브만 이해하면 대부분의 상황에 대응할 수 있습니다.</li>
    <li>robots.txt는 크롤링을 제어할 뿐 검색 결과 노출을 완전히 차단하지는 않으므로, 민감한 페이지는 noindex 메타태그를 병행해야 합니다.</li>
  </ul>
</div>

<h2 id="what-is-robots-txt">robots.txt란 무엇인가</h2>

<p>robots.txt는 웹사이트의 루트 디렉토리에 위치하는 텍스트 파일로, 검색엔진 크롤러에게 사이트의 어떤 영역을 크롤링해도 되고, 어떤 영역은 방문하지 말아야 하는지 알려주는 역할을 합니다. 공식 명칭은 Robots Exclusion Protocol이며, 1994년부터 사용된 웹 표준입니다.</p>

<p>구글, 빙, 네이버 등 주요 검색엔진의 크롤러는 사이트를 방문할 때 가장 먼저 <code>https://도메인/robots.txt</code> 파일을 확인합니다. 이 파일이 없으면 크롤러는 사이트 전체를 자유롭게 크롤링하며, 파일이 있으면 명시된 규칙에 따라 접근을 제한합니다.</p>

<div class="blog-box blog-box-info">
  <p><strong>참고</strong> robots.txt는 크롤링을 "요청"하는 것이지 "강제"하는 것이 아닙니다. 대부분의 합법적인 크롤러는 이 규칙을 준수하지만, 악성 봇은 무시할 수 있습니다. 민감한 정보 보호에는 서버 인증이나 접근 제어를 사용해야 합니다.</p>
</div>

<h2 id="why-robots-txt-matters">robots.txt가 SEO에 중요한 이유</h2>

<p>robots.txt 작성법을 모르면 의도치 않게 중요한 페이지의 크롤링을 차단하거나, 반대로 크롤링이 불필요한 페이지에 크롤 예산을 낭비할 수 있습니다. 크롤 예산(Crawl Budget)은 구글이 일정 기간 동안 사이트에서 크롤링하는 페이지 수의 한도를 의미하며, 이를 효율적으로 관리하는 것이 테크니컬 SEO의 핵심입니다.</p>

<div class="blog-stats-grid">
  <div>
    <div class="blog-stat-number">크롤 예산 관리</div>
    <div class="blog-stat-label">불필요한 페이지 크롤링을 차단하여 중요 페이지에 크롤 예산 집중</div>
  </div>
  <div>
    <div class="blog-stat-number">중복 콘텐츠 방지</div>
    <div class="blog-stat-label">검색 파라미터, 프린트 페이지 등 중복 URL의 크롤링 차단</div>
  </div>
  <div>
    <div class="blog-stat-number">서버 부하 감소</div>
    <div class="blog-stat-label">불필요한 크롤러 접근을 줄여 서버 리소스 절약</div>
  </div>
  <div>
    <div class="blog-stat-number">사이트맵 연결</div>
    <div class="blog-stat-label">Sitemap 디렉티브로 크롤러가 사이트맵을 자동 발견</div>
  </div>
</div>

<p>특히 페이지 수가 수천 개 이상인 대규모 사이트에서는 robots.txt로 크롤링 효율을 관리하지 않으면 새 콘텐츠의 색인이 지연되거나, 중요하지 않은 페이지만 반복 크롤링되는 문제가 발생할 수 있습니다.</p>

<h2 id="robots-txt-basic-structure">robots.txt 기본 구조와 디렉티브</h2>

<p>robots.txt 파일은 4가지 핵심 디렉티브로 구성됩니다. 이 구조만 이해하면 대부분의 상황에서 올바르게 작성할 수 있습니다.</p>

<h3>User-agent — 대상 크롤러 지정</h3>

<p>User-agent 디렉티브는 규칙을 적용할 크롤러를 지정합니다. <code>*</code>(와일드카드)를 사용하면 모든 크롤러에 적용되고, 특정 크롤러 이름을 지정하면 해당 봇에만 적용됩니다.</p>

<pre><code># 모든 크롤러에 적용
User-agent: *

# 구글봇에만 적용
User-agent: Googlebot

# 네이버 크롤러에만 적용
User-agent: Yeti</code></pre>

<h3>Disallow — 크롤링 차단 경로</h3>

<p>Disallow는 크롤러가 접근하면 안 되는 경로를 지정합니다. 경로는 슬래시(<code>/</code>)로 시작해야 하며, 해당 경로 아래의 모든 하위 페이지도 함께 차단됩니다.</p>

<pre><code># /admin/ 하위 모든 페이지 차단
Disallow: /admin/

# 특정 파일 차단
Disallow: /private-page.html

# 모든 크롤링 차단
Disallow: /

# 크롤링 제한 없음 (빈 값)
Disallow:</code></pre>

<h3>Allow — 예외 허용 경로</h3>

<p>Allow는 Disallow로 차단된 상위 경로 내에서 특정 하위 경로를 다시 허용할 때 사용합니다. 구글과 빙은 Allow를 지원하지만, 모든 크롤러가 지원하는 것은 아닙니다.</p>

<pre><code>User-agent: *
Disallow: /admin/
Allow: /admin/public/</code></pre>

<h3>Sitemap — 사이트맵 위치 안내</h3>

<p>Sitemap 디렉티브에 사이트맵의 전체 URL을 명시하면 크롤러가 사이트맵을 자동으로 인식합니다. robots.txt에 사이트맵을 연결하는 것은 필수는 아니지만 강력히 권장됩니다.</p>

<pre><code>Sitemap: https://example.com/sitemap.xml</code></pre>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> Sitemap 디렉티브는 User-agent 블록 밖에 독립적으로 작성합니다. 여러 개의 사이트맵이 있다면 각각 별도 줄에 작성하면 됩니다.</p>
</div>

<h2 id="step-by-step-writing-guide">robots.txt 단계별 작성 방법</h2>

<p>실제로 robots.txt를 처음부터 작성하는 과정을 단계별로 안내합니다. 이 가이드를 따라하면 5분 안에 올바른 robots.txt 파일을 완성할 수 있습니다.</p>

<h3>1단계: 텍스트 파일 생성</h3>

<p>메모장, VS Code, 또는 아무 텍스트 편집기에서 새 파일을 생성합니다. 파일명은 반드시 <code>robots.txt</code>여야 하며, 인코딩은 UTF-8로 저장해야 합니다. BOM(Byte Order Mark) 없는 UTF-8을 사용하는 것이 안전합니다.</p>

<h3>2단계: User-agent와 규칙 작성</h3>

<p>크롤링 규칙을 작성합니다. 가장 흔한 패턴은 모든 봇에 대해 관리자 페이지와 내부 검색 결과만 차단하는 것입니다.</p>

<pre><code>User-agent: *
Disallow: /admin/
Disallow: /search?
Disallow: /api/
Disallow: /tmp/</code></pre>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> <code>Disallow: /</code>로 설정하면 사이트 전체가 크롤링에서 차단됩니다. 이렇게 설정하면 검색 결과에 사이트가 전혀 노출되지 않을 수 있으니 매우 주의하세요.</p>
</div>

<h3>3단계: Sitemap 경로 추가</h3>

<p>파일 하단에 사이트맵 URL을 추가합니다. 반드시 프로토콜(https://)을 포함한 전체 URL을 작성해야 합니다.</p>

<pre><code>Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-posts.xml</code></pre>

<h3>4단계: 루트 디렉토리에 업로드</h3>

<p>완성된 파일을 웹서버의 루트 디렉토리에 업로드합니다. 브라우저에서 <code>https://도메인/robots.txt</code>로 접근했을 때 파일 내용이 표시되면 정상입니다. FTP 클라이언트나 호스팅 파일 관리자를 사용하거나, Next.js/워드프레스 등 프레임워크의 public 디렉토리에 배치합니다.</p>

<h2 id="real-world-examples">상황별 robots.txt 예시 코드</h2>

<p>실무에서 자주 만나는 상황별 robots.txt 예시를 정리했습니다. 본인의 사이트 구조에 맞는 예시를 참고하여 작성하세요.</p>

<h3>기본 — 전체 허용 + 사이트맵</h3>

<p>소규모 사이트에서 모든 페이지의 크롤링을 허용하면서 사이트맵만 안내하는 가장 단순한 형태입니다.</p>

<pre><code>User-agent: *
Disallow:

Sitemap: https://example.com/sitemap.xml</code></pre>

<h3>관리자 및 내부 페이지 차단</h3>

<p>대부분의 사이트에 적합한 범용 설정입니다. 관리자 페이지, API 경로, 검색 결과 페이지를 차단합니다.</p>

<pre><code>User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /search?
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/

Sitemap: https://example.com/sitemap.xml</code></pre>

<h3>워드프레스 사이트</h3>

<p>워드프레스의 기본 구조에 맞춘 설정입니다. wp-admin은 차단하되 admin-ajax.php는 허용합니다(일부 플러그인이 이 경로를 사용).</p>

<pre><code>User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Disallow: /?s=
Disallow: /search/

Sitemap: https://example.com/sitemap_index.xml</code></pre>

<h3>Next.js / SPA 사이트</h3>

<p>Next.js나 React 기반 사이트에서 API 라우트와 내부 경로를 차단하는 설정입니다.</p>

<pre><code>User-agent: *
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml</code></pre>

<h3>쇼핑몰 — 필터/정렬 파라미터 차단</h3>

<p>쇼핑몰에서는 상품 필터, 정렬, 페이지네이션 URL이 중복 콘텐츠를 대량 생성합니다. 이런 동적 URL을 차단하면 크롤 예산을 절약할 수 있습니다.</p>

<pre><code>User-agent: *
Disallow: /cart/
Disallow: /checkout/
Disallow: /my-account/
Disallow: /*?sort=
Disallow: /*?filter=
Disallow: /*&page=

Sitemap: https://example.com/sitemap.xml</code></pre>

<h3>특정 크롤러만 차단</h3>

<p>AI 학습용 크롤러나 특정 봇만 선택적으로 차단하는 설정입니다.</p>

<pre><code>User-agent: *
Disallow:

User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: https://example.com/sitemap.xml</code></pre>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 2024년 이후 OpenAI의 GPTBot, Anthropic의 ClaudeBot 등 AI 학습 목적의 크롤러가 늘어나고 있습니다. 콘텐츠 보호가 필요한 경우 해당 봇을 robots.txt에서 차단할 수 있습니다.</p>
</div>

<table class="blog-comparison">
  <thead>
    <tr><th>상황</th><th>핵심 규칙</th><th>주의사항</th></tr>
  </thead>
  <tbody>
    <tr><td>전체 허용</td><td>Disallow: (빈 값)</td><td>사이트맵 연결 권장</td></tr>
    <tr><td>관리자 차단</td><td>Disallow: /admin/</td><td>로그인 페이지도 포함 검토</td></tr>
    <tr><td>전체 차단</td><td>Disallow: /</td><td>검색 결과에서 사이트 제거됨</td></tr>
    <tr><td>파라미터 차단</td><td>Disallow: /*?sort=</td><td>와일드카드 지원 여부 확인</td></tr>
    <tr><td>AI 봇 차단</td><td>User-agent: GPTBot</td><td>정기적으로 새 봇 이름 확인</td></tr>
  </tbody>
</table>

<h2 id="common-mistakes">robots.txt 작성 시 흔한 실수 5가지</h2>

<p>robots.txt는 간단한 파일이지만, 작은 실수 하나로 사이트 전체의 검색 노출이 사라질 수 있습니다. 실무에서 자주 발생하는 실수를 정리했습니다.</p>

<h3>1. 루트가 아닌 경로에 파일 배치</h3>

<p>robots.txt는 반드시 도메인 루트에 위치해야 합니다. <code>https://example.com/robots.txt</code>는 인식하지만, <code>https://example.com/pages/robots.txt</code>는 크롤러가 무시합니다.</p>

<h3>2. Disallow: / 로 전체 차단</h3>

<p>개발 환경에서 테스트용으로 전체 크롤링을 차단한 뒤, 라이브 배포 시 이를 해제하지 않는 경우가 매우 흔합니다. 이 한 줄로 인해 사이트가 검색 결과에서 완전히 사라질 수 있습니다.</p>

<h3>3. Allow/Disallow 규칙 순서 혼동</h3>

<p>구글은 더 구체적인 경로의 규칙을 우선 적용합니다. 하지만 다른 크롤러는 순서에 따라 처리할 수 있으므로, 더 구체적인 Allow 규칙을 Disallow보다 먼저 작성하는 것이 안전합니다.</p>

<h3>4. Sitemap URL에 상대 경로 사용</h3>

<p>Sitemap 디렉티브에는 반드시 <code>https://</code>를 포함한 전체 URL을 작성해야 합니다. <code>Sitemap: /sitemap.xml</code>과 같은 상대 경로는 크롤러가 인식하지 못합니다.</p>

<h3>5. robots.txt로 민감한 정보 보호 시도</h3>

<p>robots.txt는 공개 파일이므로 누구나 내용을 볼 수 있습니다. 차단된 경로를 오히려 노출하는 셈이 됩니다. 비밀번호, 결제 정보 등 민감한 페이지는 서버 인증으로 보호해야 합니다.</p>

<ul class="blog-checklist">
  <li>robots.txt가 도메인 루트에 정상 배치되었는지 확인</li>
  <li>Disallow: / 전체 차단이 실수로 남아 있지 않은지 점검</li>
  <li>Sitemap URL이 프로토콜 포함 전체 경로인지 확인</li>
  <li>중요한 페이지(홈, 블로그, 상품 페이지)가 차단되지 않았는지 검증</li>
  <li>개발 환경과 프로덕션 환경의 robots.txt가 다르게 설정되었는지 확인</li>
</ul>

<h2 id="testing-robots-txt">robots.txt 테스트 및 검증 방법</h2>

<p>robots.txt를 작성한 후에는 반드시 테스트를 진행해야 합니다. 의도한 대로 크롤링 규칙이 동작하는지 검증하지 않으면 예상치 못한 문제가 발생할 수 있습니다.</p>

<h3>구글 서치 콘솔 robots.txt 테스터</h3>

<p>구글 서치콘솔의 robots.txt 테스터 도구에서 특정 URL이 차단되는지 허용되는지 실시간으로 확인할 수 있습니다. URL을 입력하면 현재 robots.txt 규칙에 따라 차단 여부를 즉시 표시합니다.</p>

<h3>브라우저에서 직접 확인</h3>

<p>가장 단순한 방법은 브라우저 주소창에 <code>https://도메인/robots.txt</code>를 입력하는 것입니다. 파일 내용이 텍스트로 표시되면 정상이고, 404 오류가 나오면 파일이 올바르게 업로드되지 않은 것입니다.</p>

<h3>서드파티 검증 도구 활용</h3>

<p>Google의 Robots Testing Tool API나 온라인 robots.txt 검증 도구를 사용하면 문법 오류를 자동으로 감지할 수 있습니다. 특히 규칙이 복잡한 경우 도구로 검증하는 것을 권장합니다.</p>

<div class="blog-inline-cta">
  <p>robots.txt 작성이 번거로우신가요? SEO월드의 무료 도구로 자동 생성해보세요.</p>
  <a href="/tools/robots-generator" class="blog-cta-button">Robots.txt 생성기 사용하기 →</a>
</div>

<h2 id="robots-txt-vs-noindex">robots.txt와 noindex의 차이점</h2>

<p>많은 분들이 robots.txt로 크롤링을 차단하면 검색 결과에서 완전히 사라진다고 오해합니다. 하지만 robots.txt와 noindex는 근본적으로 다른 메커니즘입니다.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>항목</th><th>robots.txt Disallow</th><th>noindex 메타태그</th></tr>
  </thead>
  <tbody>
    <tr><td>동작</td><td>크롤러의 접근 자체를 차단</td><td>크롤링은 허용하되 색인 제외</td></tr>
    <tr><td>검색 결과</td><td>외부 링크가 있으면 URL만 표시될 수 있음</td><td>검색 결과에서 완전히 제거</td></tr>
    <tr><td>적용 위치</td><td>robots.txt 파일 (서버 루트)</td><td>HTML head 또는 HTTP 헤더</td></tr>
    <tr><td>적합한 용도</td><td>크롤 예산 관리, 서버 부하 감소</td><td>특정 페이지의 검색 노출 차단</td></tr>
  </tbody>
</table>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> robots.txt로 차단된 페이지에 noindex 태그가 있어도, 크롤러가 해당 페이지에 접근하지 못하므로 noindex를 읽을 수 없습니다. 검색 결과에서 완전히 제거하려면 먼저 robots.txt 차단을 해제하고 noindex를 적용한 뒤, 크롤러가 noindex를 인식한 후에 다시 차단해야 합니다.</p>
</div>

<h2 id="robots-txt-and-sitemap">robots.txt와 사이트맵 연결하기</h2>

<p>robots.txt에 Sitemap 디렉티브를 추가하면 크롤러가 사이트맵을 자동으로 발견할 수 있습니다. 구글 서치콘솔에서 사이트맵을 직접 제출할 수 있지만, robots.txt에도 명시하면 이중으로 안전합니다.</p>

<pre><code>User-agent: *
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-blog.xml
Sitemap: https://example.com/sitemap-products.xml</code></pre>

<p>여러 개의 사이트맵이 있다면 각각 별도의 Sitemap 라인으로 작성합니다. 사이트맵 인덱스 파일을 사용하는 경우 인덱스 파일 URL 하나만 명시해도 됩니다.</p>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 사이트맵이 아직 없다면 <a href="/tools/sitemap-generator">SEO월드 사이트맵 생성기</a>로 먼저 만드세요. 사이트맵과 robots.txt를 함께 설정하면 크롤러가 사이트 구조를 가장 효율적으로 파악합니다.</p>
</div>

<h2 id="advanced-tips">robots.txt 고급 활용 팁</h2>

<h3>와일드카드(*) 패턴 매칭</h3>

<p>구글과 빙은 robots.txt에서 와일드카드(<code>*</code>)와 경로 종료 표시(<code>$</code>)를 지원합니다. 이를 활용하면 더 정교한 규칙을 작성할 수 있습니다.</p>

<pre><code># .pdf 파일 전체 차단
User-agent: *
Disallow: /*.pdf$

# 특정 파라미터가 포함된 URL 차단
Disallow: /*?sessionid=

# 특정 확장자 차단
Disallow: /*.json$</code></pre>

<h3>Crawl-delay 디렉티브</h3>

<p>일부 크롤러(빙, 네이버)는 Crawl-delay 디렉티브를 지원합니다. 서버 부하가 높을 때 크롤러의 요청 간격을 조절할 수 있습니다. 단, 구글은 이 디렉티브를 무시하므로 구글 크롤링 속도는 서치콘솔에서 별도로 설정해야 합니다.</p>

<pre><code>User-agent: Bingbot
Crawl-delay: 10

User-agent: Yeti
Crawl-delay: 5</code></pre>

<h3>정기적인 robots.txt 검토</h3>

<p>사이트 구조가 변경될 때마다 robots.txt도 함께 업데이트해야 합니다. 새 디렉토리가 추가되거나 URL 구조가 바뀌면 기존 규칙이 의도와 다르게 동작할 수 있습니다. 분기별 1회 이상 검토하는 것을 권장합니다.</p>

<div class="blog-summary-card">
  <h4>robots.txt 작성 핵심 정리</h4>
  <ul>
    <li>robots.txt는 도메인 루트에 UTF-8 텍스트 파일로 저장합니다.</li>
    <li>User-agent, Disallow, Allow, Sitemap 4가지 디렉티브로 크롤링을 제어합니다.</li>
    <li>Disallow: / 전체 차단은 검색 노출이 사라지므로 절대 주의하세요.</li>
    <li>검색 결과 완전 차단이 필요하면 noindex 메타태그를 병행해야 합니다.</li>
    <li>작성 후 구글 서치콘솔 robots.txt 테스터로 반드시 검증하세요.</li>
    <li><a href="/blog/google-search-console-guide">구글 서치콘솔 사용법</a>을 참고하면 색인 상태와 크롤링 오류를 함께 관리할 수 있습니다.</li>
  </ul>
</div>`;

const faqs = [
  {"q": "robots.txt 파일은 어디에 위치해야 하나요?", "a": "robots.txt는 반드시 웹사이트의 루트 디렉토리에 위치해야 합니다. 즉, https://example.com/robots.txt 경로로 접근 가능해야 크롤러가 인식합니다."},
  {"q": "robots.txt로 페이지를 차단하면 구글 검색에서 완전히 사라지나요?", "a": "아닙니다. robots.txt로 크롤링을 차단해도 다른 페이지에서 링크가 걸려 있으면 검색 결과에 URL이 노출될 수 있습니다. 완전한 검색 차단이 필요하면 noindex 메타태그를 함께 사용해야 합니다."},
  {"q": "워드프레스에서 robots.txt를 수정하려면 어떻게 하나요?", "a": "워드프레스는 가상 robots.txt를 자동 생성합니다. Yoast SEO나 Rank Math 같은 SEO 플러그인을 설치하면 관리자 화면에서 robots.txt 내용을 직접 편집할 수 있습니다."},
  {"q": "robots.txt에 Sitemap을 꼭 넣어야 하나요?", "a": "필수는 아니지만 강력히 권장됩니다. robots.txt에 Sitemap 디렉티브를 추가하면 크롤러가 사이트맵을 더 빠르게 발견할 수 있습니다."},
  {"q": "robots.txt 작성 후 적용되기까지 얼마나 걸리나요?", "a": "구글은 robots.txt를 보통 24시간 이내에 다시 가져갑니다. 급하다면 구글 서치콘솔에서 robots.txt 테스터를 통해 실시간 반영 여부를 확인하는 것이 좋습니다."},
  {"q": "Disallow와 noindex의 차이점은 무엇인가요?", "a": "Disallow는 크롤러의 접근 자체를 차단하는 것이고, noindex는 크롤링은 허용하되 검색 결과에 표시하지 말라는 지시입니다."}
];

const postData = {
  slug,
  title: 'robots.txt 작성 방법 완벽 정리 — 실전 예시 코드 포함 가이드',
  excerpt: 'robots.txt 파일의 기본 구조부터 단계별 작성법, 상황별 예시 코드, sitemap 연결, 테스트 방법까지 실무에 바로 적용할 수 있도록 정리했습니다.',
  content,
  category: '테크니컬 SEO',
  status: 'draft',
  tags: ['robots.txt 작성법', 'robots.txt 예시', '크롤링 차단', 'robots.txt sitemap', 'robots.txt 확인', '테크니컬 SEO'],
  cover_image_url: 'https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/robots-txt-guide/cover.webp',
  published_at: null,
  read_time: '10분',
  author: 'SEO월드',
  faqs,
};

async function main() {
  // 1. slug로 기존 포스트 확인
  const { data: existing, error: selectError } = await supabase
    .from('posts')
    .select('id, slug')
    .eq('slug', slug)
    .maybeSingle();

  if (selectError) {
    console.error('SELECT 에러:', selectError);
    process.exit(1);
  }

  if (existing) {
    console.log(`기존 포스트 발견 (id: ${existing.id}). UPDATE 실행...`);
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', existing.id)
      .select();

    if (error) {
      console.error('UPDATE 에러:', error);
      process.exit(1);
    }
    console.log('UPDATE 완료:', JSON.stringify(data, null, 2));
  } else {
    console.log('기존 포스트 없음. INSERT 실행...');
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select();

    if (error) {
      console.error('INSERT 에러:', error);
      process.exit(1);
    }
    console.log('INSERT 완료:', JSON.stringify(data, null, 2));
  }

  // 2. Sitemap ping
  try {
    const res = await fetch('https://www.google.com/ping?sitemap=https://seoworld.co.kr/sitemap.xml');
    console.log(`Sitemap ping: ${res.status} ${res.statusText}`);
  } catch (e) {
    console.warn('Sitemap ping 실패 (네트워크 오류):', e.message);
  }

  // 3. 글자 수 계산 (HTML 태그 제외)
  const textOnly = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  console.log(`\n본문 글자 수 (태그 제외): ${textOnly.length}자`);
}

main();
