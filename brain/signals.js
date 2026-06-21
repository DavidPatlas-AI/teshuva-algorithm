// signals.js — מחשב 3 אותות נפרדים לכל פוסט
// במקום "47% מהפיד שלך" — מחזיר פירוק אמיתי של מה שגרם להמלצה

/**
 * מחזיר מערך של עד 3 אותות עם label + value (0-100)
 * @param {string} categoryId
 * @param {{ [id: string]: number }} allTimeStats
 * @param {{ [id: string]: number }} weights
 * @param {{ [id: string]: number }} sessionStats
 * @returns {{ label: string, value: number, type: 'positive'|'neutral'|'negative' }[]}
 */
export function buildSignals(categoryId, allTimeStats, weights, sessionStats = {}) {
  const signals = []

  const total    = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1
  const count    = allTimeStats[categoryId] ?? 0
  const pct      = Math.round(count / total * 100)
  const weight   = weights?.[categoryId] ?? 1.0
  const sesCount = sessionStats[categoryId] ?? 0

  // ── אות 1: היסטוריה אישית (כמה % מהתוכן שלך בקטגוריה) ────────
  const historyScore = Math.min(100, pct * 2)  // 50% בפיד → 100 נקודות
  signals.push({
    label: 'צפייה קודמת',
    value: historyScore,
    type:  historyScore > 50 ? 'negative' : historyScore > 20 ? 'neutral' : 'positive',
  })

  // ── אות 2: משקל עניין — מבוסס על פידבק 👍/👎 ───────────────────
  // weight: 1.0 = ברירת מחדל, > 1.5 = חיובי, < 0.5 = שלילי
  const interestScore = Math.round(((weight - 0.1) / 2.9) * 100)
  signals.push({
    label: 'עניין מפורש',
    value: Math.max(0, Math.min(100, interestScore)),
    type:  weight >= 1.5 ? 'positive' : weight <= 0.5 ? 'negative' : 'neutral',
  })

  // ── אות 3: תדירות בסשן הנוכחי ────────────────────────────────
  const sessionScore = Math.min(100, sesCount * 12)
  signals.push({
    label: 'תדירות היום',
    value: sessionScore,
    type:  sessionScore > 60 ? 'negative' : 'neutral',
  })

  return signals
}
