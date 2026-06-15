// ============================================================
// Teshuva Algorithm — Content Script Bundle Entry
// ============================================================

import { initAgent } from 'clippyjs'
import ClippyAgent   from 'clippyjs/agents/clippy'

import { createBrain }               from '../../brain/brain-api.js'
import { createChromeAdapter }       from '../../brain/adapters/chrome-adapter.js'
import { getSelectorForCurrentSite } from './site-adapters.js'
import { startFeedObserver }         from './feed-observer.js'
import { shouldAsk, markAsked, buildQuestion } from '../../brain/questions.js'

const SPEAK_COOLDOWN = 9000
const ONBOARDING_KEY = 'teshuva_onboarded'

;(async () => {
  // ── Brain ─────────────────────────────────────────────────
  const brain = createBrain(createChromeAdapter())
  await brain.load()

  // ── Mascot (Clippy) ────────────────────────────────────────
  const agent = await initAgent(ClippyAgent)
  agent.show()

  // clippyjs creates no class — use agent._el directly
  const clippyEl = agent._el
  if (clippyEl) {
    clippyEl.style.cssText += ';position:fixed!important;bottom:30px!important;right:30px!important;top:auto!important;left:auto!important;z-index:2147483647!important;'
  }

  await new Promise(r => setTimeout(r, 800))

  // ── First-time onboarding message ─────────────────────────
  const isNew = await new Promise(resolve => {
    chrome.storage.local.get(ONBOARDING_KEY, d => resolve(!d[ONBOARDING_KEY]))
  })

  if (isNew) {
    chrome.storage.local.set({ [ONBOARDING_KEY]: true })
    agent.speak('שלום! אני האלגוריתם שחזר בתשובה. אצפה במה שאתה רואה ואסביר למה.')
    agent.animate()
    // Second message after 6 seconds
    setTimeout(() => {
      agent.speak('פשוט גלול כרגיל — אני אלמד ממך אוטומטית.')
      agent.animate()
    }, 6000)
  } else {
    agent.speak(brain.greeting())
    agent.animate()
  }

  // ── Feed Observer ─────────────────────────────────────────
  const selector = getSelectorForCurrentSite()
  if (!selector) return

  let lastSpeak = 0
  let pendingQuestion = null

  startFeedObserver(selector, (_el, text) => {
    const catId = brain.observe(text)
    const now   = Date.now()
    if (catId === 'uncategorized' || now - lastSpeak <= SPEAK_COOLDOWN) return

    const stats = brain.getStats()
    const sessionCount = stats.session[catId] || 0

    // Ask the user after seeing enough posts in one category
    if (shouldAsk(catId, sessionCount)) {
      const question = buildQuestion(catId)
      if (question) {
        pendingQuestion = question
        markAsked(catId)
        lastSpeak = now
        agent.animate()
        agent.speak(question.text)
      }
    } else {
      lastSpeak = now
      agent.animate()
      setTimeout(() => agent.speak(brain.explain(catId)), 600)
    }
  })

  // ── Positive / Negative feedback via keyboard (dev convenience) ───
  // In a future version: UI buttons in the mascot bubble
  document.addEventListener('keydown', e => {
    if (!pendingQuestion) return
    if (e.key === '+' || e.key === '=') {
      brain.positive(pendingQuestion.categoryId)
      agent.speak(pendingQuestion.answers.yes)
      pendingQuestion = null
    } else if (e.key === '-') {
      brain.negative(pendingQuestion.categoryId)
      agent.speak(pendingQuestion.answers.no)
      pendingQuestion = null
    }
  })
})()
