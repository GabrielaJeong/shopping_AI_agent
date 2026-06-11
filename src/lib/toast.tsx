"use client";

/*
  전역 토스트 (사용자 액션 확인 알림). 루트(AppRoot 위)에 두어 stage 전환에도 살아남는다
  — 로그아웃/취향 재설정처럼 화면을 떠나는 액션의 토스트도 보이게.
  규칙: 액션 알림은 새 컴포넌트 만들지 말고 useToast().toast() 재사용(CONVENTIONS 「UI 알림(토스트)」).
*/

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface Toast {
  id: number;
  msg: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const toast = useCallback((msg: string) => {
    const id = nextId.current++;
    setToasts((t) => [...t, { id, msg }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  }, []);

  const value = useMemo(() => ({ toasts, toast }), [toasts, toast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

/** 토스트 렌더러. 모바일 셸 안(하단, 내비 위)에 배치 — AppRoot에서 렌더. */
export function Toaster() {
  const { toasts } = useToast();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex flex-col items-center gap-2 px-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="text-body-2 animate-fade-up max-w-full rounded-[10px] bg-ink px-4 py-2.5 text-center font-medium text-paper shadow-[0_8px_24px_rgba(31,28,26,0.22)]"
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
