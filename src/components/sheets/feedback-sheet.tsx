"use client";

/*
  피드백 시트 (PRD F5/F6 — 피드백 루프 시각화). detail 좋아요에서 열린다.
  핵심: 화면이 아니라 "신호가 취향 벡터에 실제로 반영"되는 것.
   - 열릴 때 app.recordFeedback(productId,'like')로 취향 벡터를 실제 갱신·영속(D-013).
   - "학습 변화" 바가 보여주는 값은 그 반영의 실제 변화(before→after)지 화면용 가짜 숫자가 아니다.
   - "비슷한 상품"은 추천 경계 getSimilar로(D-012).
  (챗 시트 내용은 다음 단계 ⑤)
*/

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { getSimilar } from "@/lib/recommend";
import type { TasteChange } from "@/lib/feedback";

export function FeedbackSheet({ productId }: { productId: string | null }) {
  const app = useAppState();
  const shell = useAppShell();
  const [changes, setChanges] = useState<TasteChange[]>([]);
  const [reveal, setReveal] = useState(false);
  const applied = useRef(false);

  // 열릴 때 1회: 좋아요 신호를 취향 벡터에 실제 반영하고, 그 변화를 그대로 시각화.
  useEffect(() => {
    if (applied.current || !productId) return;
    applied.current = true;
    const ch = app
      .recordFeedback(productId, "like")
      .filter((c) => c.delta > 0)
      .slice(0, 3);
    setChanges(ch);
    const t = window.setTimeout(() => setReveal(true), 120);
    return () => window.clearTimeout(t);
  }, [productId, app]);

  const similar = productId ? getSimilar(productId, 3) : [];

  return (
    <div className="flex flex-col overflow-y-auto [scrollbar-width:none]">
      {/* 성공 히어로 */}
      <div className="animate-pulse-soft flex flex-col items-center pt-2 pb-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-ink text-paper">
          <Icon name="check" size={26} />
        </span>
        <h2 className="text-h2 mt-3.5 text-ink">취향에 반영했어요</h2>
        {changes.length > 0 && (
          <p className="text-body-2 mt-1 text-ink-2">
            {changes.map((c) => c.tag).join(" · ")} 가중치가 올라갔어요
          </p>
        )}
      </div>

      {/* 학습 변화 카드 — 값은 applyFeedback이 실제로 바꾼 before→after */}
      {changes.length > 0 && (
        <div className="rounded-card bg-paper-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-h3 text-ink">학습 변화</span>
            <span className="text-caption text-ink-3">방금 업데이트</span>
          </div>
          <div className="flex flex-col gap-3">
            {changes.map((c) => (
              <div key={c.tag} className="grid grid-cols-[64px_1fr_36px] items-center gap-2.5">
                <span className="text-body-2 text-ink">{c.tag}</span>
                <span className="relative h-1.5 overflow-hidden rounded-full bg-paper-3">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-ink transition-[width] duration-700 ease-out"
                    style={{ width: `${(reveal ? c.after : c.before) * 100}%` }}
                  />
                  <span
                    className="absolute inset-y-0 rounded-full bg-accent-soft transition-[width] delay-200 duration-700 ease-out"
                    style={{
                      left: `${c.before * 100}%`,
                      width: reveal ? `${(c.after - c.before) * 100}%` : "0%",
                    }}
                  />
                </span>
                <span className="text-right text-[11px] font-medium text-ink-2">
                  +{Math.round(c.delta * 100)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 비슷한 상품 3-up */}
      {similar.length > 0 && (
        <div className="mt-5">
          <span className="text-h3 text-ink">비슷한 상품도 좋아하실 것 같아요</span>
          <div className="mt-3 flex gap-2.5 overflow-x-auto [scrollbar-width:none]">
            {similar.map((r) => (
              <ProductCard
                key={r.product.id}
                rec={r}
                size="sm"
                saved={shell.isSaved(r.product.id)}
                onToggleSaved={() => shell.toggleSaved(r.product.id)}
                onClick={() => {
                  shell.closeSheet();
                  shell.openDetail(r.product.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="primary"
          size="lg"
          block
          onClick={() => productId && shell.openSheet({ mode: "chat", productId })}
        >
          <Icon name="sparkle" size={16} />
          AI에게 더 물어보기
        </Button>
        <Button variant="ghost" block onClick={shell.closeSheet}>
          계속 둘러보기
        </Button>
      </div>
    </div>
  );
}
