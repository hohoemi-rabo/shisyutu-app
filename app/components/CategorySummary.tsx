import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category, CategoryInfo, CategoryTotals } from '../types/expense';
import { getCategoryColor } from '../utils/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface CategorySummaryProps {
  totals: CategoryTotals;
  monthTotal: number;
}

interface CategoryItem {
  category: Category;
  amount: number;
  percentage: number;
}

export const CategorySummary: React.FC<CategorySummaryProps> = memo(({ totals, monthTotal }) => {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: Colors.light.card, dark: Colors.dark.card },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor(
    { light: Colors.light.subText, dark: Colors.dark.subText },
    'text'
  );
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    'text'
  );

  // カテゴリ別データを作成してソート（金額の多い順）
  const categoryData: CategoryItem[] = Object.entries(totals)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: monthTotal > 0 ? (amount / monthTotal) * 100 : 0,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => {
    const info = CategoryInfo[item.category];
    const categoryColor = getCategoryColor(item.category, colorScheme);
    const formattedAmount = item.amount.toLocaleString('ja-JP');
    
    return (
      <View style={[styles.categoryItem, { borderBottomColor: borderColor }]}>
        <View style={styles.categoryLeft}>
          <View style={[styles.categoryColorBar, { backgroundColor: categoryColor }]} />
          <Text style={styles.categoryIcon}>{info.icon}</Text>
          <View>
            <Text style={[styles.categoryName, { color: textColor }]}>{info.label}</Text>
            <Text style={[styles.categoryPercentage, { color: subTextColor }]}>
              {item.percentage.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.categoryRight}>
          <Text style={[styles.categoryAmount, { color: textColor }]}>
            ¥{formattedAmount}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: `${borderColor}30` }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: categoryColor,
                  width: `${Math.min(item.percentage, 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  if (categoryData.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: subTextColor }]}>
          まだカテゴリ別の支出がありません
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={categoryData}
        keyExtractor={(item) => item.category}
        renderItem={renderCategoryItem}
        scrollEnabled={false}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // カスタム比較関数: totalsとmonthTotalが同じなら再レンダリングしない
  return (
    JSON.stringify(prevProps.totals) === JSON.stringify(nextProps.totals) &&
    prevProps.monthTotal === nextProps.monthTotal
  );
});

CategorySummary.displayName = 'CategorySummary';

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 8,
  },
  emptyText: {
    fontSize: 14,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryColorBar: {
    width: 3,
    height: 35,
    borderRadius: 2,
    marginRight: 10,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 11,
    marginTop: 2,
  },
  categoryRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    width: 80,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});