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

const slug = 'why-my-site-not-showing-on-google';

const content = `<div class="blog-box blog-box-summary">
  <h4>핵심 요약</h4>
  <ul>
    <li>구글 검색에 사이트가 안 나오는 가장 흔한 원인은 색인(인덱싱) 자체가 안 된 경우입니다.</li>
    <li>구글 서치콘솔의 URL 검사 도구로 30초 만에 색인 상태를 확인할 수 있습니다.</li>
    <li>robots.txt 차단, noindex 태그, sitemap 누락 등 7가지 원인 중 대부분은 직접 고칠 수 있는 기술적 문제입니다.</li>
  </ul>
</div>

<h2 id="is-it-normal">구글에 내 사이트가 안 나오는 건 정상일 수 있다</h2>

<p>사이트 만들고 구글에 검색했는데 아무것도 안 나옵니다. 당황스럽죠. 근데 솔직히 말하면, 사이트를 올린 지 며칠밖에 안 됐다면 이건 꽤 정상적인 상황입니다.</p>

<p>구글은 전 세계 수십억 개의 웹페이지를 크롤링하고 있고, 새로 생긴 사이트를 발견하고 색인하는 데는 시간이 걸립니다. <a href="https://developers.google.com/search/docs/fundamentals/get-on-google" class="blog-external-link" target="_blank" rel="noopener noreferrer">Google 검색 센터</a>에서도 공식적으로 새 사이트는 크롤링까지 수 주가 소요될 수 있다고 안내하고 있습니다.</p>

<div class="blog-stats-grid">
  <div>
    <div class="blog-stat-number">96.55%</div>
    <div class="blog-stat-label">구글 트래픽이 0인 콘텐츠 비율</div>
  </div>
  <div>
    <div class="blog-stat-number">수 주</div>
    <div class="blog-stat-label">새 사이트 크롤링 소요 시간</div>
  </div>
</div>

<p><a href="https://ahrefs.com/blog/search-traffic-study/" class="blog-external-link" target="_blank" rel="noopener noreferrer">Ahrefs 검색 트래픽 연구</a>에 따르면 전체 콘텐츠의 96.55%가 구글에서 트래픽을 전혀 받지 못하고 있습니다. 색인 자체가 안 된 경우도 상당수 포함되어 있죠. 그러니 "내 사이트만 안 되는 건가?" 하고 너무 걱정하지 않아도 됩니다. 다만, 2주 이상 지났는데도 검색에 전혀 안 나온다면 기술적인 문제를 의심해봐야 합니다.</p>

<h2 id="check-index-status">구글 서치콘솔에서 색인 상태 확인하는 법</h2>

<p>구글 검색 노출 안됨 문제를 해결하려면, 가장 먼저 해야 할 일이 있습니다. 구글 서치콘솔에서 내 사이트의 색인 상태를 직접 확인하는 겁니다. 저희가 컨설팅하면서 보면, 이 첫 단계를 건너뛰고 "SEO가 문제인가?"부터 고민하는 분이 정말 많습니다.</p>

<h3>1단계: 서치콘솔에 사이트 등록</h3>

<p><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google 서치콘솔</a>에 접속해서 사이트를 등록합니다. 도메인 방식과 URL 접두어 방식이 있는데, 처음이라면 URL 접두어 방식이 더 간단합니다. HTML 파일 업로드나 메타태그 삽입으로 소유권을 인증하면 됩니다.</p>

<h3>2단계: URL 검사 도구로 색인 여부 확인</h3>

<p>등록이 끝나면 상단 검색창에 확인하고 싶은 페이지 URL을 입력합니다. "URL이 Google에 등록되어 있습니다"라고 나오면 색인이 된 상태입니다. "URL이 Google에 등록되어 있지 않습니다"가 나오면 구글이 아직 해당 페이지를 모르고 있다는 뜻입니다.</p>

<h3>3단계: 색인 생성 요청 보내기</h3>

<p>색인이 안 된 페이지라면 같은 화면에서 "색인 생성 요청" 버튼을 누릅니다. 이걸 누른다고 바로 검색에 나오는 건 아니지만, 구글에 "이 페이지 좀 봐달라"고 신호를 보내는 겁니다. 보통 며칠 내에 크롤링이 이루어집니다.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-not-showing/section-1.webp" alt="구글 서치콘솔 색인 상태 확인 과정 일러스트" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto">
  <figcaption>구글 서치콘솔 색인 상태 확인 과정</figcaption>
</figure>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 서치콘솔 색인 요청은 하루에 보낼 수 있는 횟수가 제한되어 있습니다. 중요한 페이지 위주로 요청하고, 나머지는 sitemap 제출로 해결하는 게 효율적입니다. 자세한 활용법은 <a href="/blog/google-search-console-guide">구글 서치콘솔 사용법 완벽 가이드</a>를 참고하세요.</p>
</div>

<div class="blog-inline-cta">
  <p>내 사이트에 기술적 SEO 문제가 있는지 빠르게 확인하고 싶다면?</p>
  <a href="/tools/onpage-audit" class="blog-cta-button">온페이지 SEO 분석 도구로 진단하기 →</a>
</div>

<h2 id="seven-reasons">구글 검색에 안 나오는 7가지 실제 원인</h2>

<p>서치콘솔에서 색인이 안 된 걸 확인했다면, 이제 원인을 찾아야 합니다. 저희가 실제로 사이트를 분석해보면 대부분 아래 7가지 중 하나에 해당합니다.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-not-showing/section-2.webp" alt="구글 검색에 안 나오는 7가지 원인 아이콘" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto">
  <figcaption>구글 검색에 안 나오는 7가지 주요 원인</figcaption>
</figure>

<h3>1. robots.txt가 크롤링을 차단하고 있다</h3>

<p>가장 흔한 원인입니다. robots.txt 파일에 <code>Disallow: /</code>가 들어가 있으면 구글 크롤러가 사이트 전체에 접근하지 못합니다. 개발 단계에서 검색엔진 차단을 걸어놓고 배포할 때 해제를 깜빡하는 경우가 많습니다. <code>사이트주소/robots.txt</code>로 직접 확인해보세요.</p>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> WordPress나 일부 CMS는 설정 메뉴에 "검색엔진 노출 차단" 옵션이 있습니다. 이 옵션이 켜져 있으면 자동으로 robots.txt에 Disallow가 추가됩니다. 설정을 꼭 확인하세요.</p>
</div>

<h3>2. noindex 태그가 페이지에 걸려 있다</h3>

<p>페이지 소스코드에 <code>&lt;meta name="robots" content="noindex"&gt;</code>가 있으면 구글이 해당 페이지를 색인하지 않습니다. robots.txt와 다른 점은, 크롤링은 하지만 검색 결과에 표시하지 않는다는 겁니다. <a href="/tools/meta-generator">메타태그 분석기</a>로 확인하면 noindex 여부를 바로 알 수 있습니다.</p>

<h3>3. sitemap.xml이 없거나 잘못 설정됐다</h3>

<p>sitemap.xml은 구글에게 "우리 사이트에 이런 페이지들이 있어요"라고 알려주는 지도 같은 겁니다. 이 파일이 아예 없거나, 있어도 깨진 URL이 포함되어 있으면 구글 크롤링이 비효율적으로 이루어집니다. 사이트맵이 없다면 <a href="/tools/sitemap-generator">사이트맵 생성기</a>로 만들어서 서치콘솔에 제출하세요.</p>

<h3>4. canonical 태그가 다른 URL을 가리킨다</h3>

<p>canonical 태그는 "이 페이지의 원본 URL은 여기입니다"라고 구글에 알려주는 역할을 합니다. 이 태그가 잘못 설정되어 다른 URL을 가리키고 있으면, 구글은 현재 페이지 대신 canonical이 가리키는 URL만 색인합니다.</p>

<h3>5. 사이트가 너무 새롭거나 페이지 수가 적다</h3>

<p>앞에서 말씀드린 것처럼, 신규 사이트는 시간이 필요합니다. 여기에 페이지 수가 5개 미만이면 구글이 크롤링 우선순위를 낮게 잡을 수 있습니다. 꾸준히 양질의 콘텐츠를 추가하는 게 가장 현실적인 해결법입니다.</p>

<h3>6. 서버 오류(5xx)나 리다이렉트 루프가 있다</h3>

<p>구글 크롤러가 사이트에 접속했을 때 500 에러가 나거나, 리다이렉트가 무한 루프를 도는 경우 크롤링이 실패합니다. 서치콘솔의 "페이지" 보고서에서 크롤링 오류를 확인할 수 있습니다.</p>

<h3>7. 수동 조치(패널티)를 받았다</h3>

<p>구글의 웹마스터 가이드라인을 위반하면 수동 조치를 받을 수 있습니다. 스팸성 링크 구축이나 숨긴 텍스트 같은 블랙햇 SEO가 원인인 경우가 많습니다. 서치콘솔 → 보안 및 수동 조치에서 확인할 수 있고, 이건 솔직히 복구가 좀 까다롭습니다.</p>

<details>
  <summary>수동 조치를 받았을 때 복구 절차</summary>
  <div>
    <p>서치콘솔에서 수동 조치 유형을 확인한 뒤, 문제가 되는 부분을 모두 수정합니다. 그 다음 "재검토 요청"을 보내면 구글이 다시 검토합니다. 재검토까지 2~4주 정도 걸릴 수 있고, 한 번에 통과 못하면 다시 수정 후 재요청해야 합니다.</p>
  </div>
</details>

<h2 id="how-to-fix">원인을 찾았으면 이렇게 해결하세요</h2>

<p>위에서 원인을 파악했다면, 해결 순서는 생각보다 단순합니다. 저희 팀 내부에서도 사이트 구글 등록 안됨 문제를 진단할 때 아래 순서대로 처리합니다.</p>

<ul class="blog-checklist">
  <li>robots.txt에서 Disallow 제거 또는 수정 → <a href="/tools/robots-generator">Robots.txt 생성기</a>로 올바른 파일 생성</li>
  <li>noindex 태그 제거 (HTML head 또는 HTTP 헤더 확인)</li>
  <li>sitemap.xml 생성 후 서치콘솔에 제출</li>
  <li>canonical 태그가 자기 자신을 가리키는지 확인</li>
  <li>서버 응답코드 200 정상인지 확인</li>
  <li>서치콘솔에서 URL 색인 요청 다시 보내기</li>
  <li>2~3일 뒤 서치콘솔에서 색인 여부 재확인</li>
</ul>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 여러 문제가 동시에 있는 경우도 많습니다. robots.txt를 고쳤는데 noindex도 걸려 있다든지요. 한 가지만 고치고 안심하지 말고, <a href="/blog/onpage-seo-optimization-guide">온페이지 SEO 최적화 가이드</a>를 참고해서 전체적으로 점검하는 걸 권장합니다.</p>
</div>

<h2 id="common-mistakes">초보자가 자주 하는 실수 3가지</h2>

<p>저희가 실제로 컨설팅하면서 가장 많이 보는 실수들을 정리했습니다.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>실수</th><th>왜 문제인지</th><th>올바른 방법</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>색인 요청만 반복</td>
      <td>근본 원인(robots.txt, noindex 등)을 안 고치면 아무리 요청해도 소용없음</td>
      <td>원인 먼저 해결 → 그 다음 색인 요청</td>
    </tr>
    <tr>
      <td>구글에 직접 URL 제출 시도</td>
      <td>2018년에 URL 제출 도구는 폐지됨. 서치콘솔만 유효</td>
      <td>구글 서치콘솔 색인 요청 기능 사용</td>
    </tr>
    <tr>
      <td>하루 만에 결과를 기대</td>
      <td>구글 색인은 최소 며칠~수 주 소요</td>
      <td>색인 요청 후 최소 3~5일 대기</td>
    </tr>
  </tbody>
</table>

<div class="blog-box blog-box-info">
  <p><strong>참고</strong> <a href="https://www.searchenginejournal.com/definitive-list-reasons-google-isnt-indexing-site/118245/" class="blog-external-link" target="_blank" rel="noopener noreferrer">SEJ — 구글 색인 안 되는 이유</a> 글에서도 기술적 문제를 먼저 해결하는 것이 가장 중요하다고 강조하고 있습니다.</p>
</div>

<h2 id="self-diagnosis-checklist">구글 검색 노출 셀프 진단 체크리스트</h2>

<p>지금 바로 아래 항목을 하나씩 확인해보세요. 구글 색인 안되는 이유를 스스로 진단할 수 있는 체크리스트입니다.</p>

<table>
  <thead>
    <tr><th>점검 항목</th><th>확인 방법</th><th>정상 상태</th></tr>
  </thead>
  <tbody>
    <tr><td>서치콘솔 등록</td><td>search.google.com/search-console 접속</td><td>사이트 소유권 인증 완료</td></tr>
    <tr><td>robots.txt</td><td>사이트주소/robots.txt 직접 접속</td><td>Disallow: / 없음</td></tr>
    <tr><td>noindex 태그</td><td>페이지 소스 보기 → "noindex" 검색</td><td>noindex 태그 없음</td></tr>
    <tr><td>sitemap.xml</td><td>사이트주소/sitemap.xml 접속</td><td>유효한 XML 파일 표시</td></tr>
    <tr><td>canonical 태그</td><td>페이지 소스 → rel="canonical" 확인</td><td>자기 자신 URL을 가리킴</td></tr>
    <tr><td>서버 응답</td><td>브라우저 개발자 도구 → Network 탭</td><td>200 OK</td></tr>
    <tr><td>수동 조치</td><td>서치콘솔 → 보안 및 수동 조치</td><td>문제 없음</td></tr>
  </tbody>
</table>

<div class="blog-inline-cta">
  <p>체크리스트를 하나하나 수동으로 확인하기 번거롭다면, 자동으로 한 번에 진단해보세요.</p>
  <a href="/tools/onpage-audit" class="blog-cta-button">SEO 자동 진단 도구 사용하기 →</a>
</div>

<h2 id="take-action">지금 바로 확인해보세요</h2>

<p>내 사이트 구글 검색 안되는 이유, 대부분은 생각보다 단순한 기술적 문제입니다. robots.txt 한 줄, noindex 태그 하나가 사이트 전체의 검색 노출을 막고 있는 경우를 정말 많이 봤습니다.</p>

<p>지금 당장 구글 서치콘솔에 접속해서 URL 검사부터 해보세요. 색인이 안 되어 있다면 위의 7가지 원인을 하나씩 점검하면 됩니다. 대부분 30분이면 원인을 찾고, 직접 고칠 수 있습니다.</p>

<p>색인 문제를 해결한 뒤에도 구글 순위가 안 오른다면, 그때는 콘텐츠 품질과 백링크 같은 다음 단계를 고민할 차례입니다.</p>

<div class="blog-summary-card">
  <h4>이 글 핵심 정리</h4>
  <ul>
    <li>구글 서치콘솔 URL 검사로 색인 상태를 먼저 확인한다</li>
    <li>robots.txt, noindex, sitemap 순서로 기술적 원인을 점검한다</li>
    <li>원인 해결 후 색인 요청을 보내고, 최소 3~5일 기다린다</li>
  </ul>
</div>`;

