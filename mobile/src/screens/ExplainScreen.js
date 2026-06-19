import React, {useState, useEffect} from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import {useBrainApi} from '../hooks/useBrainApi';
import {COLORS, FONTS, RADIUS, SHADOW} from '../styles/theme';

export default function ExplainScreen() {
  const [content, setContent]     = useState('');
  const [result,  setResult]      = useState(null);
  const {explain, loading, error} = useBrainApi();

  async function onExplain() {
    if (!content.trim()) return;
    const data = await explain(content.trim());
    if (data) setResult(data);
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>למה אני רואה את זה?</Text>
      <Text style={styles.sub}>הדבק כאן טקסט מפוסט כלשהו — קליפי יסביר.</Text>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={5}
          value={content}
          onChangeText={setContent}
          placeholder="הכנס תוכן לניתוח…"
          placeholderTextColor={COLORS.textDim}
          textAlign="right"
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, !content.trim() && styles.btnDisabled]}
        onPress={onExplain}
        disabled={loading || !content.trim()}
      >
        {loading
          ? <ActivityIndicator color={COLORS.dark} />
          : <Text style={styles.btnText}>נתח עם קליפי ›</Text>
        }
      </TouchableOpacity>

      {error && <Text style={styles.error}>שגיאה: {error}</Text>}

      {result && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CLIPPY EXPLAINS</Text>
          <Text style={styles.cardTitle}>{result.category ?? 'לא מזוהה'}</Text>
          <Text style={styles.cardBody}>{result.explanation ?? JSON.stringify(result, null, 2)}</Text>

          {result.signals && (
            <>
              <Text style={styles.signalsTitle}>אותות שזוהו:</Text>
              {result.signals.map((s, i) => (
                <View key={i} style={styles.signalRow}>
                  <Text style={styles.signalPct}>{s.weight ?? '—'}</Text>
                  <View style={styles.signalBar}>
                    <View style={[styles.signalFill, {width: `${(s.score ?? 0) * 100}%`}]} />
                  </View>
                  <Text style={styles.signalLabel}>{s.label ?? s.name}</Text>
                </View>
              ))}
            </>
          )}

          <View style={styles.feedbackRow}>
            <TouchableOpacity style={styles.fbBtn}>
              <Text style={styles.fbBtnText}>👍 מדויק</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.fbBtn, styles.fbBtnAlt]}>
              <Text style={[styles.fbBtnText, styles.fbBtnAltText]}>👎 פספוס</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root:   {flex: 1, backgroundColor: COLORS.bg},
  inner:  {padding: 20, paddingBottom: 40},
  title:  {
    fontFamily: FONTS.serif,
    fontWeight: '900',
    fontSize:   28,
    color:      COLORS.text,
    textAlign:  'right',
    marginBottom: 6,
  },
  sub: {
    fontSize: 15, color: COLORS.textMuted,
    textAlign: 'right', marginBottom: 20,
  },
  inputWrap: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.md,
    borderWidth:     1,
    borderColor:     COLORS.border,
    marginBottom:    14,
    padding:         4,
  },
  input: {
    color:   COLORS.text,
    fontSize: 15,
    padding:  12,
    minHeight: 110,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: COLORS.accent,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    alignItems:      'center',
    marginBottom:    18,
    ...SHADOW.card,
  },
  btnDisabled: {opacity: 0.45},
  btnText: {
    fontWeight: '800', fontSize: 16,
    color: COLORS.dark,
  },
  error: {color: COLORS.danger, textAlign: 'right', marginBottom: 10},
  card: {
    backgroundColor: COLORS.surface,
    borderRadius:    RADIUS.lg,
    borderWidth:     1,
    borderColor:     'rgba(255,154,31,0.25)',
    padding:         20,
  },
  cardLabel: {
    fontFamily: FONTS.mono, fontSize: 10,
    color: COLORS.accent, textTransform: 'uppercase',
    textAlign: 'right', marginBottom: 4,
  },
  cardTitle: {
    fontFamily: FONTS.serif, fontWeight: '700',
    fontSize: 22, color: COLORS.text,
    textAlign: 'right', marginBottom: 10,
  },
  cardBody: {
    fontSize: 15, color: COLORS.textMuted,
    lineHeight: 22, textAlign: 'right',
    marginBottom: 16,
  },
  signalsTitle: {
    fontWeight: '700', fontSize: 13,
    color: COLORS.text, textAlign: 'right',
    marginBottom: 8,
  },
  signalRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 7,
  },
  signalPct: {
    fontFamily: FONTS.mono, fontSize: 12,
    color: COLORS.accent, width: 38, textAlign: 'left',
  },
  signalBar: {
    flex: 1, height: 8,
    backgroundColor: 'rgba(236,233,225,0.07)',
    borderRadius: 99, overflow: 'hidden',
  },
  signalFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 99,
  },
  signalLabel: {
    fontSize: 13, color: COLORS.textMuted,
    width: 80, textAlign: 'right',
  },
  feedbackRow: {
    flexDirection: 'row', gap: 10, marginTop: 16,
  },
  fbBtn: {
    flex: 1, backgroundColor: 'rgba(255,154,31,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,154,31,0.3)',
    borderRadius: RADIUS.sm,
    paddingVertical: 10, alignItems: 'center',
  },
  fbBtnAlt: {
    backgroundColor: 'rgba(236,233,225,0.04)',
    borderColor: COLORS.border,
  },
  fbBtnText: {fontWeight: '700', fontSize: 14, color: COLORS.accent},
  fbBtnAltText: {color: COLORS.textMuted},
});
