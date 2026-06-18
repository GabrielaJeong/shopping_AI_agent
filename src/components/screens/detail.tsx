"use client";

/*
  상품 상세 — 푸시 화면. 구조 참고: detail.jsx / README §11(피드백 시트의 출발점).
  데이터는 추천 경계 getProductDetail(id)만 소비(mock 직접 참조 X, D-012). match·reason은 F3가 채울 더미.

  피드백 4버튼은 동작 슬롯만 연결(시트 내용은 다음 단계 F4·F5·F6):
   - 좋아요 → savedIds에 추가(handoff: 좋아요는 저장도 함) + feedback 시트 열기. 하트는 outline(이미 활성처럼 안 보이게).
   - 저장 → savedIds 토글.
   - 비슷한 → chat 시트(similar_tone).
   - 별로예요 → 부정 신호 슬롯(F6 −delta) + handoff 'planned' 이유 선택(색/핏/가격) 자리. 지금은 슬롯만.
*/

import { useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { Reason } from "@/components/reason";
import { useAppShell } from "@/lib/app-shell-state";
import { useAppState } from "@/lib/app-state";
import { useToast } from "@/lib/toast";
import { getProductDetail } from "@/lib/recommend";
import { format } from "@/data";
import { cn } from "@/lib/cn";

const SIZES = ["S", "M", "L", "XL"];

export function Detail({ productId }: { productId: string }) {
  const shell = useAppShell();
  const app = useAppState();
  const { toast } = useToast();
  const detail = getProductDetail(productId);

  const [thumb, setThumb] = useState(0);
  const [size, setSize] = useState<string | null>(null);
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

  const like = () => {
    if (!shell.isSaved(product.id)) shell.toggleSaved(product.id); // 좋아요는 저장도 함
    shell.openSheet({ mode: "feedback", productId: product.id });
  };

  return (
    <div className="flex flex-1 flex-col pb-8">
      {/* 이미지 히어로 */}
      <div className="relative">
        <div
          className="aspect-[4/5] w-full"
          style={{
            background: `radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(ellipse at 75% 95%, rgba(0,0,0,0.10), transparent 60%), linear-gradient(160deg, ${product.img.light} 0%, ${product.img.base} 55%, ${product.img.dark} 100%)`,
          }}
        />
        <button
          type="button"
          onClick={shell.back}
          aria-label="뒤로"
          className="absolute top-[58px] left-4 flex size-9 items-center justify-center rounded-full bg-paper/90 text-ink backdrop-blur-sm"
        >
          <Icon name="back" size={20} />
        </button>
        <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-paper backdrop-blur-sm">
          {thumb + 1} / 4
        </span>
      </div>

      {/* 썸네일 */}
      <div className="flex gap-1.5 px-5 pt-3">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setThumb(i)}
            aria-label={`이미지 ${i + 1}`}
            className={cn(
              "aspect-square flex-1 rounded-image ring-inset",
              thumb === i ? "ring-[1.5px] ring-ink" : "opacity-60",
            )}
            style={{ background: product.img.base }}
          />
        ))}
      </div>

      {/* 메타 */}
      <div className="px-5 pt-5">
        <div className="text-caption text-ink-2">{product.brand}</div>
        <div className="text-h2 mt-1 text-ink">{product.name}</div>
        <div className="text-price mt-2 text-ink">{format(product.price)}</div>
      </div>

      {/* match · reason */}
      <div className="px-5 pt-4">
        <div className="rounded-card bg-accent-soft px-3.5 py-3">
          <span className="mr-1.5 inline-block rounded bg-paper px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-ink uppercase">
            AI {match}%
          </span>
          <Reason html={reason} className="text-[12.5px] leading-relaxed text-ink" />
        </div>
        {/* 이 추천 더 묻기 → 챗 시트 (정본 §12 트리거) */}
        <button
          type="button"
          onClick={() => shell.openSheet({ mode: "chat", productId: product.id })}
          className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-ink-2"
        >
          <Icon name="sparkle" size={13} />이 추천 더 묻기
        </button>
      </div>

      {/* 옵션: 컬러 */}
      <div className="px-5 pt-6">
        <div className="text-label text-ink-2 uppercase">컬러</div>
        <div className="mt-2 flex gap-2">
          {product.colors.map((hex, i) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(i)}
              aria-label={`컬러 ${i + 1}`}
              aria-pressed={color === i}
              className={cn(
                "size-7 rounded-full",
                color === i
                  ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                  : "ring-1 ring-ink/10",
              )}
              style={{ background: hex }}
            />
          ))}
        </div>
      </div>

      {/* 옵션: 사이즈 */}
      <div className="px-5 pt-5">
        <div className="text-label text-ink-2 uppercase">사이즈</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SIZES.map((s) => {
            const disabled = s === "XL"; // 품절 예시(.opt-sz.dis)
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
                      : "bg-paper-2 text-ink",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* 피드백 4버튼 */}
      <div className="mt-auto px-5 pt-8">
        <div className="grid grid-cols-4 gap-1.5">
          <FbButton icon="heart" label="좋아요" like onClick={like} />
          <FbButton
            icon="thumbs-down"
            label="별로예요"
            onClick={() => {
              // 부정 신호: 취향 벡터에 −delta 반영(F6) + 확인 토스트.
              // (handoff 'planned' 이유 선택(색/핏/가격)은 이후 단계)
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
            label="저장"
            onClick={() => shell.toggleSaved(product.id)}
          />
        </div>
      </div>
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
        "flex cursor-pointer flex-col items-center gap-1.5 rounded-btn py-3 text-[10px] font-medium text-ink",
        like ? "bg-accent-soft hover:bg-paper-deep" : "bg-paper-2 hover:bg-paper-3",
      )}
    >
      <Icon name={icon} size={18} />
      <span className="tracking-[-0.05em]">{label}</span>
    </button>
  );
}
