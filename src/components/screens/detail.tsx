"use client";

/*
  상품 상세 — 푸시 화면(앱바 없음, 히어로 풀블리드). 정본 detail.jsx / README §11.
  데이터는 추천 경계만 소비(getProductDetail/getSimilar/getMoreFromBrand) — mock 직접 참조 X(D-012).
  match·reason은 F3가 채울 더미. reason은 HTML 렌더(Reason) — 엔진/LLM 생성으로 바뀌면 sanitize 필수.

  피드백 4버튼(핵심 — F5/F6 신호):
   - 좋아요 → savedIds 추가(handoff: 좋아요는 저장도) + 피드백 시트(학습 반영 시각화). 하트는 outline.
   - 별로예요 → 부정 신호(recordFeedback −delta) + 토스트. (이유 선택 색/핏/가격은 이후)
   - 비슷한 → 챗 시트(비슷한 톤 재랭킹 조건).
   - 저장 → savedIds 토글.
  레이아웃(정본): 히어로 4:5 풀블리드 · 나머지 좌우 20 · back 14/14·38 · 썸네일 12/20/0 gap6 ·
    메타 mt16(이름 t-h1, 가격 20/700 + AI칩, 태그 tiny outline) · 이유카드 accent-soft 14/mt20 ·
    옵션 mt24(컬러 28 gap6 mb16 / 사이즈 44×38) · 피드백 mt24 4열 gap6(버튼 12×4) ·
    스펙 mt32(행 pb8 +보더) · 추천 가로스크롤(h-scroll gap10, 자체 좌우 20).
*/

import { useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { Reason } from "@/components/reason";
import { ProductCard } from "@/components/product-card";
import { useAppShell } from "@/lib/app-shell-state";
import { useAppState } from "@/lib/app-state";
import { useToast } from "@/lib/toast";
import { getProductDetail, getSimilar, getMoreFromBrand } from "@/lib/recommend";
import { format, productSpec } from "@/data";
import { cn } from "@/lib/cn";

const SIZES = ["S", "M", "L", "XL"];
const COLOR_NAMES = ["오리지널", "딥 블랙", "세이지"]; // 스와치 라벨(데모)

export function Detail({ productId }: { productId: string }) {
  const shell = useAppShell();
  const app = useAppState();
  const { toast } = useToast();
  const detail = getProductDetail(productId);

  const [thumb, setThumb] = useState(0);
  const [size, setSize] = useState<string | null>("M");
  const [color, setColor] = useState(0);

  if (!detail) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
        <p className="text-body text-ink-2">상품을 찾을 수 없어요.</p>
        <button type="button" onClick={shell.back} className="text-body-2 text-ink underline">
          뒤로
        </button>
      </div>
    );
  }

  const { product, match, reason } = detail;
  const saved = shell.isSaved(product.id);
  const spec = productSpec(product);
  const similar = getSimilar(product.id, 6);
  const more = getMoreFromBrand(product.id);

  const like = () => {
    if (!shell.isSaved(product.id)) shell.toggleSaved(product.id); // 좋아요는 저장도 함
    shell.openSheet({ mode: "feedback", productId: product.id });
  };

  // 썸네일/히어로 그라데이션(0번은 대표, 이후 각도 변주) — 실제 사진 전 플레이스홀더.
  const thumbBg = (i: number) =>
    i === 0
      ? `linear-gradient(160deg, ${product.img.light}, ${product.img.dark})`
      : `linear-gradient(${160 + i * 30}deg, ${product.img.base}, ${product.img.light})`;

  return (
    <div className="flex flex-1 flex-col">
      {/* 히어로 (풀블리드 4:5) */}
      <div
        className="relative aspect-[4/5] w-full shrink-0"
        style={{
          background: `radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(ellipse at 75% 95%, rgba(0,0,0,0.10), transparent 60%), ${thumbBg(thumb)}`,
        }}
      >
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="absolute top-3.5 left-3.5 flex size-[38px] cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur-sm"
        >
          <Icon name="back" size={20} />
        </button>
        <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-paper backdrop-blur-sm">
          {thumb + 1} / 4
        </span>
      </div>

      {/* 썸네일 행 */}
      <div className="flex gap-1.5 px-5 pt-3">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setThumb(i)}
            aria-label={`이미지 ${i + 1}`}
            className={cn(
              "aspect-square flex-1 cursor-pointer rounded-image ring-inset",
              thumb === i ? "ring-[1.5px] ring-ink" : "opacity-60",
            )}
            style={{ background: thumbBg(i) }}
          />
        ))}
      </div>

      {/* 메타 */}
      <div className="px-5 pt-4">
        <div className="text-label text-ink-2 uppercase">{product.brand}</div>
        <h1 className="text-h1 mt-1 text-ink">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[20px] font-bold tracking-[-0.5px] text-ink">
            {format(product.price)}
          </span>
          <span className="rounded-chip inline-flex items-center gap-1 bg-accent-soft px-2 py-1 text-[10px] font-semibold tracking-[0.05em] text-ink">
            <span className="size-1 rounded-full bg-ink" aria-hidden="true" />
            AI MATCH {match}%
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {product.tags.map((t) => (
            <span
              key={t}
              className="rounded-chip px-2 py-1 text-[10px] font-medium text-ink ring-1 ring-inset ring-line"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* AI 추천 이유 */}
      <div className="px-5 pt-5">
        <div className="rounded-card bg-accent-soft p-3.5">
          <div className="flex items-start gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
              <Icon name="sparkle" size={15} />
            </span>
            <div className="flex-1">
              <div className="text-label text-ink-2 uppercase">왜 이 상품?</div>
              <Reason html={reason} className="text-body mt-1 text-ink" />
              <button
                type="button"
                onClick={() => shell.openSheet({ mode: "chat", productId: product.id })}
                className="mt-3 flex cursor-pointer items-center gap-1 text-[12px] font-semibold text-ink"
              >
                <Icon name="chat" size={14} />
                AI에게 더 물어보기
                <Icon name="arrow-right" size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 옵션: 컬러 */}
      <div className="px-5 pt-6">
        <div className="text-label text-ink-2 uppercase">
          컬러 · {COLOR_NAMES[color] ?? `옵션 ${color + 1}`}
        </div>
        <div className="mt-2 flex gap-1.5">
          {product.colors.map((hex, i) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(i)}
              aria-label={`컬러 ${COLOR_NAMES[i] ?? i + 1}`}
              aria-pressed={color === i}
              className={cn(
                "size-7 cursor-pointer rounded-full",
                color === i
                  ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                  : "ring-1 ring-inset ring-black/5",
              )}
              style={{ background: hex }}
            />
          ))}
        </div>
      </div>

      {/* 옵션: 사이즈 */}
      <div className="px-5 pt-4">
        <div className="text-label text-ink-2 uppercase">사이즈</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SIZES.map((s) => {
            const disabled = s === "XL"; // 품절 예시
            const sel = size === s;
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => setSize(s)}
                className={cn(
                  "h-[38px] min-w-[44px] rounded-btn px-3.5 text-[13px] font-medium",
                  disabled
                    ? "cursor-not-allowed text-ink-3 line-through opacity-35"
                    : sel
                      ? "bg-ink text-paper"
                      : "cursor-pointer bg-paper-2 text-ink hover:bg-paper-3",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 피드백 (핵심) */}
      <div className="px-5 pt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-h3 text-ink">이 추천이 어떠세요?</h2>
          <span className="text-caption text-ink-3">탭하면 학습돼요</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          <FbButton icon="heart" label="좋아요" like onClick={like} />
          <FbButton
            icon="thumbs-down"
            label="별로예요"
            onClick={() => {
              app.recordFeedback(product.id, "dislike");
              toast("비슷한 추천을 줄일게요");
            }}
          />
          <FbButton
            icon="shuffle"
            label="비슷한"
            onClick={() =>
              shell.openSheet({ mode: "chat", productId: product.id, chatPrompt: "비슷한 톤으로" })
            }
          />
          <FbButton
            icon={saved ? "bookmark-fill" : "bookmark"}
            label={saved ? "저장됨" : "저장"}
            onClick={() => shell.toggleSaved(product.id)}
          />
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="px-5 pt-8">
        <h2 className="text-h3 mb-3 text-ink">상품 정보</h2>
        <dl className="flex flex-col gap-2">
          {spec.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between border-b border-line-soft pb-2"
            >
              <dt className="text-body-2 text-ink-2">{k}</dt>
              <dd className="text-body font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 브랜드의 다른 상품 (있을 때만) */}
      {more.length > 0 && (
        <div className="pt-8">
          <h2 className="text-h3 mb-3 px-5 text-ink">{product.brand}의 다른 상품</h2>
          <HScroll>
            {more.map((r) => (
              <ProductCard
                key={r.product.id}
                rec={r}
                size="sm"
                showMatch={false}
                saved={shell.isSaved(r.product.id)}
                onToggleSaved={() => shell.toggleSaved(r.product.id)}
                onClick={() => shell.openDetail(r.product.id)}
              />
            ))}
          </HScroll>
        </div>
      )}

      {/* 비슷한 무드 */}
      {similar.length > 0 && (
        <div className="pt-8">
          <div className="mb-3 flex items-baseline justify-between px-5">
            <h2 className="text-h3 text-ink">비슷한 무드</h2>
            <button
              type="button"
              onClick={() => shell.openList({ title: "비슷한 무드", keyword: product.tags[0] })}
              className="text-caption cursor-pointer font-medium text-ink-2"
            >
              전체보기 →
            </button>
          </div>
          <HScroll>
            {similar.map((r) => (
              <ProductCard
                key={r.product.id}
                rec={r}
                size="sm"
                saved={shell.isSaved(r.product.id)}
                onToggleSaved={() => shell.toggleSaved(r.product.id)}
                onClick={() => shell.openDetail(r.product.id)}
              />
            ))}
          </HScroll>
        </div>
      )}
    </div>
  );
}

/* 가로 스크롤 행(.h-scroll) — gap10, 자체 좌우 20, 끝 12px 여백. */
function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&>*]:shrink-0">
      {children}
      <span aria-hidden="true" className="w-3" />
    </div>
  );
}

function FbButton({
  icon,
  label,
  onClick,
  like = false,
}: {
  icon: IconName;
  label: string;
  onClick: () => void;
  like?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-1.5 rounded-btn px-1 py-3 text-[10px] font-medium text-ink",
        like ? "bg-accent-soft hover:bg-paper-deep" : "bg-paper-2 hover:bg-paper-3",
      )}
    >
      <Icon name={icon} size={18} />
      <span className="tracking-[-0.05em]">{label}</span>
    </button>
  );
}
