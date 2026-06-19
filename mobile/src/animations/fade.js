import {useEffect} from 'react';
import {useSharedValue, withTiming, Easing} from 'react-native-reanimated';

export function useFadeIn(duration = 300, delay = 0) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, {duration, easing: Easing.out(Easing.cubic)});
    }, delay);
    return () => clearTimeout(t);
  }, [duration, delay, opacity]);

  return opacity;
}

export function useFadeInOut(visible, duration = 220) {
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {duration, easing: Easing.inOut(Easing.quad)});
  }, [visible, duration, opacity]);

  return opacity;
}
