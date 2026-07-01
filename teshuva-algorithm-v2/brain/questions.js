// Factory — כל caller מקבל instance משלו, אפס module-level state

import { getCategory }                      from './categories.js'
import { ASK_AFTER_COUNT, ASK_COOLDOWN_MS } from '../shared/constants.js'

export function createQuestions() {
  let lastAskedAt = 0
  const asked     = new Set()

  return {
    // האם הגיע הזמן לשאול על קטגוריה זו?
    shouldAsk(categoryId, sessionCount) {
      if (sessionCount < ASK_AFTER_COUNT)           return false
      if (asked.has(categoryId))                     return false
      if (Date.now() - lastAskedAt < ASK_COOLDOWN_MS) return false
      return true
    },

    // סמן ששאלנו
    markAsked(categoryId) {
      asked.add(categoryId)
      lastAskedAt = Date.now()
    },

    // בנה שאלה מוכנה להצגה
    build(categoryId) {
      const cat = getCategory(categoryId)
      if (!cat) return null

      const label = cat.heLabel
      return {
        text: `אני רואה שאתה נחשף הרבה ל${label}. האם זה מעניין אותך? לחץ + כן / - לא`,
        categoryId,
        answers: {
          yes: `תודה! אסמן שאתה אוהב ${label}.`,
          no:  `הבנתי, אנסה לזהות פחות ${label} בעתיד.`,
        },
      }
    },

    // "למה אני רואה את זה?" — הסבר ידני על בקשה
    whyDoISeeThis(categoryId, allTimeStats) {
      const cat = getCategory(categoryId)
      if (!cat) return 'לא הצלחתי לזהות את הנושא.'

      const label = cat.heLabel
      const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1
      const pct   = Math.round((allTimeStats[categoryId] ?? 0) / total * 100)

      if (pct === 0)  return `האלגוריתם מנסה להציג לך ${label} לראות אם זה מעניין.`
      if (pct >= 50)  return `${pct}% מהתוכן שלך הוא ${label}. האלגוריתם מאמין שזה הנושא שלך!`
      if (pct >= 20)  return `${label} מהווה ${pct}% מהפיד שלך. אתה נחשף לזה לעיתים קרובות.`
      return `${label} מופיע ב-${pct}% מהתוכן שלך. האלגוריתם עדיין לומד את הטעם שלך.`
    },
  }
}
