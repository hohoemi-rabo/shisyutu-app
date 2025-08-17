import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface NetworkStatusBadgeProps {
  style?: any;
}

export const NetworkStatusBadge: React.FC<NetworkStatusBadgeProps> = ({ style }) => {
  const networkStatus = useNetworkStatus();
  
  const onlineColor = useThemeColor(
    { light: '#34C759', dark: '#30D158' },
    'text'
  );
  const offlineColor = useThemeColor(
    { light: '#FF9500', dark: '#FF9F0A' },
    'text'
  );
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor(
    { light: '#F2F2F7', dark: '#1C1C1E' },
    'background'
  );

  if (networkStatus.isConnected === null) {
    return null;
  }

  const isOnline = networkStatus.isConnected;
  const statusColor = isOnline ? onlineColor : offlineColor;
  const statusText = isOnline ? 'オンライン' : 'オフライン';

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[styles.text, { color: textColor }]}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});