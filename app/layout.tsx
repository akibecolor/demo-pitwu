import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODO 管理デモ",
  description: "日程付き TODO 管理アプリ（デモ）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
