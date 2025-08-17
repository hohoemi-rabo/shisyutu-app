import React, { useRef, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  error?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  error,
  placeholder = '金額を入力',
  autoFocus = false,
}) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const cardBackground = useThemeColor(
    { light: Colors.light.card, dark: Colors.dark.inputBackground },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    'text'
  );
  const errorColor = useThemeColor(
    { light: Colors.light.danger, dark: Colors.dark.danger },
    'text'
  );
  const placeholderColor = useThemeColor(
    { light: Colors.light.subText, dark: Colors.dark.subText },
    'text'
  );
  const successColor = useThemeColor(
    { light: Colors.light.success, dark: Colors.dark.success },
    'text'
  );

  // エラー時のシェイクアニメーション
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error, shakeAnimation]);

  const handleChangeText = (text: string) => {
    // 数字のみを許可
    const numericText = text.replace(/[^0-9]/g, '');
    
    // 空文字の場合はそのまま返す
    if (numericText === '') {
      onChangeText('');
      return;
    }
    
    // 先頭の0を削除（ただし、単独の0は残す）
    let cleanedText = numericText;
    if (numericText.length > 1 && numericText.startsWith('0')) {
      cleanedText = numericText.replace(/^0+/, '');
      // すべて0だった場合は1つ残す
      if (cleanedText === '') {
        cleanedText = '0';
      }
    }
    
    onChangeText(cleanedText);
  };

  // 金額をフォーマット表示（入力中は適用しない）
  const formatAmount = (amount: string) => {
    if (!amount) return '';
    return parseInt(amount, 10).toLocaleString('ja-JP');
  };

  // 入力フィールドのボーダーカラーを決定
  const getBorderColor = () => {
    if (error) return errorColor;
    if (value && !error) return successColor;
    return borderColor;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: shakeAnimation }],
        },
      ]}
    >
      <View style={[
        styles.inputWrapper, 
        { 
          backgroundColor: cardBackground,
          borderColor: getBorderColor(),
          borderWidth: error ? 2 : 1,
        }
      ]}>
        <Text style={[styles.currencySymbol, { color: textColor }]}>¥</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={7} // 最大100万円（1,000,000）
          autoFocus={autoFocus}
          selectTextOnFocus={false}
        />
        {value && !error && (
          <Text style={[styles.checkmark, { color: successColor }]}>✓</Text>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: errorColor }]}>
            {error}
          </Text>
        </View>
      )}
      {value && !error && (
        <Text style={[styles.formattedAmount, { color: placeholderColor }]}>
          = ¥{formatAmount(value)}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    paddingVertical: 14,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  formattedAmount: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});