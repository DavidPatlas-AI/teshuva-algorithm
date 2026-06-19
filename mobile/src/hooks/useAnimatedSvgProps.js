/**
 * Convenience hook: given a set of Reanimated shared values,
 * returns `useAnimatedProps` calls so SVG elements can be driven
 * from the UI thread.
 *
 * Usage:
 *   const pupilProps = useAnimatedSvgProps({cx: sharedCx, cy: sharedCy});
 *   <AnimatedCircle animatedProps={pupilProps} r={5} fill="#000" />
 */
import {useAnimatedProps} from 'react-native-reanimated';

export function useAnimatedSvgProps(sharedValues) {
  return useAnimatedProps(() => {
    const result = {};
    for (const [key, sv] of Object.entries(sharedValues)) {
      result[key] = sv.value;
    }
    return result;
  });
}
