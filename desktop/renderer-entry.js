// renderer-entry.js — קליפי חכם על שולחן העבודה
// מתחבר למוח, נותן תובנות אמיתיות, מגיב לשעה ולנתונים

import { initAgent } from 'clippyjs'
import ClippyAgent   from 'clippyjs/agents/clippy'

// ── הודעות לפי הקשר ────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return 'בוקר טוב! ☀️ מוכן לגלוש בתבונה היום?'
  if (h >= 12 && h < 17) return 'צהריים טובים! 🌤️ איך הפיד שלך נראה עד עכשיו?'
  if (h >= 17 && h < 21) return 'ערב טוב! 🌆 זמן טוב לבדוק מה ראית היום.'
  return 'לילה טוב! 🌙 מאוחר קצת לגלול, לא?'
}

const INSIGHT_MSGS = [
  'כידוע, 78% מהמידע שאנשים מקבלים ברשתות — הוא לא מה שחיפשו.',
  'האלגוריתם של YouTube יודע מה תרצה לראות רגע לפני שאתה יודע.',
  'כל "לא מעניין" שתלחץ שווה יותר מ-20 "לייק".',
  'מחקר מ-2023: משתמשים בודקים את הטלפון 96 פעמים ביום בממוצע.',
  'TikTok צריך 35 שניות בלבד כדי לדעת מה הפוסט הבא שיעצור אותך.',
  'הפיד שלך הוא מראה — אבל מי שמחזיק אותו הוא האלגוריתם.',
  'כשאתה גולל מהר — האלגוריתם לומד גם מזה.',
  'הפיד "האישי" שלך משותף עם מיליוני אנשים עם אותו פרופיל.',
]

const ACTION_TIPS = [
  'נסה לגלול 3 פוסטים ולשים לב: כמה מהם בחרת לראות בעצמך?',
  'תסביר לי מה ראית היום ואני אנסה לזהות דפוסים.',
  'כשתרגיש שהפיד "אוכל אותך" — לחץ עליי ואסיר פוסטים בשמך.',
  'רוצה שאסביר למה ראית משהו ספציפי? לחץ עליי.',
  'הפסקה של 5 דקות מהמסך עכשיו תגדיל את הריכוז ב-25%.',
]

// ── בניית הודעה מבוססת מוח ─────────────────────────────────────

function buildInsightFromBrain(state) {
  if (!state) return null

  const allTime = state?.allTime ?? {}
  const weights = state?.weights ?? {}

  const total = Object.values(allTime).reduce((a, b) => a + b, 0)
  if (total === 0) return null

  const LABELS = {
    politics:      'פוליטיקה',
    sports:        'ספורט',
    entertainment: 'בידור',
    technology:    'טכנולוגיה',
    news:          'חדשות',
    health:        'בריאות',
    economy:       'כלכלה',
    science:       'מדע',
    religion:      'דת ומסורת',
  }

  const top = Object.entries(allTime)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])[0]

  if (!top) return null

  const [catId, count] = top
  const pct   = Math.round(count / total * 100)
  const label = LABELS[catId] ?? catId
  const w     = weights[catId] ?? 1.0

  const messages = [
    `${pct}% מהתוכן שנחשפת אליו הוא ${label}. האלגוריתם בטוח שזה מה שאתה רוצה.`,
    `ראיתי שאתה רואה הרבה ${label} (${count} פוסטים). הפיד שלך מוטה.`,
    `הנושא המוביל שלך הוא ${label}. ${w < 0.5 ? 'סימנת שזה לא מעניין — אבל הוא ממשיך לעלות.' : 'אם תרצה פחות — תגיד לי ואדבר עם האלגוריתם.'}`,
  ]

  return messages[Math.floor(Math.random() * messages.length)]
}

// ── תפריט לחיצה ────────────────────────────────────────────────

let menuEl = null

