import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// .env.local에서 환경변수 읽기
const envContent = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const slug = 'how-to-find-long-tail-keywords';

const content = `<div class="blog-box blog-box-summary">
  <h4>핵심 요약</h4>
  <ul>
    <li>전체 검색어의 91.8%는 롱테일 키워드이며, 경쟁이 낮아 소규모 사이트가 상위 노출을 노릴 수 있는 현실적 전략입니다.</li>
    <li>구글 자동완성, 연관 검색어, 무료 도구를 조합하면 돈 들이지 않고 전환율 높은 틈새 키워드를 찾을 수 있습니다.</li>
    <li>찾은 키워드는 검색 의도에 맞게 콘텐츠에 배치해야 실제 유입과 전환으로 이어집니다.</li>
  </ul>
</div>

<h2 id="what-is-long-tail-keyword">롱테일 키워드가 뭔데 이렇게 중요한 건가</h2>

<p>"SEO"라는 키워드로 구글 1페이지에 올라가겠다고 도전해본 적 있으시죠? 솔직히 말하면, 개인 블로그나 소규모 사이트가 이런 빅 키워드로 경쟁하는 건 거의 불가능합니다. 여기서 롱테일 키워드가 등장합니다.</p>

<p>롱테일 키워드는 "SEO" 같은 짧은 헤드 키워드와 달리, "블로그 SEO 키워드 찾는 방법"처럼 3~4단어 이상으로 구성된 구체적인 검색어입니다. 검색량은 적지만, 검색하는 사람의 의도가 분명하기 때문에 전환율이 훨씬 높습니다.</p>

<div class="blog-stats-grid">
  <div>
    <div class="blog-stat-number">91.8%</div>
    <div class="blog-stat-label">전체 키워드 중 롱테일 비중</div>
  </div>
  <div>
    <div class="blog-stat-number">92%</div>
    <div class="blog-stat-label">월 검색량 10회 이하 키워드 비율</div>
  </div>
  <div>
    <div class="blog-stat-number">2.5~3배</div>
    <div class="blog-stat-label">헤드 키워드 대비 전환율 차이</div>
  </div>
</div>

<p><a href="https://backlinko.com/google-keyword-study" class="blog-external-link" target="_blank" rel="noopener noreferrer">Backlinko의 3억 600만 키워드 분석 연구</a>에 따르면, 전체 키워드의 91.8%가 롱테일 키워드입니다. 대부분의 검색어가 사실 롱테일이라는 뜻이고, 여기에 기회가 있습니다.</p>

<div class="blog-box blog-box-info">
  <p><strong>참고</strong> 헤드 키워드("SEO", "다이어트")는 검색량은 많지만 경쟁이 치열하고 검색 의도가 모호합니다. 반면 롱테일 키워드("소규모 쇼핑몰 SEO 시작하는 법")는 검색량은 적지만, 검색자가 정확히 무엇을 원하는지 알 수 있어 콘텐츠를 맞춤 제작할 수 있습니다.</p>
</div>

<h2 id="head-vs-longtail">헤드 키워드와 롱테일 키워드, 뭐가 다른가</h2>

<p>실무에서 자주 보는 실수 중 하나가 검색량만 보고 키워드를 고르는 겁니다. 검색량 낮은 키워드를 무시하는 순간, 실제로 전환이 일어나는 트래픽을 놓치게 됩니다. 두 유형의 차이를 한눈에 정리하면 이렇습니다.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>항목</th><th>헤드 키워드</th><th>롱테일 키워드</th></tr>
  </thead>
  <tbody>
    <tr><td>단어 수</td><td>1~2단어</td><td>3단어 이상</td></tr>
    <tr><td>검색량</td><td>높음 (월 수천~수만)</td><td>낮음 (월 10~500)</td></tr>
    <tr><td>키워드 난이도</td><td>매우 높음</td><td>낮음~중간</td></tr>
    <tr><td>검색 의도</td><td>모호함</td><td>구체적·명확함</td></tr>
    <tr><td>전환율</td><td>낮음</td><td>높음 (2.5~3배)</td></tr>
    <tr><td>CPC 경쟁</td><td>높은 클릭 비용</td><td>상대적으로 저렴</td></tr>
    <tr><td>롱테일 키워드 예시</td><td>"키워드 분석"</td><td>"블로그 키워드 찾기 무료 도구"</td></tr>
  </tbody>
</table>

<p>저희가 컨설팅하면서 자주 드리는 조언이 있습니다. 처음부터 검색량 높은 키워드를 노리지 말고, 롱테일 키워드로 작은 성공을 쌓아가세요. 작은 키워드 10개에서 꾸준히 유입이 들어오면, 그게 모여서 헤드 키워드 하나보다 더 큰 트래픽이 됩니다.</p>

<h2 id="how-to-find-longtail-keywords">롱테일 키워드 찾는 5단계 실전 가이드</h2>

<p>자, 그러면 실제로 롱테일 키워드 찾는 법을 단계별로 정리해보겠습니다. 비싼 유료 도구 없이도 충분히 쓸 만한 키워드를 발굴할 수 있습니다.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/how-to-find-long-tail-keywords/section-1.webp" alt="롱테일 키워드를 찾는 5단계 과정을 보여주는 플로우 다이어그램" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto">
  <figcaption>롱테일 키워드 발굴 5단계 워크플로우</figcaption>
</figure>

<h3>1단계: 시드 키워드 정하기</h3>

<p>시드 키워드는 리서치의 출발점이 되는 넓은 주제어입니다. "키워드 분석", "백링크", "SEO"처럼 여러분의 사업이나 블로그 주제와 직접 관련된 단어를 2~3개 뽑으세요.</p>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 시드 키워드를 정할 때 가장 좋은 출발점은 고객 질문입니다. 문의 메일, 댓글, 커뮤니티에서 사람들이 실제로 묻는 말을 그대로 적어보세요. "백링크 어떻게 확인해요?"가 훌륭한 시드 키워드가 됩니다.</p>
</div>

<h3>2단계: 구글 자동완성과 연관 검색어 활용</h3>

<p>구글 검색창에 시드 키워드를 입력하면 자동완성 제안이 뜹니다. 이게 바로 실제 사용자들이 검색하는 롱테일 키워드입니다. 검색 결과 하단의 연관 검색어도 꼭 확인하세요. 이 두 가지만으로도 10~20개 후보 키워드를 확보할 수 있습니다.</p>

<h3>3단계: 무료 키워드 도구로 후보 확장</h3>

<p>자동완성에서 나온 키워드를 무료 도구에 넣으면 더 많은 변형 키워드를 얻을 수 있습니다. SEO월드의 <a href="/tools/keyword-related">관련 키워드 찾기 도구</a>를 쓰면 연관 키워드와 관련 질문형 키워드까지 한번에 확인할 수 있습니다.</p>

<h3>4단계: 검색량과 난이도 확인</h3>

<p>후보 키워드 목록이 20~30개 정도 모이면, 각 키워드의 월 검색량과 키워드 난이도를 확인합니다. <a href="/tools/keyword-research">키워드 조사 도구</a>에 키워드를 입력하면 검색량, CPC, 경쟁도를 바로 확인할 수 있습니다. 초보자라면 월 검색량 50~500 사이, 키워드 난이도가 낮은 것부터 공략하는 게 현실적입니다.</p>

<h3>5단계: 검색 의도에 맞는 키워드 선별</h3>

<p>같은 키워드라도 검색 의도가 다릅니다. "롱테일 키워드"를 검색하는 사람은 개념을 알고 싶은 거고, "롱테일 키워드 찾는 법"을 검색하는 사람은 방법을 원합니다. 키워드를 직접 구글에 검색해서 상위 결과를 보세요. 어떤 유형의 콘텐츠(가이드, 리스트, 비교)가 나오는지 확인하면 검색 의도를 파악할 수 있습니다.</p>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 검색 의도를 빠르게 판별하는 방법: 구글에 키워드를 검색해서 상위 3개 결과의 제목 패턴을 보세요. "~하는 법", "~방법"이 많으면 정보형, 제품 페이지가 많으면 거래형입니다.</p>
</div>

<div class="blog-inline-cta">
  <p>내 사이트에 맞는 롱테일 키워드가 궁금하다면, 무료 키워드 리서치 도구로 지금 바로 확인해보세요.</p>
  <a href="/tools/keyword-research" class="blog-cta-button">무료 키워드 조사 시작하기 →</a>
</div>

<h2 id="free-keyword-tools">추천 무료 롱테일 키워드 도구 비교</h2>

<p>구글 키워드 리서치에 쓸 수 있는 무료 도구가 꽤 있습니다. 저희 팀 내부에서도 여러 도구를 병행해서 사용하는데, 도구마다 장단점이 확실합니다.</p>

<table class="blog-comparison">
  <thead>
    <tr><th>도구</th><th>장점</th><th>단점</th><th>추천 용도</th></tr>
  </thead>
  <tbody>
    <tr><td>구글 자동완성/연관 검색어</td><td>무료, 실시간 반영</td><td>검색량 수치 없음</td><td>초기 아이디어 발굴</td></tr>
    <tr><td>구글 키워드 플래너</td><td>공식 데이터, 검색량 제공</td><td>광고 계정 필요, 범위 넓음</td><td>검색량 확인</td></tr>
    <tr><td>SEO월드 키워드 도구</td><td>한국어 최적화, 관련 키워드 자동 추천</td><td>글로벌 데이터 제한</td><td>한국 시장 SEO 키워드 발굴</td></tr>
    <tr><td>Answer the Public</td><td>질문형 키워드 발견에 강함</td><td>일일 무료 횟수 제한</td><td>FAQ, 블로그 주제 발굴</td></tr>
    <tr><td>Ubersuggest</td><td>난이도/CPC 정보 제공</td><td>하루 3회 검색 제한</td><td>키워드 난이도 비교</td></tr>
  </tbody>
</table>

<p><a href="https://www.semrush.com/blog/how-to-choose-long-tail-keywords/" class="blog-external-link" target="_blank" rel="noopener noreferrer">Semrush의 롱테일 키워드 가이드</a>에 따르면, 4단어 이상 롱테일 키워드 클러스터의 합산 검색량이 월 1,500 이상에 도달할 수 있습니다. 개별 검색량은 작아도, 관련 키워드를 묶어서 공략하면 충분히 의미 있는 트래픽을 확보할 수 있다는 뜻입니다.</p>

<div class="blog-inline-cta">
  <p>지금 바로 여러분의 시드 키워드로 관련 롱테일 키워드를 찾아보세요.</p>
  <a href="/tools/keyword-related" class="blog-cta-button">관련 키워드 찾기 →</a>
</div>

<h2 id="apply-keywords-to-content">찾은 롱테일 키워드를 콘텐츠에 적용하는 법</h2>

<p>키워드를 찾았다고 끝이 아닙니다. 실제로 콘텐츠에 어떻게 녹이느냐가 SEO 성과를 결정합니다. 롱테일 키워드 전략의 핵심은 자연스러움입니다.</p>

<figure class="blog-figure">
  <img src="https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/how-to-find-long-tail-keywords/section-2.webp" alt="롱테일 키워드를 콘텐츠 각 영역에 배치하는 방법을 보여주는 다이어그램" width="800" height="450" loading="lazy" decoding="async" style="max-width:100%;height:auto">
  <figcaption>키워드를 콘텐츠에 자연스럽게 적용하는 구조</figcaption>
</figure>

<h3>제목과 H2에 키워드 배치하기</h3>

<p>메인 키워드는 글 제목(H1)과 첫 번째 H2에 포함하세요. 서브 키워드는 나머지 H2 제목에 분산 배치하면 됩니다. 단, 제목이 부자연스러워질 정도로 억지로 넣지 마세요. 검색 의도에 맞는 자연스러운 제목이 클릭률도 높습니다. <a href="/blog/where-to-put-keywords-in-blog">블로그 키워드 배치 가이드</a>에서 더 구체적인 위치별 전략을 확인할 수 있습니다.</p>

<h3>본문에 자연스럽게 녹이는 방법</h3>

<p>키워드를 본문에 넣을 때는 독자가 읽었을 때 어색하지 않은지가 기준입니다. 첫 문단에 메인 키워드 1회, 본문 전체에서 5~8회 정도면 충분합니다. 같은 키워드를 반복하기보다 유사어나 변형을 활용하세요.</p>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> 키워드 스터핑은 구글이 가장 싫어하는 패턴입니다. 같은 키워드를 10회 이상 억지로 반복하면 오히려 순위가 떨어집니다. <a href="https://developers.google.com/search/docs/fundamentals/seo-starter-guide" class="blog-external-link" target="_blank" rel="noopener noreferrer">Google 검색 엔진 최적화 기본 가이드</a>에서도 자연스러운 키워드 사용을 강조하고 있습니다.</p>
</div>

<div class="blog-box blog-box-tip">
  <p><strong>TIP</strong> 키워드 밀도는 1~2%가 적당합니다. 1,000자 글이면 키워드가 10~20회 등장하는 수준이죠. <a href="/tools/keyword-density">사이트 키워드 분석기</a>로 현재 밀도를 확인해보세요.</p>
</div>

<h2 id="common-mistakes">초보자가 자주 하는 롱테일 키워드 실수 3가지</h2>

<p>저희가 블로그 SEO 컨설팅을 하면서 가장 자주 보는 실수를 정리했습니다.</p>

<p><strong>1. 검색량만 보고 키워드를 고르는 것</strong><br>검색량이 높아야 좋다는 생각은 반은 맞고 반은 틀립니다. 키워드 난이도가 높으면 검색량이 많아도 상위 노출이 어렵습니다. 검색량보다 "내 사이트 수준에서 이길 수 있는 키워드인가"를 먼저 따져야 합니다.</p>

<p><strong>2. 검색량 0인 키워드를 무시하는 것</strong><br>도구에서 검색량이 0으로 나와도 실제 검색이 없는 건 아닙니다. 도구가 추적하지 못하는 신규 검색어이거나, 아직 경쟁자가 없는 블루오션일 수 있습니다.</p>

<div class="blog-box blog-box-warning">
  <p><strong>주의</strong> 검색량 0이라고 바로 버리지 마세요. 해당 키워드를 직접 구글에 검색해서 결과가 나오는지, 관련 콘텐츠가 있는지 확인하세요. 경쟁 콘텐츠가 거의 없으면 오히려 빠르게 1위를 차지할 수 있는 기회입니다.</p>
</div>

<p><strong>3. 키워드를 찾고 나서 검색 의도를 무시하는 것</strong><br>좋은 롱테일 키워드를 찾았는데, 검색 의도와 맞지 않는 콘텐츠를 만들면 소용없습니다. "OO 가격"을 검색하는 사람에게 "OO란 무엇인가" 글을 보여주면 바로 이탈합니다. <a href="/blog/onpage-seo-optimization-guide">온페이지 SEO 최적화 가이드</a>에서 검색 의도와 콘텐츠 매칭에 대해 더 자세히 다루고 있습니다.</p>

<h2 id="keyword-research-checklist">롱테일 키워드 리서치 체크리스트</h2>

<p>여기까지 읽었다면, 이제 직접 실행할 차례입니다. 아래 체크리스트를 하나씩 따라가면 롱테일 키워드 찾는 법을 체계적으로 실행할 수 있습니다.</p>

<ul class="blog-checklist">
  <li>사업/블로그 주제에서 시드 키워드 3~5개 선정</li>
  <li>구글 자동완성 + 연관 검색어로 후보 20개 수집</li>
  <li>무료 키워드 도구로 변형 키워드 추가 확장</li>
  <li>각 키워드의 월 검색량과 난이도 확인</li>
  <li>검색 의도 파악 (정보형/거래형/탐색형)</li>
  <li>난이도 낮고 의도 명확한 키워드 5~10개 최종 선별</li>
  <li>선별한 키워드를 콘텐츠에 자연스럽게 배치</li>
  <li>발행 후 서치콘솔에서 순위 추적 및 개선</li>
</ul>

<p>롱테일 키워드 전략은 한 번에 끝나는 게 아니라 꾸준히 반복하는 과정입니다. 한 달에 한 번 정도 새로운 키워드를 발굴하고, 기존 콘텐츠를 업데이트하는 루틴을 만들어보세요. <a href="/blog/how-to-use-seo-analysis-tools">SEO 분석 도구 활용법</a>도 함께 참고하면 더 효과적입니다.</p>

<div class="blog-inline-cta">
  <p>지금 여러분의 사이트가 키워드를 제대로 활용하고 있는지 궁금하다면, 무료 온페이지 SEO 분석으로 바로 점검해보세요.</p>
  <a href="/tools/onpage-audit" class="blog-cta-button">온페이지 SEO 무료 분석 →</a>
</div>`;

