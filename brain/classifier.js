import { CATEGORIES, CATEGORY_IDS } from './categories.js'

const MIN_TEXT_LENGTH   = 15
const MIN_SCORE_TO_CLASSIFY = 2   // ציון מינימלי — מונע סיווג ממילה בודדת קצרה

// חשב ציון לכל קטגוריה לפי terms עם משקלות
export function scoreText(text) {
  if (!text || text.length < MIN_TEXT_LENGTH) return {}

  const lower  = text.toLowerCase()
  const scores = {}

  for (const id of CATEGORY_IDS) {
    const { terms } = CATEGORIES[id]
    let score = 0
    for (const { t, w } of terms) {
      if (lower.includes(t.toLowerCase())) score += w
    }
    if (score >= MIN_SCORE_TO_CLASSIFY) scores[id] = score
  }

  return scores
}

// מחזיר את הקטגוריה הכי חזקה, או "uncategorized" אם אין התאמה
export function classify(text) {
  const scores = scoreText(text)
  if (Object.keys(scores).length === 0) return 'uncategorized'

  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0][0]
}
