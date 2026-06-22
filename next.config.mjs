/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的サイトとして出力（Cloudflare Pages にそのままデプロイ可能）
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
