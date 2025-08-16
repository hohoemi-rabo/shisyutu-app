import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Expense } from '../types/expense';

interface MonthlyStatsProps {
  expenses: Expense[];
  monthTotal: number;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ expenses, monthTotal }) => {
  const backgroundColor = useThemeColor({ light: '#F0F7FF', dark: '#1A2332' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const accentColor = '#007AFF';

  // 統計計算
  const dailyAverage = expenses.length > 0 
    ? monthTotal / new Set(expenses.map(e => e.date)).size 
    : 0;
  
  const maxExpense = expenses.length > 0 
    ? Math.max(...expenses.map(e => e.amount))
    : 0;
  
  const transactionCount = expenses.length;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subTextColor }]}>日平均</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            ¥{dailyAverage.toLocaleString('ja-JP', { maximumFractionDigits: 0 })}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subTextColor }]}>最高支出</Text>
          <Text style={[styles.statValue, { color: textColor }]}>
            ¥{maxExpense.toLocaleString('ja-JP')}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subTextColor }]}>記録数</Text>
          <Text style={[styles.statValue, { color: accentColor }]}>
            {transactionCount}件
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});