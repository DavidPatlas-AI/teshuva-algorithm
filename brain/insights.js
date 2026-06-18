import { CATEGORIES } from './categories.js'

// Thresholds
const DOMINANT_PCT   = 0.40
const RECURRING_PCT  = 0.15
const HIGH_WEIGHT    = 1.5
const LOW_WEIGHT     = 0.5
const BINGE_SESSIONS = 3

/**
 * buildWeeklyInsights(stats) → string[]
 * Returns 3–6 Hebrew insight strings based on allTime stats + weights.
 */
export function buildWeeklyInsights(stats) {
  const { allTime = {}, weights = {} } = stats
  const total = Object.values(allTime).reduce((s, n) => s + n, 0)
  if (total === 0) return ['עוד לא צברת מספיק נתונים — המשך לגלוש!']

  const insights = []

  // 1. Dominant category
  const dominant = detectDominant(allTime, total)
  if (dominant) {
    const pct = Math.round((allTime[dominant] / total) * 100)
    const label = CATEGORIES[dominant]?.heLabel ?? dominant
    insights.push(`📊 ${label} שולטת ב-${pct}% מהפיד שלך השבוע`)
  }

  // 2. Explicitly liked category
  const loved = Object.entries(weights)
    .filter(([, w]) => w >= HIGH_WEIGHT)
    .sort(([, a], [, b]) => b - a)[0]
  if (loved) {
    const label = CATEGORIES[loved[0]]?.heLabel ?? loved[0]
    insights.push(`❤️ אתה מעדיף תוכן על ${label} — Clippy ישים לב לזה יותר`)
  }

  // 3. Category you rarely engage with but see a lot
  const neglected = detectNeglected(allTime, weights, total)
  if (neglected) {
    const label = CATEGORIES[neglected]?.heLabel ?? neglected
    insights.push(`🤔 ${label} תופסת מקום בפיד שלך אבל אתה לא מגיב עליה — אולי פחות מעניין אותך?`)
  }

  // 4. Variety score
  const activeCategories = Object.keys(allTime).filter(k => allTime[k] > 0).length
  if (activeCategories >= 6) {
    insights.push(`🌈 הפיד שלך מגוון — ${activeCategories} קטגוריות שונות השבוע`)
  } else if (activeCategories <= 2) {
    insights.push(`🎯 הפיד שלך ממוקד מאוד — בעיקר ${activeCategories} נושאים`)
  }

  // 5. Binge pattern
  const binge = detectBinge(allTime, total)
  if (binge) {
    const label = CATEGORIES[binge]?.heLabel ?? binge
    insights.push(`⚡ נראה שבזמן האחרון צרכת הרבה ${label} בבת אחת`)
  }

  // 6. Positive trend
  const improving = Object.entries(weights)
    .filter(([, w]) => w < LOW_WEIGHT)
    .map(([k]) => CATEGORIES[k]?.heLabel ?? k)
  if (improving.length > 0) {
    insights.push(`✂️ הפחתת חשיפה ל-${improving.slice(0, 2).join(' ו-')} — בחירה מודעת!`)
  }

  return insights.slice(0, 6)
}

/**
 * summarizeBehavior(stats) → { dominant, variety, avgWeight }
 */
export function summarizeBehavior(stats) {
  const { allTime = {}, weights = {} } = stats
  const total = Object.values(allTime).reduce((s, n) => s + n, 0)
  if (total === 0) return { dominant: null, variety: 0, avgWeight: 1.0 }

  const dominant = detectDominant(allTime, total)
  const variety = Object.keys(allTime).filter(k => allTime[k] > 0).length
  const allWeights = Object.values(weights)
  const avgWeight = allWeights.length
    ? allWeights.reduce((s, w) => s + w, 0) / allWeights.length
    : 1.0

  return { dominant, variety, avgWeight: Math.round(avgWeight * 100) / 100 }
}

/**
 * detectPatterns(stats) → { type, categoryId }[]
 */
export function detectPatterns(stats) {
  const { allTime = {}, weights = {} } = stats
  const total = Object.values(allTime).reduce((s, n) => s + n, 0)
  if (total === 0) return []

  const patterns = []

  for (const [catId, count] of Object.entries(allTime)) {
    const pct = count / total
    const weight = weights[catId] ?? 1.0

    if (pct >= DOMINANT_PCT)   patterns.push({ type: 'dominant',   categoryId: catId })
    else if (pct >= RECURRING_PCT) patterns.push({ type: 'recurring',  categoryId: catId })

    if (weight >= HIGH_WEIGHT) patterns.push({ type: 'loved',      categoryId: catId })
    if (weight <= LOW_WEIGHT && count > 0)  patterns.push({ type: 'disliked',  categoryId: catId })
  }

  return patterns
}

// ── Internal helpers ─────────────────────────────────────────

function detectDominant(allTime, total) {
  let best = null, bestPct = 0
  for (const [k, n] of Object.entries(allTime)) {
    const pct = n / total
    if (pct > bestPct) { bestPct = pct; best = k }
  }
  return bestPct >= RECURRING_PCT ? best : null
}

function detectNeglected(allTime, weights, total) {
  for (const [k, n] of Object.entries(allTime)) {
    const pct = n / total
    const weight = weights[k] ?? 1.0
    if (pct >= RECURRING_PCT && weight <= LOW_WEIGHT) return k
  }
  return null
}

function detectBinge(allTime, total) {
  const entries = Object.entries(allTime).sort(([, a], [, b]) => b - a)
  if (!entries.length) return null
  const [k, n] = entries[0]
  return n >= BINGE_SESSIONS && n / total >= DOMINANT_PCT ? k : null
}
