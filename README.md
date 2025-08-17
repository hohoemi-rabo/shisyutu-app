# シンプル支出管理

シンプルで使いやすい支出記録アプリ。React Native (Expo) で構築されています。

## 機能

- 📝 **簡単な支出記録** - カテゴリを選んで金額を入力するだけ
- 📊 **カテゴリ別集計** - 食費、交通費、日用品、娯楽、その他で分類
- 📈 **統計表示** - 月間・日別の支出を可視化
- 🌓 **ダーク/ライトモード** - システム設定連動または手動切り替え
- 💾 **オフライン対応** - ネットワーク接続不要で完全動作
- 🔄 **自動データクリーンアップ** - 月が変わると前月データを自動削除

## 必要環境

- Node.js 18.x 以上
- npm または yarn
- Expo CLI
- iOS/Android エミュレータまたは実機

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/simple-expense-tracker.git
cd simple-expense-tracker

# 依存関係をインストール
npm install
```

## 開発

```bash
# 開発サーバーを起動
npm start

# iOSシミュレータで実行
npm run ios

# Androidエミュレータで実行
npm run android

# Webブラウザで実行
npm run web
```

## ビルド

### EAS Build を使用する場合

```bash
# EAS CLIをインストール
npm install -g eas-cli

# EASにログイン
eas login

# ビルド設定を初期化
eas build:configure

# iOSビルド
eas build --platform ios

# Androidビルド
eas build --platform android
```

### ローカルビルド

```bash
# iOS (Mac必須)
npx expo run:ios --configuration Release

# Android
npx expo run:android --variant release
```

## テスト

```bash
# テストを実行
npm test

# カバレッジレポート生成
npm run test:coverage

# Lintチェック
npm run lint
```

## プロジェクト構造

```
app/
├── (tabs)/          # タブナビゲーション画面
│   ├── index.tsx    # メイン（支出入力）画面
│   └── explore.tsx  # 設定画面
├── components/      # 再利用可能なコンポーネント
├── contexts/        # React Context (状態管理)
├── services/        # ビジネスロジック・API
├── types/          # TypeScript型定義
├── utils/          # ユーティリティ関数
└── hooks/          # カスタムフック
```

## 技術スタック

- **React Native** - クロスプラットフォーム開発
- **Expo SDK 53** - 開発環境・ツール
- **TypeScript** - 型安全性
- **AsyncStorage** - ローカルデータ永続化
- **React Navigation** - ナビゲーション
- **React Native Reanimated** - アニメーション

## ライセンス

MIT License

## 作者

[Your Name]

## サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/simple-expense-tracker/issues) で報告してください。

## 今後の機能追加予定

- [ ] データエクスポート（CSV）
- [ ] 月間予算設定
- [ ] レシート撮影機能
- [ ] クラウド同期
- [ ] 複数通貨対応
- [ ] グラフ表示の充実