const faqs = [
  { q: '롱테일 키워드는 몇 단어 이상이어야 하나요?', a: '보통 3단어 이상이면 롱테일 키워드로 분류합니다. 하지만 단어 수보다 중요한 건 검색 의도의 구체성입니다. 2단어라도 검색량이 낮고 의도가 명확하면 롱테일로 볼 수 있습니다.' },
  { q: '검색량이 0인 롱테일 키워드도 노릴 가치가 있나요?', a: '충분히 있습니다. 키워드 도구가 추적하지 못하는 신규 검색어이거나 아직 경쟁자가 없는 키워드일 수 있습니다. 직접 구글에 검색해서 관련 결과가 나온다면, 선점 효과를 노릴 수 있는 기회입니다.' },
  { q: '롱테일 키워드를 한 페이지에 여러 개 넣어도 되나요?', a: '메인 롱테일 키워드 1개를 중심으로 하고, 관련성 높은 서브 키워드 2~3개를 자연스럽게 포함하는 것이 좋습니다. 서로 검색 의도가 다른 키워드를 한 페이지에 억지로 넣으면 오히려 SEO 효과가 떨어집니다.' },
  { q: '블로그 초보자에게 롱테일 키워드가 유리한 이유는?', a: '롱테일 키워드는 경쟁이 낮아서 도메인 권위가 낮은 신규 사이트도 상위 노출 가능성이 높습니다. 작은 키워드에서 꾸준히 트래픽을 쌓으면 사이트 전체의 신뢰도도 함께 올라갑니다.' },
  { q: '롱테일 키워드의 전환율이 더 높은 이유는 무엇인가요?', a: '롱테일 키워드를 검색하는 사람은 이미 구체적인 목적을 가지고 있기 때문입니다. 예를 들어 \'운동화\'보다 \'러닝화 발볼 넓은 추천\'을 검색하는 사람이 구매에 훨씬 가깝습니다. 검색 의도가 명확할수록 전환으로 이어질 확률이 높아집니다.' },
];

const postData = {
  slug,
  title: '롱테일 키워드 찾는 법 — 초보자를 위한 5단계 실전 가이드',
  excerpt: '검색량은 적지만 전환율이 높은 롱테일 키워드를 무료 도구만으로 찾는 5단계 실전 방법을 초보자 눈높이에서 안내합니다.',
  content,
  category: '키워드 분석',
  status: 'draft',
  tags: ['롱테일 키워드', '키워드 찾는 방법', '롱테일 키워드 전략', '구글 키워드 리서치', '틈새 키워드 찾기', '블로그 키워드 찾기'],
  cover_image_url: 'https://xogsufreiixvppnvxqxx.supabase.co/storage/v1/object/public/blog-images/how-to-find-long-tail-keywords/cover.webp',
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
    console.log(`Sitemap ping: ${res.status}`);
  } catch (e) {
    console.warn('Sitemap ping 실패 (무시 가능):', e.message);
  }
}

main();
