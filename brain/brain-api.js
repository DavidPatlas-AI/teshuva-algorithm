// ה-API הציבורי של המוח — זה הקובץ היחיד שקוד חיצוני מייבא
// brain/, classifier, state, explanations — פנימיים, לא לייבא ישירות

import { classify, scoreText }               from './classifier.js'
import { createState }                        from './state.js'
import { greeting, explain, weeklyInsights }  from './explanations.js'
import { buildIntent }                        from './intent.js'
import { buildSignals }                       from './signals.js'
import { CATEGORIES, CATEGORY_IDS }           from './categories.js'

// storageAdapter: { get(key) → Promise<any>, set(key, value) → Promise<void> }
// ראה brain/adapters/ לדוגמאות מימוש
export function createBrain(storageAdapter) {
  const state = createState(storageAdapter)

  return {
    // טען state שמור — לקרוא פעם אחת בהפעלה
    load() {
      return state.load()
    },

    // רשום פוסט חדש שנצפה — מחזיר את הקטגוריה
    observe(text) {
      const categoryId = classify(text)
      if (categoryId !== 'uncategorized') state.observe(categoryId)
      return categoryId
    },

    // הסבר קצר למה המשתמש רואה תוכן של קטגוריה זו
    explain(categoryId) {
      return explain(categoryId, state.getAllTimeStats())
    },

    // הסבר עמוק — סוג הכוונה + אחוז + טקסט מפורט
    intent(categoryId) {
      return buildIntent(categoryId, state.getAllTimeStats(), state.getWeights())
    },

    // 3 אותות מספריים לbadge הסבר ויזואלי
    signals(categoryId) {
      return buildSignals(categoryId, state.getAllTimeStats(), state.getWeights(), state.getSessionStats())
    },

    // ברכה לפי שעה
    greeting() {
      return greeting()
    },

    // תובנות שבועיות — מחרוזות לטאב "תובנות" בפופ-אפ
    weeklyInsights(historyStats) {
      return weeklyInsights(state.getAllTimeStats(), historyStats)
    },

    // כל הסטטיסטיקות — לפופ-אפ
    getStats() {
      return {
        session:        state.getSessionStats(),
        allTime:        state.getAllTimeStats(),
        weights:        state.getWeights(),
        dismissed:      state.getDismissed(),
        dismissedTotal: state.getDismissedTotal(),
        total:          state.getSessionTotal(),
        categories:     CATEGORIES,
        ids:            CATEGORY_IDS,
      }
    },

    // המשתמש הראה עניין חיובי בתוכן
    positive(categoryId) {
      state.positiveSignal(categoryId)
    },

    // המשתמש דילג מהר
    negative(categoryId) {
      state.negativeSignal(categoryId)
    },

    // פוסט הוסר בפועל ע"י מנוע הפעולות — לספירה בפופ-אפ
    recordDismiss(categoryId) {
      state.dismissSignal(categoryId)
    },

    // מחק את כל הנתונים
    reset() {
      return state.reset()
    },

    // כלי עזר לדיבוג — ניקוד הטקסט בלי לשמור
    debug: {
      score: scoreText,
      classify,
    },
  }
}
