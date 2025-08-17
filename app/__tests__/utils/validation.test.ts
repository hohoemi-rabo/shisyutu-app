import { validateAmount } from '../../utils/validation';

describe('validateAmount', () => {
  describe('正常系', () => {
    it('有効な金額（100円）を受け入れる', () => {
      const result = validateAmount('100');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('有効な金額（999999円）を受け入れる', () => {
      const result = validateAmount('999999');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('最大値（1000000円）を受け入れる', () => {
      const result = validateAmount('1000000');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('異常系', () => {
    it('空文字列を拒否する', () => {
      const result = validateAmount('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('金額を入力してください');
    });

    it('空白のみを拒否する', () => {
      const result = validateAmount('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('金額を入力してください');
    });

    it('0円を拒否する', () => {
      const result = validateAmount('0');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('1円以上の金額を入力してください');
    });

    it('負の値を拒否する', () => {
      const result = validateAmount('-100');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('正しい金額を入力してください');
    });

    it('100万円を超える金額を拒否する', () => {
      const result = validateAmount('1000001');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('100万円以下で入力してください');
    });

    it('数値以外の文字を拒否する', () => {
      const result = validateAmount('abc');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('数値を入力してください');
    });

    it('小数を拒否する', () => {
      const result = validateAmount('100.5');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('整数を入力してください');
    });
  });
});