const faqs = [
  {"q": "구글 검색에 내 사이트가 나오려면 얼마나 걸리나요?", "a": "새 사이트의 경우 구글이 크롤링하고 색인하는 데 보통 며칠에서 수 주가 걸립니다. 구글 서치콘솔에서 색인 요청을 보내면 이 과정을 앞당길 수 있지만, 즉시 반영되지는 않습니다."},
  {"q": "구글 서치콘솔 색인 요청은 하루에 몇 번까지 가능한가요?", "a": "구글은 정확한 횟수를 공개하지 않지만, 일반적으로 하루 10~12개 URL 정도로 제한되어 있는 것으로 알려져 있습니다. 중요한 페이지 위주로 요청하고, 나머지는 sitemap 제출로 대체하는 것이 효율적입니다."},
  {"q": "robots.txt에서 Disallow를 제거하면 바로 검색에 나오나요?", "a": "robots.txt를 수정한다고 즉시 검색에 나오지는 않습니다. 구글이 변경된 robots.txt를 다시 크롤링해야 하며, 그 후 차단 해제된 페이지들을 새로 색인하는 데 추가 시간이 필요합니다."},
  {"q": "noindex와 robots.txt Disallow의 차이가 뭔가요?", "a": "robots.txt Disallow는 구글 크롤러가 페이지에 아예 접근하지 못하게 차단합니다. noindex는 크롤러가 페이지에 접근은 하지만 검색 결과에 표시하지 않도록 지시합니다."},
  {"q": "구글에 사이트를 등록하려면 비용이 드나요?", "a": "구글 서치콘솔은 완전히 무료입니다. 사이트 등록, 색인 요청, 검색 성과 확인 등 모든 기능을 무료로 사용할 수 있습니다."},
  {"q": "사이트맵을 제출했는데도 색인이 안 되면 어떻게 하나요?", "a": "사이트맵 제출은 구글에 페이지 목록을 알려주는 것일 뿐, 색인을 보장하지는 않습니다. 사이트맵 제출 후에도 색인이 안 된다면 robots.txt 차단, noindex 태그, 서버 오류 등 다른 원인을 점검해야 합니다."}
];

