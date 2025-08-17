import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  duration?: number;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  duration = 3000,
  onDismiss,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-10)).current;

  const backgroundColor = useThemeColor(
    {
      light: type === 'error' ? '#FFE5E5' : type === 'warning' ? '#FFF3E0' : '#E3F2FD',
      dark: type === 'error' ? '#4D1F1F' : type === 'warning' ? '#4D3D1F' : '#1F3A4D',
    },
    'background'
  );

  const textColor = useThemeColor(
    {
      light: type === 'error' ? Colors.light.danger : type === 'warning' ? Colors.light.warning : Colors.light.primary,
      dark: type === 'error' ? Colors.dark.danger : type === 'warning' ? Colors.dark.warning : Colors.dark.primary,
    },
    'text'
  );

  const borderColor = useThemeColor(
    {
      light: type === 'error' ? '#FFCCCC' : type === 'warning' ? '#FFE0B2' : '#BBDEFB',
      dark: type === 'error' ? '#661F1F' : type === 'warning' ? '#664D1F' : '#1F4A66',
    },
    'text'
  );

  useEffect(() => {
    // フェードインアニメーション
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 自動で消える場合
    if (duration > 0 && onDismiss) {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -10,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [fadeAnim, translateY, duration, onDismiss]);

  if (!message) return null;

  const icon = type === 'error' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});