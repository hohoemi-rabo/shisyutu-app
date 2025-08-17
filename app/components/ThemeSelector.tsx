import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTheme } from '../contexts/ThemeContext';

type ThemeMode = 'auto' | 'light' | 'dark';

export const ThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const selectedColor = useThemeColor(
    { light: '#007AFF', dark: '#0A84FF' },
    'text'
  );
  const segmentBackground = useThemeColor(
    { light: '#F2F2F7', dark: '#1C1C1E' },
    'background'
  );
  const selectedBackground = useThemeColor(
    { light: '#FFFFFF', dark: '#2C2C2E' },
    'background'
  );

  const options: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'ライト', icon: '☀️' },
    { value: 'auto', label: '自動', icon: '⚙️' },
    { value: 'dark', label: 'ダーク', icon: '🌙' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.segmentControl, { backgroundColor: segmentBackground }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.segment,
              themeMode === option.value && [
                styles.selectedSegment,
                { backgroundColor: selectedBackground }
              ],
            ]}
            onPress={() => setThemeMode(option.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text
              style={[
                styles.label,
                { color: themeMode === option.value ? selectedColor : textColor },
                themeMode === option.value && styles.selectedLabel,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  segmentControl: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  selectedSegment: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedLabel: {
    fontWeight: '600',
  },
});