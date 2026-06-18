// גשר יחיד בין brain ↔ mascot ↔ user
// bundle-entry.js מייצר instance מזה ומפנה אליו הכל

import { createQuestions }                   from '../brain/questions.js'
import { SPEAK_COOLDOWN_MS, ONBOARDING_KEY } from '../shared/constants.js'
import { playMood }                           from './animations.js'
import { createDialogue }                     from '../agent/dialogue.js'

// mapping מדויק: פעולה → mood
// greeting → greet | explain → think | positive → excited | negative → confused | idle → idle
const MOOD = {
  greeting: 'greet',
  explain:  'think',
  positive: 'excited',
  negative: 'confused',
  idle:     'idle',
}

const IDLE_INTERVAL_MS = 15_000  // אנימציית idle כל 15 שניות

// options.dialogue  — optional createDialogue() instance for conversational AI layer
// options.memory    — optional createMemory() instance for long-term recall
// options.onDismiss — async (el) => { ok, host } — מנוע הפעולות
const AUTO_DISMISS_THRESHOLD = 0.4   // weight מתחת לזה = מחיקה אוטומטית

export function createMascotController(mascot, brain, options = {}) {
  const questions  = createQuestions()
  const dialogue   = options.dialogue ?? createDialogue(options.memory ?? null)
  let lastSpokenAt = 0
  let pendingQ     = null
  let pendingEl    = null   // אלמנט ה-DOM של הפוסט האחרון שנשאל עליו
  let idleTimer    = null

  function canSpeak() {
    return Date.now() - lastSpokenAt > SPEAK_COOLDOWN_MS
  }

  function speak(text, mood = MOOD.idle) {
    if (!canSpeak()) return false
    lastSpokenAt = Date.now()
    playMood(mascot, mood)
    mascot.say(text)
    return true
  }

  // אנימציית idle — רצה כל עוד Clippy בשקט
  function startIdleLoop() {
    idleTimer = setInterval(() => {
      if (canSpeak()) playMood(mascot, MOOD.idle)
    }, IDLE_INTERVAL_MS)
  }

  function stopIdleLoop() {
    clearInterval(idleTimer)
    idleTimer = null
  }

  return {
    // ── הפעלה ─────────────────────────────────────────────────
    async start() {
      await brain.load()
      startIdleLoop()

      const isNew = await new Promise(resolve =>
        chrome.storage.local.get(ONBOARDING_KEY, d => resolve(!d[ONBOARDING_KEY]))
      )

      if (isNew) {
        chrome.storage.local.set({ [ONBOARDING_KEY]: true })
        setTimeout(() => {
          speak('שלום! אני האלגוריתם שחזר בתשובה. אצפה במה שאתה רואה ואסביר למה.', MOOD.greeting)
          setTimeout(() => speak('פשוט גלול כרגיל — אני אלמד ממך אוטומטית.', MOOD.explain), 6_000)
        }, 800)
      } else {
        setTimeout(() => speak(brain.greeting(), MOOD.greeting), 800)
      }
    },

    // ── פוסט חדש גולש ────────────────────────────────────────
    onPostSeen(text, el = null) {
      const catId = brain.observe(text)
      if (catId === 'uncategorized') return catId

      // מחיקה אוטומטית כשהמשתמש כבר הביע אי-עניין חזק בקטגוריה
      const { session, weights } = brain.getStats()
      const weight = weights?.[catId] ?? 1.0

      if (weight < AUTO_DISMISS_THRESHOLD && el && options.onDismiss) {
        options.onDismiss(el).then(result => {
          if (result.ok) {
            brain.recordDismiss(catId)
            if (canSpeak()) speak('הסרתי פוסט לא רלוונטי בשמך 📎', MOOD.positive)
          }
        })
        return catId
      }

      const count = session[catId] ?? 0

      if (questions.shouldAsk(catId, count)) {
        const q = questions.build(catId)
        if (q && canSpeak()) {
          pendingQ     = q
          pendingEl    = el
          lastSpokenAt = Date.now()
          questions.markAsked(catId)
          playMood(mascot, MOOD.explain)
          mascot.say(q.text)
          options.onQuestion?.(catId)   // הצג כפתורי 👍/👎
        }
      } else if (canSpeak()) {
        const intent = brain.intent(catId)
        speak(intent.heText, MOOD.explain)
      }

      return catId
    },

    // ── משוב מהמשתמש ─────────────────────────────────────────
    onPositive() {
      if (!pendingQ) return
      brain.positive(pendingQ.categoryId)
      speak(pendingQ.answers.yes, MOOD.positive)
      options.onAnswered?.()
      pendingQ  = null
      pendingEl = null
    },

    onNegative() {
      if (!pendingQ) return
      brain.negative(pendingQ.categoryId)
      speak(pendingQ.answers.no, MOOD.negative)
      options.onAnswered?.()

      // נסה למחוק את הפוסט מיד
      const elToDismiss  = pendingEl
      const dismissCatId = pendingQ.categoryId
      pendingQ  = null
      pendingEl = null

      if (options.onDismiss && elToDismiss) {
        options.onDismiss(elToDismiss).then(result => {
          if (result.ok) {
            brain.recordDismiss(dismissCatId)
            setTimeout(() => {
              if (canSpeak()) speak('הסרתי את הפוסט הזה! 📎', MOOD.positive)
            }, 2_500)
          }
        })
      }
    },

    // ── "למה אני רואה את זה?" — לחיצה ידנית ─────────────────
    onWhyClick(categoryId) {
      const intent = brain.intent(categoryId)
      speak(intent.heText, MOOD.explain)
    },

    // ── שיחה טקסטואלית (dialogue layer) ─────────────────────
    onUserText(text) {
      const intent   = dialogue.addUserTurn(text)
      const catId    = brain.observe(text)
      const response = dialogue.buildResponse(catId === 'uncategorized' ? null : catId, brain)
      if (response) {
        dialogue.addAgentTurn(response)
        speak(response, MOOD.explain)
      }
      return intent
    },

    // ── ניקוי (לשימוש בסביבת test) ───────────────────────────
    destroy() {
      stopIdleLoop()
    },

    getStats() { return brain.getStats() },
  }
}
