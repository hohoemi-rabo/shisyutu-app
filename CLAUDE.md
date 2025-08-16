# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

Expo SDK v53で構築されたReact Nativeモバイルアプリケーションです。「shisyutu」（支出）という名前から、支出管理アプリケーションになる可能性があります。現在はデフォルトのExpoテンプレート構造を使用しています。

## 必須コマンド

### 開発
```bash
npm install              # 依存関係のインストール
npx expo start          # 開発サーバーの起動
npm run android         # Androidエミュレータで実行
npm run ios            # iOSシミュレータで実行  
npm run web            # Webブラウザで実行
```

### コード品質
```bash
npm run lint           # ESLintチェックの実行
```

### プロジェクトリセット
```bash
npm run reset-project  # テンプレートコードをapp-example/に移動し、空のapp/を作成
```

## アーキテクチャ

### ナビゲーション構造
- `app/`ディレクトリでExpo Router v5を使用した**ファイルベースルーティング**
- `app/_layout.tsx`のルートレイアウトがテーマコンテキストとナビゲーションスタックを提供
- `app/(tabs)/_layout.tsx`で2つのタブ（indexとexplore）を持つタブナビゲーション
- `app/+not-found.tsx`で404処理

### コンポーネントアーキテクチャ
- `components/`ディレクトリの**テーマ付きコンポーネント**がネイティブコンポーネントをテーマサポートでラップ
- すべてのコンポーネントが`useThemeColor`フックでテーマシステムを使用
- プラットフォーム固有の実装は`.ios.tsx`と`.android.tsx`拡張子を使用

### テーマシステム
- `constants/Colors.ts`でライト/ダークモードのカラースキームを定義
- `hooks/useThemeColor.tsx`でテーマカラーにアクセス
- コンポーネントはシステムカラースキームに自動適応

### 状態管理
- 現在はReactフックとコンテキストを使用（外部状態管理ライブラリなし）
- ルートレイアウトレベルでテーマコンテキストを提供

## 主要な技術詳細

### TypeScript設定
- Strictモード有効
- パスエイリアス`@/*`がプロジェクトルートにマップ
- すべてのコンポーネントが適切な型付けでTypeScriptを使用

### プラットフォーム考慮事項
- iOS: ブラーエフェクト、触覚フィードバック、タブレットサポート有効
- Android: エッジツーエッジディスプレイ、アダプティブアイコン設定済み
- Web: 静的出力サポート、Web用Metroバンドラー

### パフォーマンス機能
- 新アーキテクチャ（Fabric/TurboModules）有効
- アニメーション用React Native Reanimated
- 最適化された画像読み込み用Expo Image

## 開発ワークフロー

新機能を追加する際：
1. `app/`ディレクトリに新しい画面を作成（ファイルベースルーティング）
2. `components/`から既存のテーマ付きコンポーネントを使用
3. プラットフォーム固有コードの`.ios.tsx`と`.android.tsx`の確立されたパターンに従う
4. すべての新しいコンポーネントがライトとダークテーマの両方をサポートすることを確認
5. 変更をコミットする前に`npm run lint`を実行

## Expo/React Nativeベストプラクティス

### パフォーマンス最適化
- **メモ化の活用**: `React.memo`、`useMemo`、`useCallback`で不要な再レンダリングを防ぐ
- **リスト最適化**: 大量データには`FlatList`や`SectionList`を使用し、`keyExtractor`と`getItemLayout`を適切に設定
- **画像最適化**: `expo-image`を使用し、適切なサイズとフォーマットで画像を配信
- **遅延読み込み**: React.lazyとSuspenseで画面コンポーネントを遅延読み込み

### 状態管理のベストプラクティス
- **ローカル状態優先**: 可能な限りコンポーネントローカルな状態を使用
- **Context分割**: 大きなContextは小さく分割して再レンダリングを最小化
- **非同期状態**: React QueryやSWRなどのデータフェッチングライブラリの検討

### セキュアなデータ管理
```typescript
// 機密データにはExpo SecureStoreを使用
import * as SecureStore from 'expo-secure-store';

// 通常データにはAsyncStorageを使用
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### エラーハンドリング
- **Error Boundaries**: 画面レベルでError Boundaryを実装
- **Try-Catch**: 非同期処理は必ずtry-catchでラップ
- **ユーザーフィードバック**: エラー時は適切なメッセージを表示

### プラットフォーム固有の処理
```typescript
import { Platform } from 'react-native';

// プラットフォーム分岐
if (Platform.OS === 'ios') {
  // iOS固有の処理
} else if (Platform.OS === 'android') {
  // Android固有の処理
}

// スタイルの分岐
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 0 },
    }),
  },
});
```

### ナビゲーションのベストプラクティス
- **型安全なナビゲーション**: Expo Routerの型定義を活用
- **ディープリンク**: app.jsonでschemeを設定し、適切にハンドリング
- **戻るボタン**: Androidの物理戻るボタンを適切に処理

### 非同期処理パターン
```typescript
// Promise処理の基本パターン
const fetchData = async () => {
  try {
    setLoading(true);
    const data = await apiCall();
    setData(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### テスト戦略
- **コンポーネントテスト**: React Native Testing Libraryを使用
- **E2Eテスト**: Detoxまたはmaestroを検討
- **スナップショットテスト**: UIの意図しない変更を検出

### アクセシビリティ
- すべてのインタラクティブ要素に`accessibilityLabel`を設定
- `accessibilityRole`と`accessibilityState`を適切に使用
- スクリーンリーダーでのテストを実施

### デバッグとプロファイリング
- **Flipper**: ネットワーク、ログ、レイアウトのデバッグ
- **React DevTools**: コンポーネントツリーと状態の検査
- **Performance Monitor**: `npx expo start`で`Shift + M`でパフォーマンスモニター表示

### ビルドとデプロイ
- **EAS Build**: Expo Application Servicesを使用した自動ビルド
- **OTA更新**: `expo-updates`で軽微な更新を即座に配信
- **環境変数**: `expo-constants`と`.env`ファイルで環境別設定管理