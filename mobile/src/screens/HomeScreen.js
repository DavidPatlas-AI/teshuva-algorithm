import React, {useEffect, useState} from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import {brainService} from '../services/BrainService';
import {COLORS, FONTS, RADIUS, SHADOW} from '../styles/theme';

const MOOD_ICON  = {positive: '😊', neutral: '😐', negative: '😕', unknown: '🤔'};
const MOOD_COLOR = {positive: '#4caf50', neutral: COLORS.accent, negative: COLORS.danger, unknown: COLORS.textMuted};

export default function HomeScreen({navigation}) {
  const [stats, setStats]       = useState(null);
  const [mood,  setMood]        = useState(null);
  const [refreshing, setRef]    = useState(false);

  async function load() {
    const [s, m] = await Promise.all([
      brainService.loadStats(),
      brainService.loadMood(),
    ]);
    setStats(s ?? MOCK_STATS);
    setMood(m ?? MOCK_MOOD);
  }

  async function onRefresh() {
    setRef(true);
    await load();
    setRef(false);
  }

  useEffect(() => { load(); }, []);

  const s = stats ?? MOCK_STATS;
  const moodKey = mood?.mood ?? 'unknown';

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

      {/* mood card */}
      <View style={styles.moodCard}>
        <Text style={styles.moodIcon}>{MOOD_ICON[moodKey]}</Text>
        <View style={styles.moodText}>
          <Text style={styles.moodLabel}>מצב האלגוריתם</Text>
          <Text style={[styles.moodValue, {color: MOOD_COLOR[moodKey]}]}>
            {mood?.description ?? 'ממתין לנתונים…'}
          </Text>
        </View>
      </View>

      {/* quick stats */}
      <View style={styles.statsRow}>
        <StatCard value={s.totalSeen  ?? 0} label="נראו"       accent={false} />
        <StatCard value={s.dismissed  ?? 0} label="הוסרו"      accent />
        <StatCard value={`${s.accuracy ?? 0}%`} label="דיוק"   accent={false} />
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
          sub="API, סף מחיקה"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* category breakdown preview */}
      {s.breakdown && (
        <>
          <Text style={styles.sectionTitle}>פילוח השבוע</Text>
          <View style={styles.catCard}>
            {s.breakdown.map(item => (
              <View key={item.label} style={styles.catRow}>
                <Text style={styles.catLabel}>{item.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, {width: `${item.pct}%`, backgroundColor: item.color ?? COLORS.accent}]} />
                </View>
                <Text style={[styles.catPct, {color: item.color ?? COLORS.accent}]}>{item.pct}%</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.moreBtn}
              onPress={() => navigation.navigate('Insights')}
            >
              <Text style={styles.moreBtnText}>תובנות מלאות ›</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

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

// ── mock data shown while API is offline ───────────────
const MOCK_STATS = {
  totalSeen: 342, dismissed: 87, accuracy: 91,
  breakdown: [
    {label: 'פוליטיקה', pct: 47, color: COLORS.accent},
    {label: 'ספורט',    pct: 21, color: '#e7842a'},
    {label: 'טכנולוגיה',pct: 18, color: '#b9772f'},
    {label: 'אחר',      pct: 14, color: '#6f6a60'},
  ],
};
const MOCK_MOOD = {mood: 'neutral', description: 'מנטר בשקיפות מלאה'};

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
  moodValue: {fontSize: 16, fontWeight: '700', textAlign: 'right', marginTop: 2},

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

  quoteCard: {
    backgroundColor: 'rgba(255,154,31,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,154,31,0.2)',
    borderRadius: RADIUS.lg, padding: 20,
  },
  quoteLabel: {fontFamily: FONTS.mono, fontSize: 9, color: COLORS.accent, textAlign: 'right', textTransform: 'uppercase', marginBottom: 8},
  quoteText: {fontFamily: FONTS.serif, fontSize: 18, lineHeight: 28, color: COLORS.text, textAlign: 'right', fontStyle: 'italic'},
});
