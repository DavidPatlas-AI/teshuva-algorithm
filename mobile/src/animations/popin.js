import {useEffect} from 'react';
import {useSharedValue, withTiming, withSpring, Easing} from 'react-native-reanimated';

export function usePopIn(delay = 0) {
  const scale   = useSharedValue(0.7);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      opacity.value = withTiming(1, {duration: 180, easing: Easing.out(Easing.quad)});
      scale.value   = withSpring(1, {damping: 14, stiffness: 200});
    }, delay);
    return () => clearTimeout(t);
  }, [delay, scale, opacity]);

  return {scale, opacity};
}

export function usePopToggle(visible) {
  const scale   = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {duration: 160});
      scale.value   = withSpring(1, {damping: 14, stiffness: 220});
    } else {
      opacity.value = withTiming(0, {duration: 140});
      scale.value   = withTiming(0.85, {duration: 140});
    }
  }, [visible, scale, opacity]);

  return {scale, opacity};
}
