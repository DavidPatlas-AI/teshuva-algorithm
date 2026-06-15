// שאלות שקליפי שואל את המשתמש כדי ללמוד את ההעדפות שלו

import { getCategory } from './categories.js'

// אחרי כמה פוסטים בקטגוריה — לשאול את המשתמש
const ASK_AFTER_COUNT = 5

// כמה זמן לחכות בין שאלות (מילישניות)
const ASK_COOLDOWN_MS = 5 * 60 * 1000

let lastAskedAt = 0
const askedCategories = new Set()

// האם הגיע הזמן לשאול על קטגוריה זו?
export function shouldAsk(categoryId, sessionCount) {
  if (sessionCount < ASK_AFTER_COUNT) return false
  if (askedCategories.has(categoryId)) return false
  if (Date.now() - lastAskedAt < ASK_COOLDOWN_MS) return false
  return true
}

// סמן ששאלנו — כדי לא לחזור
export function markAsked(categoryId) {
  askedCategories.add(categoryId)
  lastAskedAt = Date.now()
}

// בנה שאלה למשתמש על קטגוריה מסוימת
export function buildQuestion(categoryId) {
  const cat = getCategory(categoryId)
  if (!cat) return null

  const label = cat.heLabel
  return {
    text: `אני רואה שאתה נחשף הרבה ל${label}. האם זה מעניין אותך? לחץ 👍 כן / 👎 לא`,
    categoryId,
    answers: {
      yes: `תודה! אסמן שאתה אוהב ${label}.`,
      no:  `הבנתי, אנסה לזהות פחות ${label} בעתיד.`,
    },
  }
}

// שאלת "למה אני רואה את זה?" — לחיצה ידנית
export function whyDoISeeThis(categoryId, allTimeStats) {
  const cat = getCategory(categoryId)
  if (!cat) return 'לא הצלחתי לזהות את הנושא.'

  const label = cat.heLabel
  const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1
  const count = allTimeStats[categoryId] || 0
  const pct   = Math.round(count / total * 100)

  if (pct === 0) return `האלגוריתם מנסה להציג לך ${label} לראות אם זה מעניין.`
  if (pct >= 50) return `${pct}% מהתוכן שלך הוא ${label}. האלגוריתם מאמין שזה הנושא שלך!`
  if (pct >= 20) return `${label} מהווה ${pct}% מהפיד שלך. אתה נחשף לזה לעיתים קרובות.`
  return `${label} מופיע ב-${pct}% מהתוכן שלך. האלגוריתם עדיין לומד את הטעם שלך.`
}