const postData = {
  slug,
  title: '내 사이트 구글 검색 안되는 이유 — 원인 7가지와 해결법 총정리',
  excerpt: '구글 검색에 내 사이트가 나오지 않는 가장 흔한 7가지 원인과 서치콘솔을 활용한 단계별 해결법을 정리했습니다.',
  content,
  category: '테크니컬 SEO',
  status: 'draft',
  tags: ['구글 검색 안됨', '구글 색인 안되는 이유', '구글 서치콘솔 색인 요청', '구글 크롤링 안되는 이유', '사이트 구글 등록', '구글 검색 노출'],
  cover_image_url: 'https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/google-search-not-showing/cover.webp',
  published_at: null,
  read_time: '10분',
  author: 'SEO월드',
  faqs,
};

async function main() {
  // 1. 같은 slug가 있는지 확인
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
      .select()
      .single();

    if (error) {
      console.error('UPDATE 에러:', error);
      process.exit(1);
    }
    console.log('UPDATE 완료:', data.id, data.slug, data.status);
  } else {
    console.log('기존 포스트 없음. INSERT 실행...');
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('INSERT 에러:', error);
      process.exit(1);
    }
    console.log('INSERT 완료:', data.id, data.slug, data.status);
  }

  // Sitemap ping
  try {
    const res = await fetch('https://www.google.com/ping?sitemap=https://seoworld.co.kr/sitemap.xml');
    console.log('Sitemap ping:', res.status, res.statusText);
  } catch (e) {
    console.log('Sitemap ping 실패 (무시 가능):', e.message);
  }
}

main();
