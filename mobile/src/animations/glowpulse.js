import {useEffect} from 'react';
import {useSharedValue, withRepeat, withSequence, withTiming, Easing} from 'react-native-reanimated';

export function useGlowPulse(minOpacity = 0.4, maxOpacity = 1.0, duration = 1700) {
  const opacity = useSharedValue(minOpacity);
  const scale   = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(maxOpacity, {duration, easing: Easing.inOut(Easing.sin)}),
        withTiming(minOpacity, {duration, easing: Easing.inOut(Easing.sin)}),
      ),
      -1,
      false,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, {duration, easing: Easing.inOut(Easing.sin)}),
        withTiming(1.0, {duration, easing: Easing.inOut(Easing.sin)}),
      ),
      -1,
      false,
    );
  }, [minOpacity, maxOpacity, duration, opacity, scale]);

  return {opacity, scale};
}
