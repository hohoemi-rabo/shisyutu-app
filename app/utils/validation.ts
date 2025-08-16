/**
 * 金額入力のバリデーション
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateAmount = (amount: string): ValidationResult => {
  // 空文字チェック
  if (!amount || amount.trim() === '') {
    return {
      isValid: false,
      error: '金額を入力してください',
    };
  }

  // 数値チェック
  const numAmount = parseInt(amount, 10);
  if (isNaN(numAmount)) {
    return {
      isValid: false,
      error: '有効な数値を入力してください',
    };
  }

  // 0円チェック
  if (numAmount === 0) {
    return {
      isValid: false,
      error: '0円より大きい金額を入力してください',
    };
  }

  // マイナス値チェック
  if (numAmount < 0) {
    return {
      isValid: false,
      error: '正の数値を入力してください',
    };
  }

  // 上限チェック（100万円）
  if (numAmount > 1000000) {
    return {
      isValid: false,
      error: '100万円以下で入力してください',
    };
  }

  return {
    isValid: true,
  };
};

/**
 * 日付のバリデーション
 */
export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * データの整合性チェック
 */
export const validateExpenseData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // 必須フィールドのチェック
  const requiredFields = ['id', 'date', 'amount', 'category', 'timestamp'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      return false;
    }
  }

  // 型チェック
  if (typeof data.amount !== 'number' || data.amount < 0) {
    return false;
  }

  if (!validateDate(data.date)) {
    return false;
  }

  return true;
};