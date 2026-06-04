import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 디렉터리의 다른 lockfile이 있어도 이 폴더를 워크스페이스 루트로 고정
  // (Turbopack의 "Detected additional lockfiles" 루트 추론 경고 방지)
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
