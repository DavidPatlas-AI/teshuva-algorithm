import React, {useEffect, useState, useCallback} from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import {brainService} from '../services/BrainService';
import {useBrainApi} from '../hooks/useBrainApi';
import RichText from '../components/RichText';
import {COLORS, FONTS, RADIUS} from '../styles/theme';

const NO_DATA_INSIGHT = 'עוד לא צברת מספיק נתונים. נסה "הסבר פוסט" עם טקסט אמיתי כדי להתחיל.';

export default function InsightsScreen() {
  const [stats, setStats]           = useState(null);
  const [insights, setInsights]     = useState([NO_DATA_INSIGHT]);
  const [refreshing, setRefreshing] = useState(false);
  const {positive, negative}        = useBrainApi();

  const load = useCallback(() => {
    setStats(brainService.getHomeStats());
    setInsights(brainService.getWeeklyInsights());
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    load();
    setRefreshing(false);
  }

  useEffect(() => { load(); }, [load]);

  const topCategoryId = stats?.breakdown[0]?.id ?? null;

  function onFeedback(isPositive) {
    if (!topCategoryId) return;
    if (isPositive) positive(topCategoryId); else negative(topCategoryId);
    load();
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.inner}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
    >
      <Text style={styles.title}>תובנות שבועיות</Text>
      <Text style={styles.sub}>מה האלגוריתם עשה בשמך השבוע</Text>

      {stats && (
        <>
          {/* summary strip */}
          <View style={styles.strip}>
            <StatBox value={stats.totalSeen}             label="פריטים נראו" />
            <StatBox value={stats.dismissedTotal}         label="הוסרו" accent />
            <StatBox value={`${stats.dismissalRatePct}%`} label="הסרה" />
          </View>

          {/* clippy messages */}
          <View style={styles.msgCard}>
            <Text style={styles.msgLabel}>CLIPPY SAYS</Text>
            {insights.map((line, i) => (
              <RichText
                key={i}
                text={line}
                style={styles.msgText}
                boldStyle={styles.msgTextBold}
              />
            ))}
          </View>

          {/* category breakdown */}
          {stats.breakdown.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>פילוח קטגוריות</Text>
              <View style={styles.catCard}>
                {stats.breakdown.map(item => (
                  <View key={item.id} style={styles.catRow}>
                    <Text style={styles.catLabel}>{item.label}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, {width: `${item.pct}%`, backgroundColor: item.color}]} />
                    </View>
                    <Text style={[styles.catPct, {color: item.color}]}>{item.pct}%</Text>
                  </View>
                ))}
              </View>

              {/* feedback prompt */}
              <Text style={styles.sectionTitle}>דרג את השבוע</Text>
              <View style={styles.fbRow}>
                <TouchableOpacity style={styles.fbBtn} onPress={() => onFeedback(true)}>
                  <Text style={styles.fbText}>👍 עשית טוב</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.fbBtn, styles.fbBtnAlt]} onPress={() => onFeedback(false)}>
                  <Text style={[styles.fbText, {color: COLORS.textMuted}]}>👎 פספסת</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

function StatBox({value, label, accent}) {
  return (
    <View style={[styles.statBox, accent && styles.statBoxAccent]}>
      <Text style={[styles.statVal, accent && styles.statValAccent]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:  {flex: 1, backgroundColor: COLORS.bg},
  inner: {padding: 20, paddingBottom: 40},
  title: {
    fontFamily: FONTS.serif, fontWeight: '900',
    fontSize: 28, color: COLORS.text,
    textAlign: 'right', marginBottom: 4,
  },
  sub: {
    fontSize: 14, color: COLORS.textMuted,
    textAlign: 'right', marginBottom: 22,
  },
  strip: {
    flexDirection: 'row', gap: 12,
    marginBottom: 18,
  },
  statBox: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center',
  },
  statBoxAccent: {
    backgroundColor: 'rgba(255,154,31,0.1)',
    borderColor: 'rgba(255,154,31,0.3)',
  },
  statVal: {
    fontFamily: FONTS.mono, fontSize: 26,
    fontWeight: '700', color: COLORS.text,
  },
  statValAccent: {color: COLORS.accent},
  statLabel: {
    fontSize: 11, color: COLORS.textMuted,
    marginTop: 4, textAlign: 'center',
  },
  msgCard: {
    backgroundColor: 'rgba(255,154,31,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,154,31,0.25)',
    borderRadius: RADIUS.lg, padding: 18, marginBottom: 24, gap: 10,
  },
  msgLabel: {
    fontFamily: FONTS.mono, fontSize: 9,
    color: COLORS.accent, textAlign: 'right',
    textTransform: 'uppercase', marginBottom: 5,
  },
  msgText: {
    fontFamily: FONTS.serif, fontSize: 16,
    lineHeight: 24, color: COLORS.text, textAlign: 'right',
  },
  msgTextBold: {fontWeight: '900'},
  sectionTitle: {
    fontWeight: '700', fontSize: 16,
    color: COLORS.text, textAlign: 'right',
    marginBottom: 12,
  },
  catCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, borderWidth: 1,
    borderColor: COLORS.border, padding: 18,
    marginBottom: 24, gap: 12,
  },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  catLabel: {
    width: 80, fontSize: 14,
    color: COLORS.textMuted, textAlign: 'right',
  },
  barTrack: {
    flex: 1, height: 9,
    backgroundColor: 'rgba(236,233,225,0.07)',
    borderRadius: 99, overflow: 'hidden',
  },
  barFill: {height: '100%', borderRadius: 99},
  catPct: {
    fontFamily: FONTS.mono, fontSize: 12,
    width: 34, textAlign: 'left',
  },
  fbRow: {flexDirection: 'row', gap: 12},
  fbBtn: {
    flex: 1, backgroundColor: 'rgba(255,154,31,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,154,31,0.3)',
    borderRadius: RADIUS.md, paddingVertical: 12,
    alignItems: 'center',
  },
  fbBtnAlt: {
    backgroundColor: 'rgba(236,233,225,0.04)',
    borderColor: COLORS.border,
  },
  fbText: {fontWeight: '700', fontSize: 15, color: COLORS.accent},
  error: {color: COLORS.danger, textAlign: 'right'},
});
