import { useTheme } from '@/app/contexts/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  try {
    // ThemeContext内で使用されている場合
    const { actualTheme } = useTheme();
    return actualTheme;
  } catch {
    // ThemeProviderの外で使用されている場合のフォールバック
    // （ThemeProvider自体の初期化時など）
    const { useColorScheme: useSystemColorScheme } = require('react-native');
    return useSystemColorScheme() ?? 'light';
  }
}