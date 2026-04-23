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

const slug = 'google-search-console-guide';

const content = `<div class="blog-box blog-box-summary">
  <h4>핵심 요약</h4>
  <ul>
    <li>구글 서치콘솔은 무료 도구로, 사이트의 검색 노출 현황과 기술적 문제를 한눈에 파악할 수 있습니다.</li>
    <li>소유권 확인 후 사이트맵 제출과 색인 요청을 완료하면 구글 검색에 더 빠르게 반영됩니다.</li>
    <li>검색 실적 보고서의 노출수, 클릭수, CTR, 평균 게재순위 4가지 지표를 정기적으로 분석하면 SEO 성과를 체계적으로 개선할 수 있습니다.</li>
  </ul>
</div>

<h2 id="what-is-google-search-console">구글 서치콘솔이란 무엇인가</h2>

<p>구글 서치콘솔 사용법을 알기 전에, 이 도구가 정확히 어떤 역할을 하는지 이해해야 합니다. 구글 서치콘솔(Google Search Console)은 구글이 무료로 제공하는 웹마스터 도구로, 여러분의 사이트가 구글 검색에서 어떻게 표시되고 있는지 모니터링할 수 있는 공식 플랫폼입니다.</p>

<p>과거 '구글 웹마스터 도구'라는 이름으로 알려졌으며, 2015년 서치콘솔로 명칭이 변경되었습니다. 사이트 소유자라면 누구나 무료로 사용할 수 있고, 검색 실적 데이터부터 크롤링 오류, 색인 상태까지 SEO에 필요한 핵심 정보를 제공합니다.</p>

<div class="blog-box blog-box-info">
  <p><strong>참고</strong> 서치콘솔은 구글 검색에 한정된 도구입니다. 네이버나 빙 등 다른 검색엔진의 데이터는 포함되지 않으며, 구글 검색 결과에서의 성과만 추적합니다.</p>
</div>

<div class="blog-stats-grid">
  <div>
    <div class="blog-stat-number">노출수</div>
    <div class="blog-stat-label">검색 결과에 사이트가 표시된 횟수</div>
  </div>
  <div>
    <div class="blog-stat-number">클릭수</div>
    <div class="blog-stat-label">검색 결과에서 실제로 클릭된 횟수</div>
  </div>
  <div>
    <div class="blog-stat-number">CTR</div>
    <div class="blog-stat-label">노출 대비 클릭 비율 (클릭률)</div>
  </div>
  <div>
    <div class="blog-stat-number">평균 게재순위</div>
    <div class="blog-stat-label">검색 결과에서의 평균 위치</div>
  </div>
</div>

<h2 id="why-use-search-console">서치콘솔을 반드시 사용해야 하는 이유</h2>

<p>SEO를 시작하는 많은 분들이 서치콘솔 없이 블로그를 운영합니다. 하지만 검색 실적 데이터 없이 SEO를 하는 것은 계기판 없이 운전하는 것과 같습니다. 어떤 키워드로 유입이 발생하는지, 어떤 페이지에 크롤링 오류가 있는지 전혀 파악할 수 없기 때문입니다.</p>

<p>서치콘솔의 가장 큰 가치는 구글이 여러분의 사이트를 어떻게 인식하고 있는지 직접 확인할 수 있다는 점입니다. 색인이 제대로 되었는지, 모바일 사용성에 문제가 없는지, 구조화 데이터가 올바르게 적용되었는지 등을 점검할 수 있습니다.</p>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> <a href="https://backlinko.com/google-ctr-stats" class="blog-external-link" target="_blank" rel="noopener noreferrer">Backlinko CTR 연구</a>에 따르면, 구글 검색 1위의 평균 CTR은 27.6%이며 1위는 10위 대비 클릭 확률이 10배 높습니다. 서치콘솔의 평균 게재순위와 CTR 데이터를 활용하면 순위 개선의 우선순위를 정확히 파악할 수 있습니다.</p>
</div>

<h2 id="registration-and-verification">구글 서치콘솔 등록 및 소유권 확인 방법</h2>

<p>구글 서치콘솔 등록은 SEO의 첫 단계입니다. 구글 계정만 있으면 5분 안에 완료할 수 있습니다. 아래 단계를 따라 서치콘솔 사이트 등록 방법을 진행하세요.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-console-guide/section-1.webp" alt="구글 서치콘솔 등록 과정 벡터 일러스트" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto" />
  <figcaption>구글 서치콘솔 소유권 확인 방법 — DNS, HTML 파일, 메타태그 등 다양한 인증 방식</figcaption>
</figure>

<h3>1단계: 구글 서치콘솔 접속 및 속성 추가</h3>

<p><a href="https://developers.google.com/search/docs/monitor-debug/search-console-start" class="blog-external-link" target="_blank" rel="noopener noreferrer">Google 검색 센터 — 서치콘솔 시작 가이드</a>에서 안내하는 대로, search.google.com/search-console에 접속하여 구글 계정으로 로그인합니다. 좌측 상단의 속성 선택 드롭다운에서 '속성 추가'를 클릭합니다.</p>

<h3>2단계: 도메인 속성 vs URL 접두어 속성 선택</h3>

<p>속성 추가 시 두 가지 유형 중 하나를 선택해야 합니다. 각각의 차이를 정확히 이해하고 선택하세요.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>항목</th><th>도메인 속성</th><th>URL 접두어 속성</th></tr>
  </thead>
  <tbody>
    <tr><td>범위</td><td>모든 하위 도메인 + 프로토콜 포함</td><td>입력한 URL 경로만 포함</td></tr>
    <tr><td>소유권 확인</td><td>DNS 레코드만 가능</td><td>HTML 파일, 메타태그, GA, GTM 등 다양</td></tr>
    <tr><td>권장 대상</td><td>사이트 전체를 관리하는 경우</td><td>특정 경로만 관리하거나 DNS 접근 불가 시</td></tr>
    <tr><td>설정 난이도</td><td>DNS 설정 필요 (초보자에겐 다소 어려움)</td><td>HTML 파일 업로드로 간단히 완료</td></tr>
  </tbody>
</table>

<h3>3단계: 소유권 확인 방법 선택 및 완료</h3>

<p>서치콘솔 소유권 확인은 해당 사이트가 본인의 것임을 구글에 증명하는 절차입니다. URL 접두어 속성을 선택한 경우 다음 중 하나를 선택할 수 있습니다.</p>

<ol>
  <li><strong>HTML 파일 업로드</strong> — 구글이 제공하는 HTML 파일을 사이트 루트에 업로드 (가장 권장)</li>
  <li><strong>HTML 메타태그</strong> — 사이트 &lt;head&gt;에 확인용 메타태그 삽입</li>
  <li><strong>Google Analytics</strong> — GA 추적 코드가 이미 설치된 경우 자동 확인</li>
  <li><strong>Google Tag Manager</strong> — GTM 컨테이너가 설치된 경우 자동 확인</li>
  <li><strong>DNS 레코드</strong> — 도메인 DNS에 TXT 레코드 추가 (도메인 속성 시 유일한 방법)</li>
</ol>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 워드프레스 사용자라면 Yoast SEO나 Rank Math 플러그인의 웹마스터 도구 설정에서 메타태그를 붙여넣기만 하면 소유권 확인이 완료됩니다.</p>
</div>

<h2 id="submit-sitemap">사이트맵 제출로 색인 속도 높이기</h2>

<p>소유권 확인을 마쳤다면 가장 먼저 해야 할 일은 구글 서치콘솔 사이트맵 제출입니다. 사이트맵은 여러분의 사이트에 어떤 페이지가 있는지 구글에 알려주는 XML 파일입니다. 사이트맵을 제출하면 구글 크롤러가 사이트 구조를 빠르게 파악하여 색인 생성 속도가 향상됩니다.</p>

<p>서치콘솔 좌측 메뉴에서 '사이트맵'을 선택하고, 사이트맵 URL(일반적으로 <code>/sitemap.xml</code>)을 입력한 뒤 제출 버튼을 누르면 됩니다. 제출 후 상태가 '성공'으로 표시되면 정상적으로 처리된 것입니다.</p>

<div class="blog-box blog-box-info">
  <p><strong>참고</strong> 사이트맵이 없다면 먼저 생성해야 합니다. 워드프레스는 기본 사이트맵(/wp-sitemap.xml)을 제공하며, 직접 만들어야 하는 경우 자동 생성 도구를 활용하세요.</p>
</div>

<div class="blog-inline-cta">
  <p>사이트맵이 아직 없으신가요? SEO월드의 무료 도구로 지금 바로 만들어보세요.</p>
  <a href="/tools/sitemap-generator" class="blog-cta-button">사이트맵 생성기 사용하기 →</a>
</div>

<h2 id="url-inspection-and-indexing">URL 검사와 색인 요청 방법</h2>

<p>새 글을 발행했거나 기존 페이지를 수정했을 때, 구글 서치콘솔 색인 요청 기능을 사용하면 구글이 해당 페이지를 더 빨리 크롤링하도록 요청할 수 있습니다. URL 검사 도구는 서치콘솔에서 가장 자주 사용하게 될 기능 중 하나입니다.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-console-guide/section-2.webp" alt="URL 검사 및 색인 요청 과정 벡터 일러스트" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto" />
  <figcaption>URL 검사 도구를 활용한 색인 요청 워크플로우</figcaption>
</figure>

<h3>1단계: URL 검사 도구로 현재 상태 확인</h3>

<p>서치콘솔 상단 검색창에 확인하고 싶은 URL을 입력합니다. 검사 결과에서 'URL이 Google에 등록되어 있습니다'라고 나오면 이미 색인된 상태입니다. 등록되지 않은 경우 색인 요청을 진행합니다.</p>

<h3>2단계: 색인 생성 요청하기</h3>

<p>URL 검사 결과 화면에서 '색인 생성 요청' 버튼을 클릭합니다. 구글이 해당 URL을 크롤링 대기열에 추가하며, 보통 몇 시간에서 며칠 내에 색인이 완료됩니다.</p>

<h3>3단계: 색인 결과 확인</h3>

<p>요청 후 1~2일 뒤 다시 URL 검사를 실행하여 색인 여부를 확인합니다. 색인이 되지 않는다면 페이지의 robots.txt 차단, noindex 태그, 콘텐츠 품질 문제 등을 점검해야 합니다.</p>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> 색인 요청은 하루에 제출할 수 있는 횟수에 제한이 있습니다. 무분별하게 요청하기보다 실제로 새로 발행하거나 중요하게 수정한 페이지에만 사용하세요. 또한 색인 요청이 반드시 색인을 보장하지는 않습니다.</p>
</div>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 색인이 안 되는 페이지가 있다면 콘텐츠 품질을 먼저 점검하세요. 중복 콘텐츠이거나 내용이 너무 짧은 페이지는 구글이 색인을 거부할 수 있습니다.</p>
</div>

<h2 id="search-performance-analysis">검색 실적 보고서 분석하는 법</h2>

<p>서치콘솔 검색 실적 보는 법을 익히면 SEO 전략의 방향을 데이터 기반으로 결정할 수 있습니다. 좌측 메뉴의 '검색 실적'을 클릭하면 노출수, 클릭수, CTR, 평균 게재순위를 확인할 수 있습니다.</p>

<h3>노출수와 클릭수의 의미</h3>

<p>노출수는 검색 결과에 여러분의 페이지가 표시된 횟수이고, 클릭수는 실제로 사용자가 클릭한 횟수입니다. 노출수는 높은데 클릭수가 낮다면 제목이나 메타 설명을 개선해야 한다는 신호입니다.</p>

<h3>CTR(클릭률)로 제목 품질 판단하기</h3>

<p>CTR은 노출 대비 클릭 비율입니다. 같은 순위라도 CTR이 낮다면 검색 결과에 표시되는 제목과 설명이 매력적이지 않다는 의미입니다. CTR이 낮은 페이지를 찾아 메타태그를 개선하면 순위 변동 없이도 트래픽을 늘릴 수 있습니다.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>지표</th><th>의미</th><th>개선 방법</th></tr>
  </thead>
  <tbody>
    <tr><td>노출수 높고 클릭수 낮음</td><td>제목/설명이 매력적이지 않음</td><td>메타태그 리라이팅</td></tr>
    <tr><td>클릭수 높고 순위 낮음</td><td>콘텐츠 관심도는 높으나 SEO 부족</td><td><a href="/blog/onpage-seo-optimization-guide">온페이지 SEO 최적화</a></td></tr>
    <tr><td>순위 높고 CTR 낮음</td><td>경쟁 결과 대비 매력 부족</td><td>구조화 데이터 적용, 제목 개선</td></tr>
    <tr><td>순위 변동 큼</td><td>콘텐츠 안정성 부족</td><td>콘텐츠 업데이트, 백링크 확보</td></tr>
  </tbody>
</table>

<h3>평균 게재순위 변화 추적</h3>

<p>평균 게재순위는 특정 키워드에서 여러분의 페이지가 검색 결과 몇 번째에 위치하는지 보여줍니다. 7~15위 사이에 있는 키워드는 조금만 개선하면 1페이지에 진입할 수 있어 집중 투자 대상입니다.</p>

<div class="blog-inline-cta">
  <p>CTR이 낮은 페이지의 메타태그를 점검하고 싶으신가요?</p>
  <a href="/tools/meta-generator" class="blog-cta-button">메타태그 분석기로 점검하기 →</a>
</div>

<h2 id="crawl-errors-and-fixes">크롤링 오류 확인 및 해결 방법</h2>

<p>서치콘솔의 '페이지' 보고서(색인 생성 범위)에서는 구글 크롤러가 사이트를 방문하면서 발생한 오류를 확인할 수 있습니다. 서치콘솔 크롤링 오류 확인은 기술적 SEO 관리의 핵심입니다. 오류가 방치되면 해당 페이지는 검색 결과에 노출되지 않습니다.</p>

<ul class="blog-checklist">
  <li>404 오류 — 삭제된 페이지나 잘못된 URL, 301 리다이렉트로 해결</li>
  <li>서버 오류(5xx) — 호스팅 서버 상태 점검 필요</li>
  <li>robots.txt에 의해 차단 — 의도치 않은 차단 규칙 확인</li>
  <li>noindex 태그 감지 — 색인이 필요한 페이지에 noindex가 있는지 확인</li>
  <li>리다이렉트 오류 — 리다이렉트 루프나 체인 점검</li>
  <li>소프트 404 — 페이지가 존재하지만 내용이 없는 경우</li>
</ul>

<p>크롤링 오류를 발견했다면 <a href="/tools/onpage-audit">온페이지 SEO 분석 도구</a>로 해당 페이지를 진단하고, robots.txt 설정이 의심된다면 <a href="/tools/robots-generator">Robots.txt 생성기</a>로 올바른 설정 파일을 만들어보세요.</p>

<details>
  <summary>크롤링 오류 유형별 상세 해결 방법 보기</summary>
  <div>
    <p><strong>404 오류:</strong> 해당 URL로 연결되는 내부링크를 찾아 수정하거나, 301 리다이렉트를 설정하여 관련 페이지로 이동시킵니다.</p>
    <p><strong>robots.txt 차단:</strong> robots.txt 파일에서 Disallow 규칙을 확인합니다. 색인이 필요한 경로가 차단되어 있다면 해당 규칙을 제거하세요.</p>
    <p><strong>noindex 태그:</strong> 페이지 소스의 &lt;head&gt; 영역에서 &lt;meta name="robots" content="noindex"&gt;가 있는지 확인합니다.</p>
  </div>
</details>

<div class="blog-inline-cta">
  <p>사이트의 기술적 SEO 상태를 한번에 점검하고 싶으신가요?</p>
  <a href="/tools/onpage-audit" class="blog-cta-button">온페이지 SEO 분석 시작하기 →</a>
</div>

<h2 id="monthly-checklist">서치콘솔 활용 월간 점검 루틴</h2>

<p>구글 서치콘솔 사용법을 익혔다면, 정기적으로 점검하는 습관이 중요합니다. 월 1회 아래 체크리스트를 따라 점검하면 사이트의 SEO 건강 상태를 꾸준히 유지할 수 있습니다.</p>

<ul class="blog-checklist">
  <li>검색 실적에서 전월 대비 클릭수, 노출수 변화 확인</li>
  <li>CTR이 낮은 상위 10개 페이지 파악 후 메타태그 개선</li>
  <li>평균 게재순위 7~15위 키워드 목록 추출 (1페이지 진입 후보)</li>
  <li>페이지 보고서에서 새로운 크롤링 오류 확인 및 수정</li>
  <li>사이트맵 상태 확인 — 오류 없이 정상 제출 유지</li>
  <li>모바일 사용성 보고서 점검 — 모바일 오류 해결</li>
  <li>Core Web Vitals 보고서에서 '불량' URL 확인 및 개선</li>
</ul>

<div class="blog-summary-card">
  <h4>구글 서치콘솔 활용 핵심 정리</h4>
  <ul>
    <li>등록 후 소유권 확인 → 사이트맵 제출 → 색인 요청 순서로 초기 설정을 완료하세요.</li>
    <li>검색 실적의 4가지 지표(노출수, 클릭수, CTR, 평균 게재순위)를 주기적으로 분석하세요.</li>
    <li>크롤링 오류는 발견 즉시 수정하고, 월간 점검 루틴으로 사이트 건강을 관리하세요.</li>
    <li><a href="/blog/how-to-use-seo-analysis-tools">SEO 분석 도구 활용법</a>을 함께 읽으면 서치콘솔과 다른 도구를 조합한 분석 전략을 세울 수 있습니다.</li>
  </ul>
</div>`;

