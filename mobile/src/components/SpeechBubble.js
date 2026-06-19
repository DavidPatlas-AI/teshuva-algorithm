import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {usePopToggle} from '../animations/popin';
import {COLORS, FONTS, RADIUS, SHADOW} from '../styles/theme';

/**
 * SpeechBubble
 *
 * Props:
 *   message  — string
 *   visible  — boolean (animates in/out)
 *   onPress  — tap handler
 *   tailSide — 'left' | 'right'
 *              'right' → tail on right side, pointing toward Clippy on the right
 *              'left'  → tail on left side,  pointing toward Clippy on the left
 */
export default function SpeechBubble({message, visible, onPress, tailSide = 'right'}) {
  const {scale, opacity} = usePopToggle(visible);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{scale: scale.value}],
    // anchor scale from the tail side so the bubble "grows" toward Clippy
    transformOrigin: tailSide === 'right' ? 'right bottom' : 'left bottom',
  }));

  const bubbleStyle = tailSide === 'right'
    ? styles.bubbleRight
    : styles.bubbleLeft;

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents={visible ? 'auto' : 'none'}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={styles.label}>CLIPPY · ▸ תפריט</Text>
          <Text style={styles.text}>{message}</Text>
        </View>

        {/* Tail triangle pointing toward Clippy */}
        {tailSide === 'right' && <View style={styles.tailRight} />}
        {tailSide === 'left'  && <View style={styles.tailLeft}  />}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
    justifyContent: 'flex-end',
    paddingBottom: 8, // align bottom with Clippy base
  },

  bubble: {
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.md,
    paddingHorizontal: 13,
    paddingVertical:   10,
    ...SHADOW.float,
  },
  // When Clippy is to the RIGHT: bubble corner nearest Clippy is sharp
  bubbleRight: {borderBottomRightRadius: 4},
  // When Clippy is to the LEFT:  bubble corner nearest Clippy is sharp
  bubbleLeft:  {borderBottomLeftRadius:  4},

  label: {
    fontFamily: FONTS.mono,
    fontSize:   9,
    color:      COLORS.accent,
    textAlign:  'right',
    marginBottom: 3,
  },
  text: {
    fontFamily: FONTS.sans,
    fontSize:   13,
    fontWeight: '600',
    color:      COLORS.dark,
    lineHeight: 19,
    textAlign:  'right',
  },

  // Tail on the RIGHT side (points right toward Clippy)
  tailRight: {
    position:          'absolute',
    bottom:            18,
    right:             -7,
    width:             0,
    height:            0,
    borderTopWidth:    7,
    borderBottomWidth: 7,
    borderLeftWidth:   8,
    borderTopColor:    'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor:   COLORS.white,
  },
  // Tail on the LEFT side (points left toward Clippy)
  tailLeft: {
    position:          'absolute',
    bottom:            18,
    left:              -7,
    width:             0,
    height:            0,
    borderTopWidth:    7,
    borderBottomWidth: 7,
    borderRightWidth:  8,
    borderTopColor:    'transparent',
    borderBottomColor: 'transparent',
    borderRightColor:  COLORS.white,
  },
});
