/**
 * Clippy — mascot component based on mascot.svg (purple body, halo, animated eyes).
 *
 * Animations (Reanimated v3):
 *   bob         — gentle up-down float, runs forever
 *   idle-look   — auto look-around every ~3s when mood === 'idle'
 *   excited     — rapid scale bounce
 *   confused    — head tilt + fast look-around
 *   blink       — periodic eye blink driven by ry shared value
 */
import React, {useEffect, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import Svg, {
  Defs, RadialGradient, Stop,
  Circle, Ellipse, Rect, Line, Path, G,
} from 'react-native-svg';

const AnimatedCircle  = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

// SVG coordinate space: viewBox="0 0 80 90"
const L_EYE   = {cx: 29, cy: 38};
const R_EYE   = {cx: 51, cy: 38};
const EYE_RX  = 10;
const EYE_RY  = 10;
const PUPIL_R = 4.2;

// Look offsets per mood / idle-look-direction
const LOOK_DIRS = [
  {dx: 0,  dy: 0},
  {dx: -4, dy: 1},
  {dx: 4,  dy: 1},
  {dx: 0,  dy: -3},
  {dx: 3,  dy: 2},
  {dx: -3, dy: 2},
];

export default function Clippy({size = 80, mood = 'idle', onPress}) {
  // ── position / scale / tilt ──────────────────────────────
  const bobY    = useSharedValue(0);
  const tilt    = useSharedValue(0);
  const scaleXY = useSharedValue(1);

  // ── pupils ───────────────────────────────────────────────
  const lCx = useSharedValue(L_EYE.cx);
  const lCy = useSharedValue(L_EYE.cy);
  const rCx = useSharedValue(R_EYE.cx);
  const rCy = useSharedValue(R_EYE.cy);

  // ── blink (eye ry shrinks to near-zero) ─────────────────
  const eyeRy = useSharedValue(EYE_RY);

  // ref to the idle-look timer so we can clear it when mood changes
  const idleLookRef = useRef(null);
  const lookIdxRef  = useRef(0);

  // ── 1. bob — runs forever ────────────────────────────────
  useEffect(() => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-9, {duration: 1400, easing: Easing.inOut(Easing.sin)}),
        withTiming(0,  {duration: 1400, easing: Easing.inOut(Easing.sin)}),
      ),
      -1,
      true,
    );
  }, [bobY]);

  // ── 2. blink — periodic ──────────────────────────────────
  useEffect(() => {
    const interval = mood === 'excited' ? 700 : 4200;
    const blink = () => {
      eyeRy.value = withSequence(
        withTiming(EYE_RY * 0.07, {duration: 55}),
        withTiming(EYE_RY,        {duration: 80}),
      );
    };
    blink();
    const id = setInterval(blink, interval);
    return () => clearInterval(id);
  }, [mood, eyeRy]);

  // ── 3. mood-driven animations ────────────────────────────
  useEffect(() => {
    // cancel any running idle-look loop
    if (idleLookRef.current) {
      clearInterval(idleLookRef.current);
      idleLookRef.current = null;
    }

    switch (mood) {
      case 'idle': {
        tilt.value    = withSpring(0, {damping: 12, stiffness: 140});
        scaleXY.value = withTiming(1, {duration: 200});
        // start idle look-around loop
        const look = () => {
          lookIdxRef.current = (lookIdxRef.current + 1) % LOOK_DIRS.length;
          const {dx, dy} = LOOK_DIRS[lookIdxRef.current];
          lCx.value = withTiming(L_EYE.cx + dx, {duration: 400});
          lCy.value = withTiming(L_EYE.cy + dy, {duration: 400});
          rCx.value = withTiming(R_EYE.cx + dx, {duration: 400});
          rCy.value = withTiming(R_EYE.cy + dy, {duration: 400});
        };
        idleLookRef.current = setInterval(look, 3200);
        break;
      }
      case 'excited': {
        tilt.value    = withSpring(8,  {damping: 8,  stiffness: 260});
        scaleXY.value = withRepeat(
          withSequence(
            withSpring(1.12, {damping: 5, stiffness: 280}),
            withSpring(1.0,  {damping: 5, stiffness: 280}),
          ),
          6,
          true,
        );
        // pupils dart upward
        lCy.value = withTiming(L_EYE.cy - 2, {duration: 200});
        rCy.value = withTiming(R_EYE.cy - 2, {duration: 200});
        lCx.value = withTiming(L_EYE.cx,     {duration: 200});
        rCx.value = withTiming(R_EYE.cx,     {duration: 200});
        break;
      }
      case 'confused': {
        tilt.value    = withRepeat(
          withSequence(
            withTiming(-14, {duration: 350}),
            withTiming(6,   {duration: 350}),
          ),
          4,
          true,
        );
        scaleXY.value = withTiming(1, {duration: 200});
        // erratic pupil movement
        lCx.value = withTiming(L_EYE.cx + 3, {duration: 300});
        lCy.value = withTiming(L_EYE.cy + 2, {duration: 300});
        rCx.value = withTiming(R_EYE.cx - 3, {duration: 300});
        rCy.value = withTiming(R_EYE.cy - 1, {duration: 300});
        break;
      }
      case 'looking': {
        tilt.value    = withSpring(-4, {damping: 12, stiffness: 140});
        scaleXY.value = withTiming(1,  {duration: 200});
        lCx.value     = withTiming(L_EYE.cx - 4, {duration: 500});
        lCy.value     = withTiming(L_EYE.cy + 1, {duration: 500});
        rCx.value     = withTiming(R_EYE.cx - 4, {duration: 500});
        rCy.value     = withTiming(R_EYE.cy + 1, {duration: 500});
        break;
      }
      default:
        break;
    }

    return () => {
      if (idleLookRef.current) clearInterval(idleLookRef.current);
    };
  }, [mood, tilt, scaleXY, lCx, lCy, rCx, rCy]);

  // ── animated styles & props ──────────────────────────────
  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      {translateY: bobY.value},
      {scale: scaleXY.value},
      {rotate: `${tilt.value}deg`},
    ],
  }));

  const lPupilProps = useAnimatedProps(() => ({cx: lCx.value, cy: lCy.value}));
  const rPupilProps = useAnimatedProps(() => ({cx: rCx.value, cy: rCy.value}));
  const eyeProps    = useAnimatedProps(() => ({ry: eyeRy.value}));
  const eyePropsR   = useAnimatedProps(() => ({ry: eyeRy.value}));

  const w = size;
  const h = size * 1.125;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={containerStyle}>
        <Svg width={w} height={h} viewBox="0 0 80 90">
          <Defs>
            <RadialGradient id="bodyG" cx="50%" cy="40%" r="60%">
              <Stop offset="0%"   stopColor="#a78bfa" />
              <Stop offset="100%" stopColor="#5b21b6" />
            </RadialGradient>
            <RadialGradient id="glowG" cx="50%" cy="50%" r="50%">
              <Stop offset="0%"   stopColor="#ff9a1f" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#ff9a1f" stopOpacity="0"   />
            </RadialGradient>
          </Defs>

          {/* ambient glow */}
          <Ellipse cx="40" cy="62" rx="33" ry="30" fill="url(#glowG)" />

          {/* halo */}
          <Ellipse
            cx="40" cy="10" rx="18" ry="5.5"
            fill="none" stroke="#FCD34D" strokeWidth="3"
            strokeDasharray="4 2.5"
          />

          {/* antenna */}
          <Line x1="40" y1="16" x2="40" y2="22"
            stroke="#7C3AED" strokeWidth="2.4" strokeLinecap="round" />
          <Circle cx="40" cy="14" r="3.2" fill="#FCD34D" />

          {/* body */}
          <Rect x="12" y="22" width="56" height="52" rx="16" fill="url(#bodyG)" />

          {/* body highlight */}
          <Ellipse cx="40" cy="30" rx="19" ry="7" fill="#c4b5fd" opacity="0.22" />

          {/* eye whites */}
          <AnimatedEllipse
            cx={L_EYE.cx} cy={L_EYE.cy} rx={EYE_RX}
            animatedProps={eyeProps} fill="#fff"
          />
          <AnimatedEllipse
            cx={R_EYE.cx} cy={R_EYE.cy} rx={EYE_RX}
            animatedProps={eyePropsR} fill="#fff"
          />

          {/* pupils */}
          <AnimatedCircle r={PUPIL_R} fill="#1e1b4b" animatedProps={lPupilProps} />
          <AnimatedCircle r={PUPIL_R} fill="#1e1b4b" animatedProps={rPupilProps} />

          {/* pupil shine (static — offset from pupil center) */}
          <Circle cx={L_EYE.cx - 1.5} cy={L_EYE.cy - 2.4} r={1.7} fill="#fff" opacity="0.85" />
          <Circle cx={R_EYE.cx - 1.5} cy={R_EYE.cy - 2.4} r={1.7} fill="#fff" opacity="0.85" />

          {/* blush */}
          <Ellipse cx="19" cy="46" rx="5.5" ry="3" fill="#f9a8d4" opacity="0.5" />
          <Ellipse cx="61" cy="46" rx="5.5" ry="3" fill="#f9a8d4" opacity="0.5" />

          {/* mouth */}
          <Path
            d="M32 54 Q40 60 48 54"
            stroke="#fff" strokeWidth="2" strokeLinecap="round"
            fill="none" opacity="0.75"
          />

          {/* drop shadow */}
          <Ellipse cx="40" cy="76" rx="21" ry="4.5" fill="#000" opacity="0.16" />
        </Svg>
      </Animated.View>
    </TouchableOpacity>
  );
}
