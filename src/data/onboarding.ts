/*
  온보딩 5단계 정의 (PRD F1 / README §4). 한국어 카피 보존.
  옵션 id가 곧 취향 벡터의 태그(예산 제외) — buildTasteProfile이 이를 가중치로 변환.
  순서 고정: 무드 → 예산 → 카테고리 → 컬러 → 라이프스타일.
*/

export type StepKey = "mood" | "budget" | "category" | "color" | "lifestyle";
export type StepKind = "image" | "chip" | "color";

export interface StepOption {
  /** 취향 벡터 태그로 쓰임(예산은 제약이라 제외). */
  id: string;
  label: string;
  /** color kind일 때 스와치 배경(CSS). */
  swatch?: string;
}

export interface OnboardingStep {
  key: StepKey;
  title: string;
  subtitle: string;
  kind: StepKind;
  multi: boolean;
  /** CTA 활성에 필요한 최소 선택 수(단일 선택은 1). */
  min: number;
  options: StepOption[];
}

const tagOptions = (labels: string[]): StepOption[] => labels.map((l) => ({ id: l, label: l }));

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    key: "mood",
    title: "어떤 무드를 좋아하세요?",
    subtitle: "끌리는 무드를 3개 이상 골라주세요.",
    kind: "image",
    multi: true,
    min: 3,
    options: tagOptions(["미니멀", "내추럴", "클래식", "스트릿", "빈티지", "스포티"]),
  },
  {
    key: "budget",
    title: "한 벌에 보통 얼마쯤 쓰세요?",
    subtitle: "대략의 예산을 하나만 골라주세요.",
    kind: "chip",
    multi: false,
    min: 1,
    options: [
      { id: "u50", label: "5만원 이하" },
      { id: "50-100", label: "5–10만원" },
      { id: "100-200", label: "10–20만원" },
      { id: "200-400", label: "20–40만원" },
      { id: "o400", label: "40만원 이상" },
      { id: "any", label: "상관 없어요" },
    ],
  },
  {
    key: "category",
    title: "어떤 걸 자주 찾으세요?",
    subtitle: "관심 카테고리를 2개 이상 골라주세요.",
    kind: "image",
    multi: true,
    min: 2,
    options: tagOptions(["상의", "하의", "아우터", "슈즈", "가방", "액세서리"]),
  },
  {
    key: "color",
    title: "어떤 컬러에 끌리세요?",
    subtitle: "좋아하는 톤을 2개 이상 골라주세요.",
    kind: "color",
    multi: true,
    min: 2,
    options: [
      { id: "베이지", label: "베이지", swatch: "linear-gradient(135deg, #efe6d0, #d6c8a4)" },
      { id: "모노톤", label: "모노톤", swatch: "linear-gradient(135deg, #efece4, #6b655e)" },
      { id: "어스 톤", label: "어스 톤", swatch: "linear-gradient(135deg, #c9a576, #6e5333)" },
      { id: "세이지", label: "세이지", swatch: "linear-gradient(135deg, #c3cbb9, #9fa89b)" },
      { id: "더스티", label: "더스티", swatch: "linear-gradient(135deg, #c9b6b0, #9f7a7a)" },
      { id: "밝은 톤", label: "밝은 톤", swatch: "linear-gradient(135deg, #fbf8f2, #e8dfcb)" },
    ],
  },
  {
    key: "lifestyle",
    title: "주로 언제 입을 옷인가요?",
    subtitle: "어울리는 상황을 2개 이상 골라주세요.",
    kind: "chip",
    multi: true,
    min: 2,
    options: tagOptions(["데일리", "출근룩", "여행", "데이트", "파티", "홈웨어"]),
  },
];

/** welcome 화면 카피. */
export const ONBOARDING_WELCOME = {
  title: "취향만 알려주세요,\n나머지는 AI가.",
  body: "5가지 질문에 답하면 취향을 학습해 첫 추천을 준비해드려요.",
  cta: "시작하기",
  caption: "약 30초 · 언제든 다시 설정할 수 있어요",
};

/** analyzing 연출 중 순환 문구. */
export const ANALYZING_STATUS = [
  "취향을 분석하고 있어요",
  "비슷한 무드를 찾는 중이에요",
  "추천을 준비하고 있어요",
];
