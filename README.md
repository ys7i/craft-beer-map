# 大阪クラフトビール店マップ

大阪エリアのクラフトビールが飲める店舗を地図上で検索・発見できる Web アプリケーション

## 概要

- **目的**: 大阪府内のクラフトビール店を地図上で簡単に見つける
- **対象エリア**: 大阪市内から開始、段階的に大阪府全域に拡大
- **自動更新**: 店舗情報は外部 API を使用して自動収集・更新

## 主要機能

- 📍 **インタラクティブマップ**: クラフトビール店をマーカー表示
- 📱 **現在地検索**: GPS 連携で近くの店舗を優先表示
- 🔍 **検索・フィルタ**: エリア、価格帯、ビールタイプで絞り込み
- ❤️ **お気に入り**: 気になる店舗をブックマーク
- 📊 **店舗詳細**: 営業時間、取り扱いビール、価格帯など

## 技術スタック

- **Frontend**: Next.js 14 + TypeScript
- **Map**: Leaflet.js + OpenStreetMap
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (無料枠)
- **Data**: JSON files (GitHub repository)
- **Auto Update**: GitHub Actions

## 開発開始

```bash
# 開発サーバー起動
pnpm run dev
```

## 要件詳細

詳細な要件定義は [`docs/requirements.md`](./docs/requirements.md) を参照してください。

## データソース

- Google Places API
- 食べログ API
- 手動キュレーション

## ライセンス

MIT License
