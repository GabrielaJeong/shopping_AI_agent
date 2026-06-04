import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moodyfit",
  description: "취향에 꼭 맞는 옷을 골라주는 AI 패션 초개인화 추천 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard (Korean-first variable font) — 동적 서브셋 CDN */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
