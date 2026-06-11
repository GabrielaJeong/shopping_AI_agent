/*
  앱 루트 — 단일 루트 상태 머신(D-009)을 마운트한다.
  스테이지 전환/렌더는 AppRoot, 전역 상태는 AppStateProvider가 담당.
  (디자인 토큰 미리보기는 /foundation 으로 이동)
*/

import { ToastProvider } from "@/lib/toast";
import { AppStateProvider } from "@/lib/app-state";
import { AppRoot } from "@/components/app-root";

export default function Page() {
  return (
    <ToastProvider>
      <AppStateProvider>
        <AppRoot />
      </AppStateProvider>
    </ToastProvider>
  );
}
