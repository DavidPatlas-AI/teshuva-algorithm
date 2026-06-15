// גשר בין המוח (brain-api) לדמות (IMascot) — מחליט מתי לדבר ומה לומר

import { shouldAsk, markAsked, buildQuestion } from '../brain/questions.js'

// כמה שניות בין דיבורים רצופים
const SPEAK_COOLDOWN_MS = 9000

export function createMascotController(mascot, brain) {
  let lastSpokenAt = 0
  let pendingQuestion = null

  function canSpeak() {
    return Date.now() - lastSpokenAt > SPEAK_COOLDOWN_MS
  }

  function speak(text) {
    if (!canSpeak()) return
    lastSpokenAt = Date.now()
    mascot.say(text)
    mascot.animate()
  }

  return {
    // נקרא בהפעלה — ברכה
    async start() {
      await brain.load()
      setTimeout(() => {
        speak(brain.greeting())
      }, 800)
    },

    // נקרא כשפוסט חדש גולש — מחזיר קטגוריה
    onPostSeen(text) {
      const catId = brain.observe(text)
      if (catId === 'uncategorized') return catId

      // אחרי כמה פוסטים — שאל את המשתמש
      const stats = brain.getStats()
      const sessionCount = stats.session[catId] || 0

      if (shouldAsk(catId, sessionCount)) {
        const question = buildQuestion(catId)
        if (question && canSpeak()) {
          pendingQuestion = question
          markAsked(catId)
          lastSpokenAt = Date.now()
          mascot.say(question.text)
          mascot.animate()
        }
      } else if (canSpeak()) {
        lastSpokenAt = Date.now()
        setTimeout(() => mascot.say(brain.explain(catId)), 600)
        mascot.animate()
      }

      return catId
    },

    // תשובה חיובית מהמשתמש (👍)
    onPositive() {
      if (!pendingQuestion) return
      brain.positive(pendingQuestion.categoryId)
      speak(pendingQuestion.answers.yes)
      pendingQuestion = null
    },

    // תשובה שלילית מהמשתמש (👎)
    onNegative() {
      if (!pendingQuestion) return
      brain.negative(pendingQuestion.categoryId)
      speak(pendingQuestion.answers.no)
      pendingQuestion = null
    },

    // "למה אני רואה את זה?" — לחיצה ידנית
    onWhyClick(categoryId) {
      const { allTime } = brain.getStats()
      speak(brain.explain(categoryId))
    },

    // קבל את הסטטיסטיקות המלאות
    getStats() {
      return brain.getStats()
    },
  }
}
