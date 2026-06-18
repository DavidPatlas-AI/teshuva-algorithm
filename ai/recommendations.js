import { CATEGORIES } from '../brain/categories.js'

/**
 * ai/recommendations.js — Smart recommendations for questions, explanations, mood
 */

/**
 * recommendQuestion(categoryId, context, stats) → { text, answers } | null
 * Returns the most relevant question to ask based on context.
 */
export function recommendQuestion(categoryId, context, stats) {
  const { allTime = {}, weights = {} } = stats
  const count    = allTime[categoryId]  ?? 0
  const weight   = weights[categoryId] ?? 1.0
  const label    = CATEGORIES[categoryId]?.heLabel ?? categoryId
  const dominant = getDominant(allTime)

  if (count === 0) {
    return {
      text: `זה הפוסט הראשון שלך על ${label} — רלוונטי לך?`,
      answers: { yes: `טוב לדעת! אראה לך יותר ${label}.`, no: `הבנתי, אפחית ${label} בהסברים שלי.` }
    }
  }

  if (weight >= 1.5) {
    return {
      text: `${label} מופיעה הרבה בפיד שלך — זה מה שאתה מחפש?`,
      answers: { yes: `מצוין! ממשיך לעקוב.`, no: `אנסה להסביר פחות ${label}.` }
    }
  }

  if (dominant === categoryId) {
    return {
      text: `${label} שולטת ב-${Math.round((count / total(allTime)) * 100)}% מהפיד שלך. בסדר?`,
      answers: { yes: `הבנתי, ממשיך.`, no: `אסמן זאת — האלגוריתם מגזים עם ${label}.` }
    }
  }

  return null
}

/**
 * recommendExplanation(intent, context) → string
 * Returns a more personalized explanation based on context.
 */
export function recommendExplanation(intent, context) {
  const { dominant } = context
  if (!dominant) return intent.heText

  if (dominant[0] === intent.categoryId) {
    return `${intent.heText} — וזה נושא מוביל בגלישה שלך לאחרונה.`
  }
  return intent.heText
}

/**
 * recommendMood(categoryId, weights) → mood string
 */
export function recommendMood(categoryId, weights = {}) {
  const w = weights[categoryId] ?? 1.0
  if (w >= 1.8) return 'excited'
  if (w <= 0.4) return 'confused'
  return 'think'
}

// ── Internal ────────────────────────────────────────────────

function getDominant(allTime) {
  let best = null, bestN = 0
  for (const [k, n] of Object.entries(allTime)) {
    if (n > bestN) { bestN = n; best = k }
  }
  return best
}

function total(allTime) {
  return Object.values(allTime).reduce((s, n) => s + n, 0) || 1
}
