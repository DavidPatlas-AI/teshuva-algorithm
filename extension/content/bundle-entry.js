// ============================================================
// Teshuva Algorithm — Content Script Bundle Entry
// ============================================================

import { initAgent } from 'clippyjs'
import ClippyAgent   from 'clippyjs/agents/clippy'

import { createBrain }               from '../../brain/brain-api.js'
import { createChromeAdapter }       from '../../brain/adapters/chrome-adapter.js'
import { getSelectorForCurrentSite } from './site-adapters.js'
import { startFeedObserver }         from './feed-observer.js'

const SPEAK_COOLDOWN = 9000

;(async () => {
  // ── Brain ─────────────────────────────────────────────────
  const brain = createBrain(createChromeAdapter())
  await brain.load()

  // ── Mascot (Clippy) ────────────────────────────────────────
  const agent = await initAgent(ClippyAgent)
  agent.show()

  // Position to bottom-right corner — agent._el is the real element
  const clippyEl = agent._el
  if (clippyEl) {
    clippyEl.style.cssText += ';position:fixed!important;bottom:30px!important;right:30px!important;top:auto!important;left:auto!important;z-index:2147483647!important;'
  }

  await new Promise(r => setTimeout(r, 800))
  agent.speak(brain.greeting())
  agent.animate()

  // ── Feed Observer ─────────────────────────────────────────
  const selector = getSelectorForCurrentSite()
  if (!selector) return

  let lastSpeak = 0

  startFeedObserver(selector, (_el, text) => {
    const catId = brain.observe(text)
    const now   = Date.now()

    if (catId !== 'uncategorized' && now - lastSpeak > SPEAK_COOLDOWN) {
      lastSpeak = now
      agent.animate()
      setTimeout(() => agent.speak(brain.explain(catId)), 600)
    }
  })
})()
