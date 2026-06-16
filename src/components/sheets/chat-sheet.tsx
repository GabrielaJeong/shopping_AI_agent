"use client";

/*
  AI 챗 시트 (PRD F4 — 챗봇 재랭킹, 핵심 차별점). 구조 참고: feedback.jsx 챗 / README §12.
  발화(입력 or 빠른답변 칩) → parseReorderIntent(조건) → rerank(결과) → AI 버블에 인라인 카드.
  ⚠️ mock이되 "진짜 구조": 조건(ReorderConditions)을 올리고 match·reason은 rerank가 돌려준다(D-014).
  타이핑 인디케이터는 연출(실제 추론 대기 아님). 실제 LLM·랭킹 엔진은 parse/rerank 함수 속에 들어올 자리.
*/

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { Chip } from "@/components/ui/chip";
import { ProductCard } from "@/components/product-card";
import { useAppState } from "@/lib/app-state";
import { useAppShell } from "@/lib/app-shell-state";
import { parseReorderIntent, rerank, replyText } from "@/lib/chat-rerank";
import { QUICK_REPLIES } from "@/data";
import type { Recommendation } from "@/lib/recommend";

interface Msg {
  id: number;
  role: "user" | "ai";
  text?: string;
  products?: Recommendation[];
}

export function ChatSheet({ productId, seed }: { productId: string | null; seed: string | null }) {
  const { tasteProfile } = useAppState();
  const shell = useAppShell();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const mounted = useRef(true);
  const seeded = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // 새 메시지마다 리스트를 바닥으로. scrollIntoView는 시트가 아직 화면 밖(translate-y-full)일 때
  // 화면 밖 endRef를 보이게 하려고 조상 스크롤 컨테이너(디바이스 프레임/윈도우)를 강제 스크롤해
  // 배경이 튄다(측정: 배경 ~293px 왕복, app scrollTop=0). 리스트 컨테이너 scrollTop만 직접
  // 조정해 리스트 안에서만 스크롤한다(조상 미동). (L-006 / L-007)
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const send = (utterance: string) => {
    const text = utterance.trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId.current++, role: "user", text }]);
    setTyping(true);
    // 타이핑 인디케이터는 연출. 실제로는 parse(LLM)·rerank(랭킹) 호출 지점.
    window.setTimeout(() => {
      if (!mounted.current) return;
      const conditions = parseReorderIntent(text, {
        taste: tasteProfile,
        currentProductId: productId,
      });
      const recs = rerank(conditions, tasteProfile);
      setMessages((m) => [
        ...m,
        { id: nextId.current++, role: "ai", text: replyText(conditions), products: recs },
      ]);
      setTyping(false);
    }, 650);
  };

  // 진입 시드(detail "비슷한" 등)로 첫 발화 자동 전송.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (seed) send(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div className="flex h-[72vh] flex-col">
      {/* 큐레이터 헤더 */}
      <div className="flex items-center gap-2.5 pb-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-ink text-paper">
          <Icon name="sparkle" size={18} />
        </span>
        <div className="flex flex-col">
          <span className="text-h3 text-ink">AI 큐레이터</span>
          <span className="text-caption text-ink-3">취향 기반으로 골라드려요</span>
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div
        ref={listRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto py-2 [scrollbar-width:none]"
      >
        {messages.length === 0 && !typing && (
          <p className="text-body-2 mt-4 text-center text-ink-3">
            &ldquo;더 라이트한 느낌으로&rdquo; 처럼 말해보세요. 추천을 다시 골라드려요.
          </p>
        )}
        {messages.map((m) =>
          m.role === "user" ? (
            <div
              key={m.id}
              className="max-w-[80%] self-end rounded-[16px_16px_4px_16px] bg-ink px-3.5 py-2.5 text-[13px] text-paper"
            >
              {m.text}
            </div>
          ) : (
            <div key={m.id} className="flex max-w-[88%] flex-col gap-2 self-start">
              <div className="rounded-[16px_16px_16px_4px] bg-paper-3 px-3.5 py-2.5 text-[13px] text-ink">
                {m.text}
              </div>
              {m.products && m.products.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {m.products.map((r) => (
                    <ProductCard
                      key={r.product.id}
                      rec={r}
                      size="sm"
                      showReason
                      saved={shell.isSaved(r.product.id)}
                      onToggleSaved={() => shell.toggleSaved(r.product.id)}
                      onClick={() => {
                        shell.closeSheet();
                        shell.openDetail(r.product.id);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-center gap-1 self-start rounded-[16px_16px_16px_4px] bg-paper-3 px-4 py-3">
            <Dot delay="0s" />
            <Dot delay="0.15s" />
            <Dot delay="0.3s" />
          </div>
        )}
      </div>

      {/* 빠른답변 칩 */}
      <div className="flex gap-1.5 overflow-x-auto py-2 [scrollbar-width:none]">
        {QUICK_REPLIES.map((q) => (
          <Chip key={q} onClick={() => send(q)}>
            {q}
          </Chip>
        ))}
      </div>

      {/* 입력창 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex shrink-0 items-center gap-2 border-t border-line-soft pt-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="무엇이든 물어보세요"
          className="text-body-2 min-w-0 flex-1 rounded-full bg-paper-2 px-4 py-3 text-ink outline-none placeholder:text-ink-3"
        />
        <button
          type="submit"
          aria-label="보내기"
          className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-ink text-paper disabled:opacity-40"
          disabled={!input.trim() || typing}
        >
          <Icon name="send" size={18} />
        </button>
      </form>
    </div>
  );
}

/* 타이핑 점(연출). */
function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-pulse rounded-full bg-ink-3"
      style={{ animationDelay: delay }}
    />
  );
}
