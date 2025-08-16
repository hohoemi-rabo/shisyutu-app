import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TotalCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  color?: string;
}

export const TotalCard: React.FC<TotalCardProps> = ({
  title,
  amount,
  subtitle,
  color,
}) => {
  const backgroundColor = useThemeColor({ light: '#F8F9FA', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');

  const formattedAmount = amount.toLocaleString('ja-JP');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: subTextColor }]}>{title}</Text>
      <Text style={[styles.amount, { color: color || textColor }]}>
        ¥{formattedAmount}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: subTextColor }]}>{subtitle}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },
});