import React, {useEffect, useState, useCallback} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import {brainService} from '../services/BrainService';
import {COLORS, FONTS, RADIUS, SHADOW} from '../styles/theme';

const EMPTY_STATS = {totalSeen: 0, dismissedTotal: 0, dismissalRatePct: 0, breakdown: []};

export default function HomeScreen({navigation}) {
  const [stats, setStats]     = useState(EMPTY_STATS);
  const [greeting, setGreeting] = useState('');
  const [refreshing, setRef]  = useState(false);

  const load = useCallback(async () => {
    setStats(await brainService.getHomeStats());
    setGreeting(brainService.getGreeting());
  }, []);

  async function onRefresh() {
    setRef(true);
    await load();
    setRef(false);
  }

  useEffect(() => { load(); }, [load]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.inner}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
      }
    >
      {/* greeting */}
      <View style={styles.greet}>
        <Text style={styles.greetSub}>האלגוריתם שחזר בתשובה</Text>
        <Text style={styles.greetTitle}>שלום, הנה מה שקרה היום</Text>
      </View>

      {/* greeting card */}
      <View style={styles.moodCard}>
        <Text style={styles.moodIcon}>👋</Text>
        <View style={styles.moodText}>
          <Text style={styles.moodLabel}>ברכה</Text>
          <Text style={styles.moodValue}>{greeting}</Text>
        </View>
      </View>

      {/* quick stats */}
      <View style={styles.statsRow}>
        <StatCard value={stats.totalSeen}              label="נראו"       accent={false} />
        <StatCard value={stats.dismissedTotal}          label="הוסרו"      accent />
        <StatCard value={`${stats.dismissalRatePct}%`}  label="אחוז הסרה" accent={false} />
      </View>

      {/* quick actions */}
      <Text style={styles.sectionTitle}>פעולות מהירות</Text>
      <View style={styles.actions}>
        <ActionCard
          icon="👁"
          label="הסבר פוסט"
          sub="הדבק טקסט לניתוח"
          onPress={() => navigation.navigate('Explain')}
        />
        <ActionCard
          icon="📊"
          label="תובנות שבועיות"
          sub="ראה את פילוח הפיד"
          onPress={() => navigation.navigate('Insights')}
        />
        <ActionCard
          icon="⚙️"
          label="הגדרות"
          sub="התנהגות, איפוס"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* category breakdown preview */}
      <Text style={styles.sectionTitle}>פילוח</Text>
      <View style={styles.catCard}>
        {stats.breakdown.length === 0 ? (
          <Text style={styles.emptyText}>
            עוד לא צברת מספיק נתונים. נסה "הסבר פוסט" עם טקסט אמיתי כדי להתחיל.
          </Text>
        ) : (
          stats.breakdown.map(item => (
            <View key={item.id} style={styles.catRow}>
              <Text style={styles.catLabel}>{item.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {width: `${item.pct}%`, backgroundColor: item.color}]} />
              </View>
              <Text style={[styles.catPct, {color: item.color}]}>{item.pct}%</Text>
            </View>
          ))
        )}
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => navigation.navigate('Insights')}
        >
          <Text style={styles.moreBtnText}>תובנות מלאות ›</Text>
        </TouchableOpacity>
      </View>

      {/* confession quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteLabel}>CLIPPY · וידוי יומי</Text>
        <Text style={styles.quoteText}>
          "מהיום, כל החלטה שלי גלויה, מוסברת, וניתנת לערעור."
        </Text>
      </View>
    </ScrollView>
  );
}

function StatCard({value, label, accent}) {
  return (
    <View style={[styles.statCard, accent && styles.statCardAccent]}>
      <Text style={[styles.statVal, accent && {color: COLORS.accent}]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({icon, label, sub, onPress}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

// ── styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  root:  {flex: 1, backgroundColor: COLORS.bg},
  inner: {padding: 20, paddingBottom: 120},

  greet:      {marginBottom: 22},
  greetSub:   {fontFamily: FONTS.mono, fontSize: 11, color: COLORS.accent, textAlign: 'right', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4},
  greetTitle: {fontFamily: FONTS.serif, fontWeight: '900', fontSize: 26, color: COLORS.text, textAlign: 'right'},

  moodCard: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: 14,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 18, marginBottom: 16, ...SHADOW.card,
  },
  moodIcon:  {fontSize: 38},
  moodText:  {flex: 1},
  moodLabel: {fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textDim, textAlign: 'right', textTransform: 'uppercase'},
  moodValue: {fontSize: 16, fontWeight: '700', textAlign: 'right', marginTop: 2, color: COLORS.text},

  statsRow: {flexDirection: 'row', gap: 10, marginBottom: 24},
  statCard: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 14, alignItems: 'center',
  },
  statCardAccent: {backgroundColor: 'rgba(255,154,31,0.1)', borderColor: 'rgba(255,154,31,0.3)'},
  statVal:   {fontFamily: FONTS.mono, fontSize: 24, fontWeight: '700', color: COLORS.text},
  statLabel: {fontSize: 11, color: COLORS.textMuted, marginTop: 2},

  sectionTitle: {
    fontWeight: '700', fontSize: 14, color: COLORS.textMuted,
    textAlign: 'right', marginBottom: 12,
    fontFamily: FONTS.mono, letterSpacing: 0.5, textTransform: 'uppercase',
  },

  actions: {flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap'},
  actionCard: {
    flex: 1, minWidth: 90,
    backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 14, alignItems: 'center',
  },
  actionIcon:  {fontSize: 24, marginBottom: 6},
  actionLabel: {fontWeight: '700', fontSize: 13, color: COLORS.text, textAlign: 'center'},
  actionSub:   {fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 2},

  catCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 18, marginBottom: 22, gap: 12,
  },
  catRow:    {flexDirection: 'row', alignItems: 'center', gap: 12},
  catLabel:  {width: 80, fontSize: 14, color: COLORS.textMuted, textAlign: 'right'},
  barTrack:  {flex: 1, height: 8, backgroundColor: 'rgba(236,233,225,0.07)', borderRadius: 99, overflow: 'hidden'},
  barFill:   {height: '100%', borderRadius: 99},
  catPct:    {fontFamily: FONTS.mono, fontSize: 12, width: 34, textAlign: 'left'},
  moreBtn:   {marginTop: 6, alignSelf: 'flex-end'},
  moreBtnText:{color: COLORS.accent, fontWeight: '700', fontSize: 13},
  emptyText: {fontSize: 14, color: COLORS.textMuted, textAlign: 'right', lineHeight: 20},

  quoteCard: {
    backgroundColor: 'rgba(255,154,31,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,154,31,0.2)',
    borderRadius: RADIUS.lg, padding: 20,
  },
  quoteLabel: {fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent, textAlign: 'right', textTransform: 'uppercase', marginBottom: 8},
  quoteText: {fontFamily: FONTS.serif, fontSize: 18, lineHeight: 28, color: COLORS.text, textAlign: 'right', fontStyle: 'italic'},
});
