import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {usePopToggle} from '../animations/popin';
import {COLORS, FONTS, RADIUS, SHADOW} from '../styles/theme';

const MENU_WIDTH = 268;

const MENU_ITEMS = [
  {
    id:    'explain',
    icon:  '👁',
    label: 'הסבר לי למה אני רואה את זה',
    sub:   'הסבר על הפריט הנוכחי',
    route: 'Explain',
    msg:   'הנה הסיבה: צפית ב‑3 סרטונים דומים → +62%. עוד 24% כי זה טרנדי באזורך.',
  },
  {
    id:    'insights',
    icon:  '📊',
    label: 'תובנות שבועיות',
    sub:   'מה השתנה השבוע בפיד שלך',
    route: 'Insights',
    msg:   '47% מהפיד שלך זה פוליטיקה. גללתי לך לגרף 👇',
  },
  {
    id:    'learning',
    icon:  '🧠',
    label: 'מצב למידה',
    sub:   'ראה מה האלגוריתם למד',
    route: 'Insights',
    msg:   'למדתי עד כה מ‑342 פריטים. משקל פוליטיקה: 0.31 ↓',
  },
  {
    id:    'settings',
    icon:  '⚙️',
    label: 'הגדרות',
    sub:   'סף מחיקה, שפה, API',
    route: 'Settings',
    msg:   'פותח הגדרות…',
  },
];

/**
 * MascotMenu — menu panel that pops above the Clippy bubble.
 *
 * Props:
 *   visible    — boolean
 *   side       — 'left' | 'right'  (which edge the bubble is snapped to)
 *   onClose    — () => void
 *   navigation — RN navigation ref
 *   onAction   — (messageText: string) => void  — called before navigate so Clippy can say something
 */
export default function MascotMenu({visible, side = 'right', onClose, navigation, onAction}) {
  const {scale, opacity} = usePopToggle(visible);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [
      {scale: scale.value},
      // anchor the scale transform at the bottom corner closest to the bubble
      // (translateY trick: shift down by half the panel height before scaling)
    ],
  }));

  if (!visible) return null;

  // Position panel above the bubble, flush with the same edge
  const panelStyle = side === 'right'
    ? styles.panelRight
    : styles.panelLeft;

  return (
    <Animated.View style={[styles.panel, panelStyle, animStyle]}>
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>מה אפשר לעשות?</Text>
          <Text style={styles.headerSub}>clippy · assistant</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeX}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* items */}
      <ScrollView scrollEnabled={false}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            activeOpacity={0.75}
            onPress={() => {
              if (onAction) onAction(item.msg);
              onClose();
              navigation?.navigate(item.route, {action: item.id});
            }}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemSub}>{item.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position:        'absolute',
    // Always sits above the Clippy row
    bottom:          110,
    width:           MENU_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius:    RADIUS.lg,
    padding:         10,
    ...SHADOW.float,
  },
  // Flush with right edge (bubble is on right side of screen)
  panelRight: {right: 0},
  // Flush with left edge (bubble is on left side of screen)
  panelLeft:  {left: 0},

  header: {
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
    paddingHorizontal: 8,
    paddingVertical:   8,
    marginBottom:      6,
  },
  headerTitle: {
    fontFamily: FONTS.serif,
    fontWeight: '700',
    fontSize:   16,
    color:      COLORS.dark,
    textAlign:  'right',
  },
  headerSub: {
    fontFamily:    FONTS.mono,
    fontSize:      9,
    color:         '#9a8f7a',
    textAlign:     'right',
    textTransform: 'uppercase',
  },
  closeBtn: {
    width:           26,
    height:          26,
    borderRadius:    8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  closeX: {fontSize: 13, color: '#8a8170'},

  item: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           11,
    padding:       10,
    borderRadius:  11,
  },
  iconBox: {
    width:           30,
    height:          30,
    borderRadius:    9,
    backgroundColor: 'rgba(255,154,31,0.14)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  icon:      {fontSize: 16},
  itemText:  {flex: 1},
  itemLabel: {
    fontWeight: '700',
    fontSize:   14,
    color:      COLORS.dark,
    textAlign:  'right',
  },
  itemSub: {
    fontSize:  11,
    color:     '#8a8170',
    textAlign: 'right',
  },
});
