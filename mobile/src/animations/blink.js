/**
 * useBlink — drives an SVG Ellipse `ry` shared value to simulate eye blinking.
 *
 * Usage:
 *   const eyeRy = useSharedValue(10);
 *   useBlink(eyeRy, 10, { intervalMs: 4000 });
 *   const eyeProps = useAnimatedProps(() => ({ ry: eyeRy.value }));
 *   <AnimatedEllipse animatedProps={eyeProps} cx={29} cy={38} rx={10} fill="#fff" />
 */
import {useEffect} from 'react';
import {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const BLINK_CLOSE_MS = 55;
const BLINK_OPEN_MS  = 80;

export function useBlink(sharedRy, openRy = 10, {intervalMs = 4000} = {}) {
  useEffect(() => {
    const blink = () => {
      sharedRy.value = withSequence(
        withTiming(openRy * 0.06, {duration: BLINK_CLOSE_MS}),
        withTiming(openRy,        {duration: BLINK_OPEN_MS}),
      );
    };

    blink(); // initial blink after a short delay
    const id = setInterval(blink, intervalMs);
    return () => clearInterval(id);
  }, [sharedRy, openRy, intervalMs]);
}

/**
 * useDoubleBlink — quick double-blink, used when Clippy is excited.
 */
export function useDoubleBlink(sharedRy, openRy = 10) {
  const blink = () => {
    sharedRy.value = withSequence(
      withTiming(openRy * 0.06, {duration: 50}),
      withTiming(openRy,        {duration: 70}),
      withTiming(openRy * 0.06, {duration: 50}),
      withTiming(openRy,        {duration: 80}),
    );
  };
  return blink;
}
