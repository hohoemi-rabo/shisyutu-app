import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const cardBackground = useThemeColor({ light: '#F8F9FA', dark: '#1A1A1A' }, 'background');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'text');

  const handleClearAllData = () => {
    Alert.alert(
      '全データ削除',
      'すべての支出データが削除されます。この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const expenseKeys = keys.filter(key => key.startsWith('expenses_'));
              await AsyncStorage.multiRemove(expenseKeys);
              Alert.alert('完了', 'すべてのデータを削除しました');
            } catch (error) {
              Alert.alert('エラー', 'データの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert('エクスポート', 'この機能は次のバージョンで実装予定です');
  };

  const handleAbout = () => {
    Alert.alert(
      'アプリについて',
      'シンプル支出管理 v1.0.0\n\nシンプルで使いやすい支出記録アプリです。',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>設定</Text>
        </View>

        {/* データ管理 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>データ管理</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}
            onPress={handleExport}
          >
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>データをエクスポート</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                CSVファイルとして保存
              </Text>
            </View>
            <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
            onPress={handleClearAllData}
          >
            <View>
              <Text style={[styles.settingLabel, { color: '#FF3B30' }]}>全データを削除</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                すべての支出記録を削除します
              </Text>
            </View>
            <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* アプリ情報 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>アプリ情報</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
            onPress={handleAbout}
          >
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>このアプリについて</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                バージョン情報
              </Text>
            </View>
            <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 使い方 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>使い方</Text>
          <View style={[styles.helpCard, { backgroundColor: cardBackground }]}>
            <Text style={[styles.helpTitle, { color: textColor }]}>基本的な使い方</Text>
            <Text style={[styles.helpText, { color: subTextColor }]}>
              1. カテゴリを選択{'\n'}
              2. 金額を入力{'\n'}
              3. Enterキーまたは完了ボタンで保存{'\n'}
              {'\n'}
              • 支出は自動的に今日の日付で記録されます{'\n'}
              • 編集・削除は各項目のボタンから実行できます{'\n'}
              • 月が変わると前月のデータは自動削除されます
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: subTextColor }]}>
            Made with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 1,
    borderRadius: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
  },
  helpCard: {
    padding: 16,
    borderRadius: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
  },
});