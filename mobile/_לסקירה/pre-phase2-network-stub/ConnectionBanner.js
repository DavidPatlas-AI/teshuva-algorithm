import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import config from '../../config.json';
import {COLORS, FONTS, RADIUS} from '../styles/theme';

const CHECK_INTERVAL_MS = 15000;

export default function ConnectionBanner() {
  const [status, setStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const height = useSharedValue(0);

  async function check() {
    try {
      const res = await fetch(`${config.brain_api}/health`, {signal: AbortSignal.timeout(3000)});
      setStatus(res.ok ? 'online' : 'offline');
    } catch {
      setStatus('offline');
    }
  }

  useEffect(() => {
    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const visible = status === 'offline';

  const animStyle = useAnimatedStyle(() => ({
    height:   withTiming(visible ? 38 : 0, {duration: 250}),
    opacity:  withTiming(visible ? 1 : 0,  {duration: 250}),
    overflow: 'hidden',
  }));

  return (
    <Animated.View style={animStyle}>
      <View style={styles.banner}>
        <Text style={styles.dot}>●</Text>
        <Text style={styles.text}>Brain API לא זמין — בדוק את config.json</Text>
        <TouchableOpacity onPress={check} style={styles.retry}>
          <Text style={styles.retryText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'rgba(208,90,74,0.18)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(208,90,74,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  dot:  {color: COLORS.danger, fontSize: 10},
  text: {flex: 1, color: '#e8a29a', fontSize: 13, textAlign: 'right'},
  retry: {
    backgroundColor: 'rgba(208,90,74,0.2)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  retryText: {color: COLORS.danger, fontSize: 12, fontWeight: '700'},
});
