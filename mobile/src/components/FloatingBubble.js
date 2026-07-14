import React, {useRef, useState, useEffect, useCallback} from 'react';
import {View, PanResponder, Dimensions, StyleSheet, Platform} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import Clippy       from '../mascot/Clippy';
import SpeechBubble from './SpeechBubble';
import MascotMenu   from '../screens/MascotMenu';
import {useClippyMessages} from '../hooks/useClippyMessages';
import config from '../../config.json';

const BUBBLE_W  = 84;
const BUBBLE_H  = 100;
const EDGE_PAD  = 14;
const SNAP_CFG  = {damping: 18, stiffness: 220};
const DRAG_SLOP = 5; // px before we call it a drag vs a tap

function getWindowDims() {
  const {width, height} = Dimensions.get('window');
  return {width, height};
}

export default function FloatingBubble({navigation}) {
  // ── initial position: bottom-right ─────────────────────────
  const {width: initW, height: initH} = getWindowDims();
  const startX = initW - BUBBLE_W - EDGE_PAD;
  const startY = initH - BUBBLE_H - 110;

  // Reanimated shared values drive the rendered position
  const posX = useSharedValue(startX);
  const posY = useSharedValue(startY);

  // Refs that hold values used inside PanResponder callbacks
  // (PanResponder closures don't re-close over state — use refs)
  const offsetX    = useRef(startX); // posX at the moment GRANT fires
  const offsetY    = useRef(startY);
  const dragging   = useRef(false);
  const menuOpenR  = useRef(false);  // mirror of menuOpen state

  // side: 'right' means bubble is snapped to right edge
  const [side, setSide]         = useState('right');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mood, setMood]         = useState('idle');

  // keep ref in sync with state
  useEffect(() => { menuOpenR.current = menuOpen; }, [menuOpen]);

  const {message, visible, say} = useClippyMessages(config.clippy_messages_interval_ms);

  // ── snap helper ─────────────────────────────────────────────
  const snapToEdge = useCallback(() => {
    const {width} = getWindowDims();
    const snapRight = posX.value > width / 2 - BUBBLE_W / 2;
    const targetX   = snapRight
      ? width - BUBBLE_W - EDGE_PAD
      : EDGE_PAD;
    posX.value = withSpring(targetX, SNAP_CFG);
    setSide(snapRight ? 'right' : 'left');
  }, [posX]);

  // ── screen rotation: re-snap to keep bubble in bounds ───────
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      const clampedY = Math.min(posY.value, window.height - BUBBLE_H - EDGE_PAD);
      const snapRight = posX.value > window.width / 2 - BUBBLE_W / 2;
      posX.value = withSpring(
        snapRight ? window.width - BUBBLE_W - EDGE_PAD : EDGE_PAD,
        SNAP_CFG,
      );
      posY.value = withSpring(clampedY, SNAP_CFG);
      setSide(snapRight ? 'right' : 'left');
    });
    return () => sub?.remove();
  }, [posX, posY]);

  // ── pan responder ────────────────────────────────────────────
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    // Only steal the gesture if the user actually moves
    onMoveShouldSetPanResponder: (_, g) =>
      Math.abs(g.dx) > DRAG_SLOP || Math.abs(g.dy) > DRAG_SLOP,

    onPanResponderGrant: () => {
      // Snapshot the current position the moment the finger touches
      offsetX.current  = posX.value;
      offsetY.current  = posY.value;
      dragging.current = false;
      setMood('excited');
    },

    onPanResponderMove: (_, gesture) => {
      if (Math.abs(gesture.dx) > DRAG_SLOP || Math.abs(gesture.dy) > DRAG_SLOP) {
        dragging.current = true;
      }
      const {width, height} = getWindowDims();
      // New position = snapshot + cumulative delta from start of gesture
      posX.value = Math.max(0, Math.min(width  - BUBBLE_W, offsetX.current + gesture.dx));
      posY.value = Math.max(0, Math.min(height - BUBBLE_H, offsetY.current + gesture.dy));
    },

    onPanResponderRelease: () => {
      setMood('idle');
      if (dragging.current) {
        // Snap to nearest edge after drag
        snapToEdge();
      } else {
        // Tap — toggle menu
        const next = !menuOpenR.current;
        setMenuOpen(next);
      }
    },

    onPanResponderTerminate: () => {
      setMood('idle');
      snapToEdge();
    },
  });

  // ── animated style ───────────────────────────────────────────
  const animStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top:  posY.value,
  }));

  // ── speech bubble side: opposite of snap edge ───────────────
  // If bubble is on the right, speech bubble flies out to the LEFT.
  // If bubble is on the left, speech bubble flies out to the RIGHT.
  const bubbleOnRight = side === 'right';

  return (
    <Animated.View style={[styles.root, animStyle]} pointerEvents="box-none">

      {/* Menu panel — positioned above the figure */}
      {menuOpen && (
        <MascotMenu
          visible={menuOpen}
          side={side}
          onClose={() => setMenuOpen(false)}
          navigation={navigation}
          onAction={text => {
            say(text);
            setMenuOpen(false);
          }}
        />
      )}

      {/* Clippy + speech bubble. The bubble is absolutely positioned off
          Clippy's edge (not a flex sibling) — it used to sit in the same
          auto-width flex row as Clippy, which silently grew the whole
          absolutely-positioned root container by the bubble's width and
          pushed everything off the right edge of the screen whenever the
          bubble was visible and docked on the right (the default side). */}
      <View style={styles.row} {...panResponder.panHandlers}>
        <Clippy size={BUBBLE_W} mood={mood} />
        <View
          style={[
            styles.bubbleAnchor,
            bubbleOnRight ? styles.bubbleAnchorLeft : styles.bubbleAnchorRight,
          ]}
          pointerEvents="box-none"
        >
          <SpeechBubble
            message={message}
            visible={visible && !menuOpen}
            onPress={() => setMenuOpen(true)}
            tailSide={bubbleOnRight ? 'right' : 'left'}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    // width/height auto-sized by children
    zIndex:   9999,
  },
  row: {
    // Fixed to Clippy's own size — must NOT auto-grow with the speech
    // bubble, since root's `left` is anchored assuming this exact width.
    width: BUBBLE_W,
  },
  bubbleAnchor: {
    position: 'absolute',
    bottom: 0,
  },
  // Bubble appears on the side away from whichever edge Clippy is docked to.
  bubbleAnchorLeft:  {right: '100%'},
  bubbleAnchorRight: {left:  '100%'},
});
