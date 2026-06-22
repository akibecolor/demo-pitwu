# TODO 管理デモ

日程（期日）付きの TODO 管理 WEB アプリ。追加・編集・削除・完了切替に対応。
データはブラウザの `localStorage` に保存されます（サーバー不要）。

## 技術スタック

- Next.js 16（App Router / 静的エクスポート `output: "export"`）
- React 19 / TypeScript
- スタイルは素の CSS（`app/globals.css`）
- 永続化: ブラウザの localStorage

## ローカル開発

```bash
npm install
npm run dev      # http://localhost:3000
```

## ビルド（静的出力）

```bash
npm run build    # out/ に静的ファイルを生成
```

## Cloudflare Pages へのデプロイ（GitHub 連携）

1. [Cloudflare ダッシュボード](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub アカウントを連携し、リポジトリ `akibecolor/demo-pitwu` を選択
3. ビルド設定を以下にする:
   - **Framework preset**: `Next.js (Static HTML Export)`（または None）
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
4. **Save and Deploy**

以降、`main` ブランチへ push するたびに自動でビルド & デプロイされます。
