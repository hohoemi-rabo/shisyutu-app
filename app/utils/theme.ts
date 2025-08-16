import { Colors } from '@/constants/Colors';
import { Category } from '../types/expense';
import { useColorScheme } from '@/hooks/useColorScheme';

// カテゴリのテーマカラーを取得
export const getCategoryColor = (category: Category, colorScheme: 'light' | 'dark' | null | undefined): string => {
  const theme = colorScheme ?? 'light';
  
  switch (category) {
    case Category.Food:
      return Colors[theme].categoryFood;
    case Category.Transport:
      return Colors[theme].categoryTransport;
    case Category.Daily:
      return Colors[theme].categoryDaily;
    case Category.Entertainment:
      return Colors[theme].categoryEntertainment;
    case Category.Other:
      return Colors[theme].categoryOther;
    default:
      return Colors[theme].text;
  }
};

// カテゴリカラーを使用するカスタムフック
export const useCategoryColor = (category: Category): string => {
  const colorScheme = useColorScheme();
  return getCategoryColor(category, colorScheme);
};