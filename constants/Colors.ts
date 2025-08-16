/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#007AFF';
const tintColorDark = '#0A84FF';

export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // 追加のカラー定義
    card: '#F8F9FA',
    border: '#E0E0E0',
    subText: '#666666',
    primary: '#007AFF',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    // カテゴリカラー
    categoryFood: '#FF6B6B',
    categoryTransport: '#4ECDC4',
    categoryDaily: '#45B7D1',
    categoryEntertainment: '#F7B801',
    categoryOther: '#95A99C',
    // セクション背景
    sectionBackground: '#F5F5F7',
    inputBackground: '#FFFFFF',
    modalOverlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // 追加のカラー定義
    card: '#1C1C1E',
    border: '#38383A',
    subText: '#9A9A9E',
    primary: '#0A84FF',
    success: '#30D158',
    warning: '#FF9F0A',
    danger: '#FF453A',
    // カテゴリカラー（少し明るめに調整）
    categoryFood: '#FF7F7F',
    categoryTransport: '#5FE0DC',
    categoryDaily: '#5AC8E1',
    categoryEntertainment: '#FFB901',
    categoryOther: '#A5B9AC',
    // セクション背景
    sectionBackground: '#1C1C1E',
    inputBackground: '#2C2C2E',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
};