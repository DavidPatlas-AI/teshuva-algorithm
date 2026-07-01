// גשר יחיד בין brain ↔ mascot ↔ user
// bundle-entry.js מייצר instance מזה ומפנה אליו הכל

import { createQuestions }           from '../brain/questions.js'
import { SPEAK_COOLDOWN_MS, ONBOARDING_KEY } from '../shared/constants.js'
import { pickMood, playMood }         from './animations.js'

export function createMascotController(mascot, brain) {
  const questions   = createQuestions()
  let lastSpokenAt  = 0
  let pendingQ      = null   // שאלה פתוחה שממתינה לתשובה

  function canSpeak() {
    return Date.now() - lastSpokenAt > SPEAK_COOLDOWN_MS
  }

  function speak(text, mood = 'idle') {
    if (!canSpeak()) return false
    lastSpokenAt = Date.now()
    playMood(mascot, mood)
    mascot.say(text)
    return true
  }

  return {
    // ── הפעלה ─────────────────────────────────────────────────
    async start() {
      await brain.load()

      // הודעת פתיחה — אחת מהשתיים
      const isNew = await new Promise(resolve =>
        chrome.storage.local.get(ONBOARDING_KEY, d => resolve(!d[ONBOARDING_KEY]))
      )

      if (isNew) {
        chrome.storage.local.set({ [ONBOARDING_KEY]: true })
        setTimeout(() => {
          speak('שלום! אני האלגוריתם שחזר בתשובה. אצפה במה שאתה רואה ואסביר למה.', 'greet')
          setTimeout(() => speak('פשוט גלול כרגיל — אני אלמד ממך אוטומטית.', 'think'), 6_000)
        }, 800)
      } else {
        setTimeout(() => speak(brain.greeting(), 'greet'), 800)
      }
    },

    // ── פוסט חדש גולש ────────────────────────────────────────
    onPostSeen(text) {
      const catId = brain.observe(text)
      if (catId === 'uncategorized') return catId

      const { session } = brain.getStats()
      const count       = session[catId] ?? 0

      if (questions.shouldAsk(catId, count)) {
        const q = questions.build(catId)
        if (q && canSpeak()) {
          pendingQ     = q
          lastSpokenAt = Date.now()
          questions.markAsked(catId)
          playMood(mascot, 'think')
          mascot.say(q.text)
        }
      } else {
        speak(brain.explain(catId), pickMood(brain.getStats().weights?.[catId] ?? 1))
      }

      return catId
    },

    // ── משוב מהמשתמש ─────────────────────────────────────────
    onPositive() {
      if (!pendingQ) return
      brain.positive(pendingQ.categoryId)
      speak(pendingQ.answers.yes, 'excited')
      pendingQ = null
    },

    onNegative() {
      if (!pendingQ) return
      brain.negative(pendingQ.categoryId)
      speak(pendingQ.answers.no, 'confused')
      pendingQ = null
    },

    // ── "למה אני רואה את זה?" ─────────────────────────────────
    onWhyClick(categoryId) {
      speak(brain.explain(categoryId), 'think')
    },

    getStats() { return brain.getStats() },
  }
}
