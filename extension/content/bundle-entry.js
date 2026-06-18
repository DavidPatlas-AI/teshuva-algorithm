// Content script entry — מחבר mascot-controller + feed-observer בלבד
// כל לוגיקה של brain/questions/animations חיה ב-mascot-controller

import { initAgent } from 'clippyjs'
import ClippyAgent   from 'clippyjs/agents/clippy'

import { createBrain }                  from '../../brain/brain-api.js'
import { createChromeAdapter }           from '../../brain/adapters/chrome-adapter.js'
import { createMascotController }        from '../../mascot/mascot-controller.js'
import { getSelectorForCurrentSite }     from './site-adapters.js'
import { startFeedObserver }             from './feed-observer.js'
import { dismissPost, isActionSupported }from './action-engine.js'
import { createFeedbackUI }              from './feedback-ui.js'
import { CATEGORIES }                    from '../../brain/categories.js'
import { MSG, SETTINGS_KEY }             from '../../shared/constants.js'

;(async () => {
  // ── Mascot (Clippy) ────────────────────────────────────────
  const agent = await initAgent(ClippyAgent)
  agent.show()

  // agent._el הוא האלמנט האמיתי — clippyjs לא מוסיף class
  const clippyEl = agent._el
  if (clippyEl) {
    clippyEl.style.cssText += ';position:fixed!important;bottom:30px!important;right:30px!important;top:auto!important;left:auto!important;z-index:2147483647!important;'
  }

  // ── IMascot adapter לפני המשגרת ───────────────────────────
  const mascot = {
    say:     text => agent.speak(text),
    animate: name => name ? agent.play(name) : agent.animate(),
    show:    ()   => agent.show(),
    hide:    ()   => agent.hide(),
    onClick: cb   => clippyEl?.addEventListener('click', cb),
  }

  // ── Settings ─────────────────────────────────────────────────
  const savedSettings = await new Promise(r => chrome.storage.local.get(SETTINGS_KEY, r))
  const settingsRef   = { autoDismiss: savedSettings[SETTINGS_KEY]?.autoDismiss ?? true }

  // האזן לשינויי הגדרות מהפופ-אפ
  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === MSG.SETTINGS_CHANGED) settingsRef.autoDismiss = msg.autoDismiss
  })

  // ── Controller — נקודת הכניסה היחידה ללוגיקה ──────────────
  const brain = createBrain(createChromeAdapter())

  // כפתורי 👍/👎 — נוצרים לפני controller כדי להעביר callbacks
  let controller
  const feedbackUI = createFeedbackUI(
    () => controller?.onPositive(),
    () => controller?.onNegative(),
  )

  controller = createMascotController(mascot, brain, {
    onDismiss:  isActionSupported() ? dismissPost : null,
    settings:   settingsRef,
    onQuestion: catId => feedbackUI.show(CATEGORIES[catId]?.heLabel ?? catId),
    onAnswered: ()    => feedbackUI.hide(),
  })
  await controller.start()

  // ── Feed Observer ─────────────────────────────────────────
  const selector = getSelectorForCurrentSite()
  if (!selector) return

  startFeedObserver(selector, (el, text) => controller.onPostSeen(text, el))

  // ── Keyboard feedback (dev convenience, יוחלף ב-UI בעתיד) ──
  document.addEventListener('keydown', e => {
    if (e.key === '+' || e.key === '=') controller.onPositive()
    else if (e.key === '-')             controller.onNegative()
  })
})()