const faqs = [
  {"q": "구글 서치콘솔은 무료인가요?", "a": "네, 구글 서치콘솔은 완전히 무료입니다. 구글 계정만 있으면 누구나 사이트를 등록하고 검색 실적, 색인 상태, 크롤링 오류 등 모든 기능을 제한 없이 사용할 수 있습니다."},
  {"q": "서치콘솔 등록 후 데이터가 나타나기까지 얼마나 걸리나요?", "a": "서치콘솔에 사이트를 등록하면 보통 2~3일 후부터 검색 실적 데이터가 수집되기 시작합니다. 다만 충분한 양의 데이터가 쌓여 의미 있는 분석이 가능하려면 최소 2~4주 정도 기다리는 것이 좋습니다."},
  {"q": "색인 요청을 하면 바로 구글에 노출되나요?", "a": "색인 요청은 구글에 크롤링을 요청하는 것이지, 즉시 검색 결과 노출을 보장하지는 않습니다. 보통 몇 시간에서 며칠 내에 처리되며, 콘텐츠 품질이나 기술적 문제에 따라 색인이 거부될 수도 있습니다."},
  {"q": "서치콘솔과 구글 애널리틱스의 차이점은 무엇인가요?", "a": "서치콘솔은 구글 검색에서의 노출, 클릭, 순위 등 검색 유입 전 데이터에 집중합니다. 반면 구글 애널리틱스는 사이트 방문 후 사용자의 행동(페이지뷰, 체류 시간, 전환 등)을 분석합니다. 두 도구를 함께 사용하면 유입부터 전환까지 전체 흐름을 파악할 수 있습니다."},
  {"q": "서치콘솔에서 특정 페이지의 검색 키워드를 확인할 수 있나요?", "a": "네, 검색 실적 보고서에서 '페이지' 탭을 클릭한 뒤 특정 URL을 선택하면, 해당 페이지로 유입되는 검색 키워드(쿼리) 목록과 각 키워드의 노출수, 클릭수, CTR, 평균 게재순위를 확인할 수 있습니다."}
];

const postData = {
  slug,
  title: '구글 서치콘솔 사용법 완벽 정리 — 등록부터 검색 실적 분석까지',
  excerpt: '구글 서치콘솔 등록부터 소유권 확인, 사이트맵 제출, 색인 요청, 검색 실적 분석까지 단계별로 정리한 실전 가이드입니다.',
  content,
  category: '테크니컬 SEO',
  status: 'draft',
  tags: ['구글 서치콘솔 사용법', '서치콘솔 등록', '구글 서치콘솔 색인 요청', '서치콘솔 검색 실적', '사이트맵 제출', '서치콘솔 소유권 확인'],
  cover_image_url: 'https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-console-guide/cover.webp',
  published_at: null,
  read_time: '12분',
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
}

main();
