"use client";

/*
  Login — 계정 진입(게스트 둘러보기 허용). 구조 참고: launch.jsx (Login) / README §3.
  Apple·카카오 버튼은 지금은 앱 모노 톤 플레이스홀더 — 프로덕션에선 실제 SDK 연동 + 공식 브랜딩 적용.
  모든 버튼은 onLogin으로 진입(상태 머신이 onboarded 여부로 app/onboarding 분기).
*/

import { Icon } from "@/components/icon";
import { MudifitLogo } from "@/components/brand";
import { ProductImg } from "@/components/product-img";
import { Button } from "@/components/ui/button";
import { byId } from "@/data";
import type { Product } from "@/types";

export function Login({ onLogin }: { onLogin: () => void }) {
  const teaser = [byId("p01"), byId("p04"), byId("p02")].filter(Boolean) as Product[];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-[54px] pb-[26px] [scrollbar-width:none]">
      {/* 브랜드 + 히어로 */}
      <div className="pt-9">
        <div className="animate-fade-up">
          <MudifitLogo size={24} />
        </div>
        <h1
          className="animate-fade-up mt-6 font-bold whitespace-pre-line text-ink"
          style={{ fontSize: 27, lineHeight: 1.3, letterSpacing: "-0.8px" }}
        >
          {"오늘의 무드를\n입어보세요"}
        </h1>
        <p className="animate-fade-up mt-3 text-ink-2" style={{ fontSize: 14, lineHeight: 1.6 }}>
          Moodyfit이 취향에 맞는 옷을 매일 골라드려요. 30초면 시작할 수 있어요.
        </p>
      </div>

      {/* 룩북 티저 3-up */}
      <div className="animate-fade-up mt-6 grid grid-cols-3 gap-2">
        {teaser.map((p) => (
          <ProductImg key={p.id} colors={p.img} shape="tall" />
        ))}
      </div>

      <div className="mt-auto" />

      {/* 인증 스택 */}
      <div className="pt-6">
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="lg" block onClick={onLogin}>
            <Icon name="send" size={15} />
            이메일로 계속하기
          </Button>
          <Button variant="secondary" size="lg" block onClick={onLogin}>
            Apple로 계속하기
          </Button>
          <Button variant="secondary" size="lg" block onClick={onLogin}>
            카카오로 시작하기
          </Button>
        </div>
        <Button variant="ghost" block className="mt-3" onClick={onLogin}>
          로그인 없이 둘러보기
        </Button>
        <p className="mt-4 text-center text-caption text-ink-3" style={{ lineHeight: 1.6 }}>
          계속 진행하면 Moodyfit의 <span className="underline">이용약관</span>과
          <br />
          <span className="underline">개인정보 처리방침</span>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
