import { CATEGORY_IDS } from './categories.js'

// ערכי ברירת מחדל
const DEFAULT_WEIGHT = 1.0
const MAX_WEIGHT = 3.0
const MIN_WEIGHT = 0.1
const WEIGHT_POSITIVE_DELTA = 0.15
const WEIGHT_NEGATIVE_DELTA = 0.08

// מקש האחסון — שם אחד שכולם מסכימים עליו
const STORAGE_KEY = 'teshuva_state'

// מפתח אחסון מחזיר { get(key), set(key, value) } — Promise בשני הכיוונים
// כך אותו קוד עובד ב-Chrome extension וב-Electron
export function createState(storageAdapter) {
  // state בזיכרון
  const session = {}
  const allTime = {}
  const weights = {}

  // אתחול ערכי ברירת מחדל לכל הקטגוריות
  function initDefaults() {
    for (const id of CATEGORY_IDS) {
      session[id] = 0
      allTime[id] = allTime[id] ?? 0
      weights[id] = weights[id] ?? DEFAULT_WEIGHT
    }
  }

  // שמור allTime ו-weights לאחסון — session לא נשמר (מאופס בכל הפעלה)
  async function persist() {
    await storageAdapter.set(STORAGE_KEY, { allTime: { ...allTime }, weights: { ...weights } })
  }

  return {
    // טען נתונים שמורים מהאחסון
    async load() {
      const saved = await storageAdapter.get(STORAGE_KEY)
      if (saved?.allTime) Object.assign(allTime, saved.allTime)
      if (saved?.weights) Object.assign(weights, saved.weights)
      initDefaults()
    },

    // רשום צפייה בקטגוריה
    observe(categoryId) {
      session[categoryId] = (session[categoryId] ?? 0) + 1
      allTime[categoryId] = (allTime[categoryId] ?? 0) + 1
      persist()
    },

    // המשתמש הראה עניין (לחץ, שיתף, אהב)
    positiveSignal(categoryId) {
      weights[categoryId] = Math.min(MAX_WEIGHT, (weights[categoryId] ?? DEFAULT_WEIGHT) + WEIGHT_POSITIVE_DELTA)
      persist()
    },

    // המשתמש דילג מהר
    negativeSignal(categoryId) {
      weights[categoryId] = Math.max(MIN_WEIGHT, (weights[categoryId] ?? DEFAULT_WEIGHT) - WEIGHT_NEGATIVE_DELTA)
      persist()
    },

    // קריאת נתוני הסשן הנוכחי
    getSessionStats() { return { ...session } },

    // קריאת נתונים מצטברים מכל הזמן
    getAllTimeStats() { return { ...allTime } },

    // קריאת משקלות העניין של המשתמש
    getWeights() { return { ...weights } },

    // סה"כ פוסטים שנצפו בסשן הזה
    getSessionTotal() {
      return Object.values(session).reduce((sum, n) => sum + n, 0)
    },

    // מחק את כל הנתונים
    async reset() {
      for (const id of CATEGORY_IDS) {
        session[id] = 0
        allTime[id] = 0
        weights[id] = DEFAULT_WEIGHT
      }
      await storageAdapter.set(STORAGE_KEY, null)
    },
  }
}
