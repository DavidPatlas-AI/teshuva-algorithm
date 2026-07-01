// Content script entry — מחבר mascot-controller + feed-observer + dialogue + innertube
// כל לוגיקה של brain/questions/animations חיה ב-mascot-controller

import { createSVGMascot }               from '../../mascot/svg-mascot.js'
import { createBrain }                   from '../../brain/brain-api.js'
import { createChromeAdapter }           from '../../brain/adapters/chrome-adapter.js'
import { createMascotController }        from '../../mascot/mascot-controller.js'
import { getSelectorForCurrentSite }     from './site-adapters.js'
import { startFeedObserver }             from './feed-observer.js'
import { dismissPost, isActionSupported }from './action-engine.js'
import { createFeedbackUI }              from './feedback-ui.js'
import { createDialogueUI }              from './dialogue-ui.js'
import { startInnerTubeIntercept }       from './youtube-innertube.js'
import { injectPostBadge }               from './post-badge.js'
import { CATEGORIES }                    from '../../brain/categories.js'
import { MSG, SETTINGS_KEY }             from '../../shared/constants.js'

;(async () => {
  // ── Mascot (SVG — CSP-safe, no eval/new Function) ─────────
  const svgMascot = createSVGMascot()
  svgMascot.init()

  // ── IMascot adapter ────────────────────────────────────────
  const mascot = {
    say:     text => svgMascot.say(text),
    animate: name => svgMascot.animate(name ?? ''),
    show:    ()   => svgMascot.show(),
    hide:    ()   => svgMascot.hide(),
    onClick: cb   => svgMascot.onClick(cb),
  }

  // ── Settings ───────────────────────────────────────────────
  const savedSettings = await new Promise(r => chrome.storage.local.get(SETTINGS_KEY, r))
  const settingsRef   = { autoDismiss: savedSettings[SETTINGS_KEY]?.autoDismiss ?? true }

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === MSG.SETTINGS_CHANGED) settingsRef.autoDismiss = msg.autoDismiss
  })

  // ── Brain ──────────────────────────────────────────────────
  const brain = createBrain(createChromeAdapter())

  // ── Feedback UI (👍/👎) ────────────────────────────────────
  let controller
  const feedbackUI = createFeedbackUI(
    () => controller?.onPositive(),
    () => controller?.onNegative(),
  )

  // ── Controller ─────────────────────────────────────────────
  controller = createMascotController(mascot, brain, {
    onDismiss:  isActionSupported() ? dismissPost : null,
    settings:   settingsRef,
    onQuestion: catId => feedbackUI.show(CATEGORIES[catId]?.heLabel ?? catId),
    onAnswered: ()    => feedbackUI.hide(),
  })
  await controller.start()

  // ── Dialogue UI — לחיצה על קליפי פותחת שדה קלט ────────────
  const dialogueUI = createDialogueUI(text => {
    controller.onUserText(text)
  })
  svgMascot.onClick(() => dialogueUI.toggle())

  // ── Feed Observer ──────────────────────────────────────────
  const selector = getSelectorForCurrentSite()
  if (selector) {
    startFeedObserver(selector, (el, text) => {
      const catId = controller.onPostSeen(text, el)
      if (catId && catId !== 'uncategorized' && el) {
        const cat     = CATEGORIES[catId]
        const signals = brain.signals(catId)
        injectPostBadge(
          el,
          catId,
          cat?.heLabel ?? catId,
          cat?.color   ?? '#ff9a1f',
          signals,
          async () => {
            brain.negative(catId)
            const label  = cat?.heLabel ?? catId
            const result = dismissPost ? await dismissPost(el) : { ok: false, reason: 'unsupported' }

            if (result.ok) {
              const w       = brain.getStats().weights?.[catId] ?? 1.0
              const replies = [
                `הבנתי! מפחית ${label} בפיד שלך.`,
                `קיבלתי — פחות ${label} מעכשיו.`,
                `רשמתי. ${label} לא מעניין אותך עכשיו.`,
                w < 0.5 ? `שוב ${label}? כבר מסיר אוטומטית.` : `פחות ${label} — נלמד.`,
              ]
              mascot.say(replies[Math.floor(Math.random() * replies.length)])
            } else {
              console.debug(`[תשובה] dismiss failed on ${location.hostname}: ${result.reason}`)
              mascot.say(`רשמתי שפחות ${label} מעניין אותך — גם אם לא הצלחתי להסתיר את הפוסט אוטומטית כאן.`)
            }
            mascot.animate()
          },
        )
      }
    })
  }

  // ── YouTube InnerTube intercept ────────────────────────────
  // מופעל בנוסף ל-DOM observer — מספק טקסט מלא של כותרות לפני רינדור
  startInnerTubeIntercept(text => controller.onPostSeen(text, null))

  // ── Keyboard feedback (dev convenience) ───────────────────
  document.addEventListener('keydown', e => {
    if (e.key === '+' || e.key === '=') controller.onPositive()
    else if (e.key === '-')             controller.onNegative()
  })
})()
