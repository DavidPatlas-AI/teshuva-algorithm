import React, {useState} from 'react';
import {
  View, Text, Switch, TextInput,
  TouchableOpacity, ScrollView, StyleSheet, Alert,
} from 'react-native';
import config from '../../config.json';
import {COLORS, FONTS, RADIUS} from '../styles/theme';

export default function SettingsScreen() {
  const [apiUrl,          setApiUrl]          = useState(config.brain_api);
  const [autoDismiss,     setAutoDismiss]      = useState(true);
  const [dismissThreshold,setDismissThreshold] = useState(String(config.auto_dismiss_threshold));
  const [intervalSec,    setIntervalSec]       = useState(String(config.clippy_messages_interval_ms / 1000));
  const [floatEnabled,   setFloatEnabled]      = useState(true);

  function onSave() {
    Alert.alert(
      'נשמר',
      'ההגדרות עודכנו. הפעל מחדש את האפליקציה כדי להחיל שינויים ב-API URL.',
      [{text: 'אוקיי'}],
    );
  }

  function onReset() {
    Alert.alert(
      'אפס העדפות',
      'כל הלמידה והמשקולות יאופסו. בטוח?',
      [
        {text: 'ביטול', style: 'cancel'},
        {text: 'אפס', style: 'destructive', onPress: () => {/* call brain.reset() */}},
      ],
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.inner}>
      <Text style={styles.title}>הגדרות</Text>

      <Section label="חיבור ל‑Brain API">
        <Row label="כתובת שרת">
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="http://localhost:3000/api"
            placeholderTextColor={COLORS.textDim}
          />
        </Row>
      </Section>

      <Section label="התנהגות">
        <Row label="מחיקה אוטומטית">
          <Switch
            value={autoDismiss}
            onValueChange={setAutoDismiss}
            thumbColor={autoDismiss ? COLORS.accent : COLORS.textDim}
            trackColor={{false: '#333', true: 'rgba(255,154,31,0.5)'}}
          />
        </Row>
        <Row label="סף מחיקה (0–1)">
          <TextInput
            style={[styles.input, styles.inputNarrow]}
            value={dismissThreshold}
            onChangeText={setDismissThreshold}
            keyboardType="decimal-pad"
          />
        </Row>
        <Row label="אינטרוול הודעות (שניות)">
          <TextInput
            style={[styles.input, styles.inputNarrow]}
            value={intervalSec}
            onChangeText={setIntervalSec}
            keyboardType="number-pad"
          />
        </Row>
      </Section>

      <Section label="Overlay">
        <Row label="הצג כפתור צף">
          <Switch
            value={floatEnabled}
            onValueChange={setFloatEnabled}
            thumbColor={floatEnabled ? COLORS.accent : COLORS.textDim}
            trackColor={{false: '#333', true: 'rgba(255,154,31,0.5)'}}
          />
        </Row>
      </Section>

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Text style={styles.saveBtnText}>שמור הגדרות</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
        <Text style={styles.resetBtnText}>אפס העדפות</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v0.1.0 · האלגוריתם שחזר בתשובה</Text>
    </ScrollView>
  );
}

function Section({label, children}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({label, children}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root:  {flex: 1, backgroundColor: COLORS.bg},
  inner: {padding: 20, paddingBottom: 40},
  title: {
    fontFamily: FONTS.serif, fontWeight: '900',
    fontSize: 28, color: COLORS.text,
    textAlign: 'right', marginBottom: 22,
  },
  section:     {marginBottom: 22},
  sectionTitle:{
    fontWeight: '700', fontSize: 13,
    color: COLORS.textMuted, textAlign: 'right',
    textTransform: 'uppercase',
    fontFamily: FONTS.mono, letterSpacing: 1,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, borderWidth: 1,
    borderColor: COLORS.border, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  rowLabel: {fontSize: 15, color: COLORS.text, textAlign: 'right'},
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: RADIUS.sm, borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text, fontSize: 14,
    paddingHorizontal: 10, paddingVertical: 7,
    flex: 1, textAlign: 'left',
    fontFamily: FONTS.mono,
  },
  inputNarrow: {flex: 0, width: 80},
  saveBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12,
  },
  saveBtnText: {fontWeight: '800', fontSize: 16, color: COLORS.dark},
  resetBtn: {
    borderWidth: 1, borderColor: COLORS.danger,
    borderRadius: RADIUS.md, paddingVertical: 12,
    alignItems: 'center', marginBottom: 24,
  },
  resetBtnText: {fontWeight: '700', fontSize: 14, color: COLORS.danger},
  version: {
    fontFamily: FONTS.mono, fontSize: 11,
    color: COLORS.textDim, textAlign: 'center',
  },
});
