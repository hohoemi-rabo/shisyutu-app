import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  error?: string;
  placeholder?: string;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  error,
  placeholder = '金額を入力',
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'text');
  const errorColor = '#FF6B6B';
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'text');

  const handleChangeText = (text: string) => {
    // 数字のみを許可
    const numericText = text.replace(/[^0-9]/g, '');
    onChangeText(numericText);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputWrapper, { borderColor: error ? errorColor : borderColor }]}>
        <Text style={[styles.currencySymbol, { color: textColor }]}>¥</Text>
        <TextInput
          style={[styles.input, { color: textColor, backgroundColor }]}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType="numeric"
          returnKeyType="done"
          maxLength={7} // 最大100万円（1,000,000）
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});