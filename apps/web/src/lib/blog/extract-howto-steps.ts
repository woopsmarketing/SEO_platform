/**
 * HTML 본문에서 단계형 H2/H3를 추출해 HowTo schema의 step 배열로 변환.
 * - H2/H3 텍스트에 "1단계", "Step", "1.", "첫 번째" 등 단계 키워드가 있어야 함
 * - 다음 형제 단락의 텍스트를 step.text로 사용 (없으면 H2 텍스트만)
 */

const STEP_PATTERNS = [
  /^\s*(\d+\s*[단][계계])/, // 1단계 / 2 단계
  /^\s*(?:Step|step|STEP)\s*\d/, // Step 1 / step 2
  /^\s*\d+\s*[\.:]\s*/, // 1. xxx / 2: xxx
  /^\s*(?:첫|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\s*번[째째]/, // 첫 번째
  /^\s*(?:첫째|둘째|셋째|넷째|다섯째)/, // 첫째
];

function isStepHeading(text: string): boolean {
  return STEP_PATTERNS.some((re) => re.test(text));
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface HowToStep {
  name: string;
  text: string;
}

export function extractHowToSteps(html: string): HowToStep[] {
  if (!html) return [];

  const headingRe = /<(h[23])[^>]*>([\s\S]*?)<\/\1>/gi;
  const headings: { name: string; index: number }[] = [];
  let m;
  while ((m = headingRe.exec(html)) !== null) {
    const text = stripTags(m[2]);
    if (text && isStepHeading(text)) {
      headings.push({ name: text, index: m.index + m[0].length });
    }
  }

  if (headings.length < 3) return [];

  const steps: HowToStep[] = [];
  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index : html.length;
    const between = html.slice(start, end);
    const para = between.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const paragraphText = para ? stripTags(para[1]) : "";
    steps.push({
      name: headings[i].name,
      text: paragraphText.length > 20 ? paragraphText : headings[i].name,
    });
  }

  return steps;
}
