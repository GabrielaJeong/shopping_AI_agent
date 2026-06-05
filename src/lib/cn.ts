/** 조건부 className 합성 — truthy 값만 공백으로 join. (외부 의존성 없는 최소 구현) */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
