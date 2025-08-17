import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const OfflineIndicator: React.FC = () => {
  const networkStatus = useNetworkStatus();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  
  const backgroundColor = useThemeColor(
    { light: '#FF9500', dark: '#FF9F0A' },
    'background'
  );
  const textColor = useThemeColor(
    { light: '#FFFFFF', dark: '#FFFFFF' },
    'text'
  );

  const isOffline = networkStatus.isConnected === false;

  useEffect(() => {
    if (isOffline) {
      // オフライン時: スライドダウンして表示
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (networkStatus.isConnected === true) {
      // オンライン復帰時: スライドアップして非表示
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOffline, networkStatus.isConnected, fadeAnim, slideAnim]);

  // 初回読み込み時や接続状態が不明な場合は表示しない
  if (networkStatus.isConnected === null) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents={isOffline ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <View style={styles.dot} />
        <Text style={[styles.text, { color: textColor }]}>
          オフライン中 - データはローカルに保存されます
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 50, // ステータスバーの高さを考慮
    paddingBottom: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});