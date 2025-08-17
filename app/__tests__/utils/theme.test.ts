import { getCategoryColor } from '../../utils/theme';
import { Category } from '../../types/expense';
import { Colors } from '../../../constants/Colors';

describe('theme utils', () => {
  describe('getCategoryColor', () => {
    it('食費カテゴリの色を返す', () => {
      const color = getCategoryColor(Category.Food);
      expect(color).toBe(Colors.categories.food);
    });

    it('交通費カテゴリの色を返す', () => {
      const color = getCategoryColor(Category.Transport);
      expect(color).toBe(Colors.categories.transport);
    });

    it('日用品カテゴリの色を返す', () => {
      const color = getCategoryColor(Category.Daily);
      expect(color).toBe(Colors.categories.daily);
    });

    it('娯楽カテゴリの色を返す', () => {
      const color = getCategoryColor(Category.Entertainment);
      expect(color).toBe(Colors.categories.entertainment);
    });

    it('その他カテゴリの色を返す', () => {
      const color = getCategoryColor(Category.Other);
      expect(color).toBe(Colors.categories.other);
    });

    it('未定義のカテゴリの場合はデフォルト色を返す', () => {
      const color = getCategoryColor('invalid' as Category);
      expect(color).toBe(Colors.categories.other);
    });
  });
});