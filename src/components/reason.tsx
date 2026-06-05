/*
  Reason — 추천 근거 문구(`<strong>` 강조 포함 HTML) 렌더.
  ⚠️ 현재 reason은 정적 신뢰 데이터(우리 카탈로그). 이후 추천 엔진/LLM이 생성하게 되면
  반드시 sanitize 후 렌더해야 한다(XSS — docs/SECURITY.md 입력 검증).
*/

export function Reason({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
