import { CATEGORIES, CATEGORY_IDS } from './categories.js'

// אורך מינימלי לטקסט שמגיע לסיווג — טקסט קצר מדי לא אמין
const MIN_TEXT_LENGTH = 15

// חשב ציון לכל קטגוריה לפי כמות מילות מפתח שנמצאו בטקסט
export function scoreText(text) {
  if (!text || text.length < MIN_TEXT_LENGTH) return {}

  const lower = text.toLowerCase()
  const scores = {}

  for (const id of CATEGORY_IDS) {
    const { keywords } = CATEGORIES[id]
    let score = 0
    for (const kw of keywords.he) if (lower.includes(kw)) score++
    for (const kw of keywords.en) if (lower.includes(kw.toLowerCase())) score++
    if (score > 0) scores[id] = score
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
