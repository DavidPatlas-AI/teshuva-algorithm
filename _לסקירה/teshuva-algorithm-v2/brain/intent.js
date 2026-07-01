// intent.js — "למה בעצם" מאחורי כל הסבר
// מחזיר אובייקט מובנה שמאפשר הסברים עמוקים יותר מ-explain()

import { getCategory } from './categories.js'

// סוגי כוונה — מה גרם לאלגוריתם להציג את התוכן הזה
export const INTENT_TYPE = {
  DOMINANT:   'dominant',    // > 40% מהפיד
  RECURRING:  'recurring',   // 15–40%
  FIRST_TIME: 'first-time',  // 0 פוסטים קודמים
  TEST:       'test',        // האלגוריתם מנסה את המשתמש
  EXPLICIT:   'explicit',    // המשתמש לחץ 👍 בעבר
}

/**
 * בנה Intent object לקטגוריה
 * @param {string} categoryId
 * @param {{ [id: string]: number }} allTimeStats
 * @param {{ [id: string]: number }} weights
 * @returns {Intent}
 */
export function buildIntent(categoryId, allTimeStats, weights) {
  const cat   = getCategory(categoryId)
  const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1
  const count = allTimeStats[categoryId] ?? 0
  const pct   = Math.round(count / total * 100)
  const weight = weights?.[categoryId] ?? 1.0

  const type = resolveType(count, pct, weight)

  return {
    type,
    categoryId,
    heLabel:    cat?.heLabel ?? categoryId,
    percentage: pct,
    weight,
    heText:     buildText(type, cat?.heLabel ?? categoryId, pct, weight),
  }
}

// ── helpers ──────────────────────────────────────────────────

function resolveType(count, pct, weight) {
  if (count === 0)   return INTENT_TYPE.FIRST_TIME
  if (weight >= 1.5) return INTENT_TYPE.EXPLICIT    // משוב חיובי מפורש
  if (pct >= 40)     return INTENT_TYPE.DOMINANT
  if (pct >= 15)     return INTENT_TYPE.RECURRING
  return INTENT_TYPE.TEST
}

function buildText(type, label, pct, weight) {
  switch (type) {
    case INTENT_TYPE.FIRST_TIME:
      return `זו הפעם הראשונה שאתה נחשף ל${label}. האלגוריתם מנסה אותך.`
    case INTENT_TYPE.EXPLICIT:
      return `אתה רואה ${label} כי הראית שזה מעניין אותך. האלגוריתם למד.`
    case INTENT_TYPE.DOMINANT:
      return `${label} שולט ב-${pct}% מהפיד שלך — האלגוריתם בטוח שזה מה שאתה רוצה.`
    case INTENT_TYPE.RECURRING:
      return `${label} מהווה ${pct}% מהתוכן שלך. נושא שחוזר, אבל לא שולט.`
    case INTENT_TYPE.TEST:
    default:
      return `${label} מופיע לפעמים (${pct}% מהפיד). האלגוריתם עדיין בודק אם זה מדויק עבורך.`
  }
}
