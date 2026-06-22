import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 디렉터리의 다른 lockfile이 있어도 이 폴더를 워크스페이스 루트로 고정
  // (Turbopack의 "Detected additional lockfiles" 루트 추론 경고 방지)
  turbopack: {
    root: __dirname,
  },
  eslint: {
    // 빌드 시 ESLint는 끈다 — 린트 게이트는 `pnpm lint`(flat config eslint.config.mjs)로 일원화(CONVENTIONS).
    // 끄는 이유: eslint-config-next의 react-hooks 플러그인이 pnpm 엄격 모드에서 Next 빌드-린트 러너의
    // require 경로로 해석되지 않아 빌드 로그에 ⨯가 찍힌다(코드는 pnpm lint로 이미 깨끗). 린트를 없앤 게 아님.
    // 타입체크(tsc)는 빌드에서 계속 수행된다(typescript.ignoreBuildErrors는 끄지 않음).
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
