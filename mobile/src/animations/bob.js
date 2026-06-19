import {useEffect} from 'react';
import {useSharedValue, withRepeat, withSequence, withTiming, Easing} from 'react-native-reanimated';

export function useBobAnimation(amplitude = 10, duration = 1400) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, {duration, easing: Easing.inOut(Easing.sin)}),
        withTiming(0,          {duration, easing: Easing.inOut(Easing.sin)}),
      ),
      -1,
      true,
    );
  }, [amplitude, duration, translateY]);

  return translateY;
}
