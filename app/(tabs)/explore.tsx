import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { forceCleanup, resetCleanupHistory } from '../utils/dataCleanup';

export default function SettingsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const cardBackground = useThemeColor({ light: '#F8F9FA', dark: '#1A1A1A' }, 'background');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'text');

  const { refreshData } = useData();
  const { themeMode, setThemeMode } = useTheme();
  const [debugMode, setDebugMode] = useState(false);

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
              // データを更新して画面に反映
              await refreshData();
              Alert.alert('完了', 'すべてのデータを削除しました');
            } catch {
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
      [
        { text: 'OK' },
        {
          text: 'デバッグモード',
          onPress: () => setDebugMode(!debugMode),
        },
      ]
    );
  };

  const handleForceCleanup = async () => {
    Alert.alert(
      '手動クリーンアップ',
      '前月以前のデータを今すぐ削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '実行',
          style: 'destructive',
          onPress: async () => {
            const result = await forceCleanup();
            await refreshData();
            if (result.success) {
              Alert.alert(
                '完了',
                `${result.deletedCount}件の古いデータを削除しました`
              );
            } else {
              Alert.alert('エラー', result.error || '削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const handleResetCleanupHistory = async () => {
    Alert.alert(
      'クリーンアップ履歴リセット',
      '次回起動時に月変わりチェックが実行されます',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          onPress: async () => {
            await resetCleanupHistory();
            Alert.alert('完了', 'クリーンアップ履歴をリセットしました');
          },
        },
      ]
    );
  };

  const themeModeLabels = {
    auto: 'システム設定に従う',
    light: 'ライトモード',
    dark: 'ダークモード',
  };

  const handleThemeChange = () => {
    const options = [
      { text: 'システム設定に従う', value: 'auto' as const },
      { text: 'ライトモード', value: 'light' as const },
      { text: 'ダークモード', value: 'dark' as const },
    ];

    Alert.alert(
      'テーマを選択',
      '表示モードを選択してください',
      [
        ...options.map(option => ({
          text: option.text,
          onPress: () => setThemeMode(option.value),
        })),
        { text: 'キャンセル', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>設定</Text>
        </View>

        {/* 表示設定 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>表示設定</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: cardBackground }]}
            onPress={handleThemeChange}
          >
            <View>
              <Text style={[styles.settingLabel, { color: textColor }]}>テーマ</Text>
              <Text style={[styles.settingDescription, { color: subTextColor }]}>
                {themeModeLabels[themeMode]}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
          </TouchableOpacity>
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

        {/* デバッグモード */}
        {debugMode && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: '#FF3B30' }]}>デバッグ機能</Text>
            
            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: cardBackground, borderBottomColor: borderColor }]}
              onPress={handleForceCleanup}
            >
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>手動クリーンアップ</Text>
                <Text style={[styles.settingDescription, { color: subTextColor }]}>
                  前月以前のデータを今すぐ削除
                </Text>
              </View>
              <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { backgroundColor: cardBackground }]}
              onPress={handleResetCleanupHistory}
            >
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>クリーンアップ履歴リセット</Text>
                <Text style={[styles.settingDescription, { color: subTextColor }]}>
                  次回起動時に月変わりチェックを実行
                </Text>
              </View>
              <Text style={[styles.chevron, { color: subTextColor }]}>›</Text>
            </TouchableOpacity>
          </View>
        )}

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