function createClickMenu(agent, brainState, onClose) {
  if (menuEl) { menuEl.remove(); menuEl = null; onClose?.(); return }

  const menu = document.createElement('div')
  menu.id = 'clippy-menu'
  menu.style.cssText = `
    position: fixed;
    bottom: 145px;
    right: 20px;
    background: rgba(10,10,24,0.95);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 8px 0;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    color: #e0e0f0;
    direction: rtl;
    z-index: 99999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    min-width: 200px;
    animation: menuIn 0.18s ease;
  `

  const style = document.createElement('style')
  style.textContent = `
    @keyframes menuIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .cm-item { padding:9px 16px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:background 0.1s; border-radius:8px; margin:2px 4px; }
    .cm-item:hover { background:rgba(255,255,255,0.08); }
    .cm-sep { height:1px; background:rgba(255,255,255,0.08); margin:4px 8px; }
  `
  document.head.appendChild(style)

  const insight = buildInsightFromBrain(brainState)

  const items = [
    { icon: '🔍', label: 'מה ראיתי היום?', action: () => {
      const msg = insight ?? `עוד לא צברתי מספיק נתונים. פתח את הדפדפן עם התוסף פעיל.`
      agent.speak(msg); agent.animate()
    }},
    { icon: '💡', label: 'תובנה על הפיד שלי', action: () => {
      const msg = INSIGHT_MSGS[Math.floor(Math.random() * INSIGHT_MSGS.length)]
      agent.speak(msg); agent.animate()
    }},
    { icon: '🎯', label: 'טיפ לגלישה חכמה', action: () => {
      const msg = ACTION_TIPS[Math.floor(Math.random() * ACTION_TIPS.length)]
      agent.speak(msg); agent.animate()
    }},
    null, // separator
    { icon: '👋', label: 'סגור תפריט', action: () => {} },
  ]

  items.forEach(item => {
    if (item === null) {
      const sep = document.createElement('div')
      sep.className = 'cm-sep'
      menu.appendChild(sep)
      return
    }
    const el = document.createElement('div')
    el.className = 'cm-item'
    el.innerHTML = `<span>${item.icon}</span><span>${item.label}</span>`
    el.addEventListener('click', () => {
      item.action()
      menu.remove()
      menuEl = null
    })
    menu.appendChild(el)
  })

  document.body.appendChild(menu)
  menuEl = menu

  // סגור בלחיצה מחוץ לתפריט
  setTimeout(() => {
    document.addEventListener('click', function closer(e) {
      if (!menu.contains(e.target)) {
        menu.remove()
        menuEl = null
        document.removeEventListener('click', closer)
      }
    })
  }, 100)
}

// ── Main ────────────────────────────────────────────────────────

;(async () => {
  const agent = await initAgent(ClippyAgent)
  agent.show()

  const clippyEl = agent._el

  // טען מצב המוח
  let brainState = null
  try {
    brainState = await window.desktopAPI.getBrainState()
  } catch {}

  // ברכה פתיחה חכמה
  await new Promise(r => setTimeout(r, 700))
  const openMsg = buildInsightFromBrain(brainState) ?? getGreeting()
  agent.speak(openMsg)
  agent.animate()

  // ── Drag ──────────────────────────────────────────────────────
  let dragging = false
  let dragMoved = false
  let lastX, lastY

  if (clippyEl) {
    clippyEl.addEventListener('mousedown', e => {
      dragging  = true
      dragMoved = false
      lastX = e.screenX
      lastY = e.screenY
      window.desktopAPI.startDrag()
    })

    // לחיצה — פתח תפריט
    clippyEl.addEventListener('click', () => {
      if (dragMoved) return
      createClickMenu(agent, brainState, null)
    })

    clippyEl.addEventListener('mouseenter', () => window.desktopAPI.mouseEnter())
    clippyEl.addEventListener('mouseleave', () => { if (!dragging) window.desktopAPI.mouseLeave() })
  }

  document.addEventListener('mousemove', e => {
    if (!dragging) return
    const dx = e.screenX - lastX
    const dy = e.screenY - lastY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true
    window.desktopAPI.moveWindow(dx, dy)
    lastX = e.screenX
    lastY = e.screenY
  })

  document.addEventListener('mouseup', () => {
    dragging = false
    window.desktopAPI.mouseLeave()
  })

  // ── אנימציה כל 8 שניות ────────────────────────────────────────
  setInterval(() => agent.animate(), 8_000)

  // ── הודעה חכמה כל 45 שניות ────────────────────────────────────
  let msgCycle = 0
  setInterval(() => {
    const pool = [
      buildInsightFromBrain(brainState),
      INSIGHT_MSGS[msgCycle % INSIGHT_MSGS.length],
      ACTION_TIPS[Math.floor(Math.random() * ACTION_TIPS.length)],
    ].filter(Boolean)

    agent.speak(pool[msgCycle % pool.length])
    agent.animate()
    msgCycle++
  }, 45_000)

  // ── רענון מוח כל 5 דקות ───────────────────────────────────────
  setInterval(async () => {
    try { brainState = await window.desktopAPI.getBrainState() } catch {}
  }, 5 * 60_000)

})()
