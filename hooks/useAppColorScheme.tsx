import { useTheme } from '@/app/contexts/ThemeContext';

/**
 * アプリ全体で使用するカラースキームを取得
 * ThemeContextの設定に基づいて、'light' | 'dark' を返す
 */
export function useAppColorScheme(): 'light' | 'dark' {
  const { actualTheme } = useTheme();
  return actualTheme;
}