// svg-mascot.js — מסכת Clippy מבוססת SVG + CSS בלבד
// מחליפה את clippyjs כדי לעמוד ב-CSP של MV3 (אין eval / new Function)

const WRAPPER_ID = 'tshuva-mascot-wrapper'
const CSS_ID     = 'tshuva-mascot-css'

// אותה דמות מטאלית של קליפי כמו בדף הנחיתה (web/index.html #clippy-root) — עניבה מכופפת עם עיניים
const SVG_MARKUP = `
<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" width="80" height="113" class="tshuva-svg">
  <defs><linearGradient id="tshuvaClipMetal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbfdff"/>
    <stop offset=".35" stop-color="#c6d0db"/>
    <stop offset=".7" stop-color="#8c97a6"/>
    <stop offset="1" stop-color="#5d6776"/>
  </linearGradient></defs>
  <g transform="rotate(-6 60 95)">
    <rect x="28" y="54" width="64" height="102" rx="32" fill="none" stroke="url(#tshuvaClipMetal)" stroke-width="12"/>
    <rect x="44" y="30" width="32" height="104" rx="16" fill="none" stroke="url(#tshuvaClipMetal)" stroke-width="12"/>
    <path d="M33 72 Q30 104 37 134" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M39 41 Q50 33 61 40" stroke="url(#tshuvaClipMetal)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M70 40 Q82 33 93 42" stroke="url(#tshuvaClipMetal)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="51" cy="63" rx="14" ry="16.5" fill="#fff" stroke="#2a3340" stroke-width="2"/>
    <ellipse cx="79" cy="63" rx="14" ry="16.5" fill="#fff" stroke="#2a3340" stroke-width="2"/>
    <g class="tshuva-eyes">
      <circle class="tshuva-pupil-l" cx="53" cy="66" r="6.6" fill="#11161f"/>
      <circle class="tshuva-pupil-r" cx="81" cy="66" r="6.6" fill="#11161f"/>
      <circle cx="50.4" cy="62.6" r="2.1" fill="#fff"/>
      <circle cx="78.4" cy="62.6" r="2.1" fill="#fff"/>
    </g>
  </g>
</svg>`

const MASCOT_CSS = `
#${WRAPPER_ID} {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  top: auto !important;
  left: auto !important;
  z-index: 2147483647 !important;
  cursor: pointer !important;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  font-family: 'Segoe UI', Arial, sans-serif;
}
#${WRAPPER_ID} .tshuva-svg {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,.45));
  transition: transform .15s ease;
  display: block;
}
#${WRAPPER_ID}:hover .tshuva-svg {
  transform: scale(1.07);
}
#${WRAPPER_ID} .tshuva-eyes {
  animation: tshuva-look 5s ease-in-out infinite;
}
@keyframes tshuva-look {
  0%, 100% { transform: translate(0,0); }
  30%      { transform: translate(-3px,2px); }
  60%      { transform: translate(3px,1px); }
}
#${WRAPPER_ID} .tshuva-bubble {
  max-width: 240px;
  background: #1e1b4b;
  border: 1.5px solid #7C3AED;
  border-radius: 14px 14px 4px 14px;
  padding: 9px 13px;
  font-size: 13px;
  line-height: 1.55;
  color: #e9d5ff;
  direction: rtl;
  text-align: right;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  animation: tshuva-bubble-in .2s ease;
  position: relative;
}
#${WRAPPER_ID} .tshuva-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 12px;
  border: 8px solid transparent;
  border-top-color: #7C3AED;
  border-bottom: none;
}
@keyframes tshuva-bubble-in {
  from { opacity: 0; transform: translateY(6px) scale(.95); }
  to   { opacity: 1; transform: translateY(0)  scale(1);   }
}

/* ── Mood animations ───────────────────── */
@keyframes tshuva-greet {
  0%,100% { transform: rotate(0deg);   }
  20%      { transform: rotate(-18deg); }
  40%      { transform: rotate(12deg);  }
  60%      { transform: rotate(-12deg); }
  80%      { transform: rotate(8deg);   }
}
@keyframes tshuva-think {
  0%,100% { transform: translateX(0) rotate(0);   }
  30%      { transform: translateX(-4px) rotate(-5deg); }
  60%      { transform: translateX(4px)  rotate(5deg);  }
}
@keyframes tshuva-excited {
  0%,100% { transform: scale(1) translateY(0);     }
  25%      { transform: scale(1.14) translateY(-8px); }
  50%      { transform: scale(.96) translateY(2px);  }
  75%      { transform: scale(1.08) translateY(-5px); }
}
@keyframes tshuva-confused {
  0%,100% { transform: rotate(0);     }
  25%      { transform: rotate(-10deg) translateX(-3px); }
  75%      { transform: rotate(10deg)  translateX(3px);  }
}
@keyframes tshuva-idle {
  0%,100% { transform: translateY(0);    }
  50%      { transform: translateY(-5px); }
}

#${WRAPPER_ID}.anim-greet    .tshuva-svg { animation: tshuva-greet   .6s ease; }
#${WRAPPER_ID}.anim-think    .tshuva-svg { animation: tshuva-think   .8s ease; }
#${WRAPPER_ID}.anim-excited  .tshuva-svg { animation: tshuva-excited .7s ease; }
#${WRAPPER_ID}.anim-confused .tshuva-svg { animation: tshuva-confused .7s ease; }
#${WRAPPER_ID}.anim-idle     .tshuva-svg { animation: tshuva-idle    2.2s ease infinite; }
`

// Maps clippyjs animation names → CSS mood class
const ANIM_MAP = {
  Wave:           'greet',
  Greeting:       'greet',
  Thinking:       'think',
  LookDown:       'think',
  Congratulate:   'excited',
  LookLeft:       'confused',
  LookRight:      'confused',
  IdleRopePile:   'idle',
  IdleFingerTap:  'idle',
}

function injectCSS() {
  if (document.getElementById(CSS_ID)) return
  const s = document.createElement('style')
  s.id = CSS_ID
  s.textContent = MASCOT_CSS
  document.head.appendChild(s)
}

/**
 * יוצר מסכת SVG — ממשק תואם ל-bundle-entry.js
 * Returns: { _el, init, say, animate, show, hide, onClick }
 */
export function createSVGMascot() {
  let el       = null
  let bubbleEl = null
  let bubbleTimer  = null
  let animTimer    = null
  const clickCbs   = []

  function mount() {
    injectCSS()
    el = document.createElement('div')
    el.id = WRAPPER_ID
    el.innerHTML = `<div class="tshuva-bubble" id="tshuva-bubble" style="display:none"></div>${SVG_MARKUP}`
    document.body.appendChild(el)
    bubbleEl = el.querySelector('#tshuva-bubble')

    // idle bob by default
    el.classList.add('anim-idle')
  }

  return {
    get _el() { return el },

    init() {
      mount()
    },

    say(text) {
      if (!bubbleEl) return
      bubbleEl.textContent = text
      bubbleEl.style.display = 'block'
      clearTimeout(bubbleTimer)
      bubbleTimer = setTimeout(() => {
        if (bubbleEl) bubbleEl.style.display = 'none'
      }, 6000)
    },

    animate(name) {
      if (!el) return
      const mood = ANIM_MAP[name] ?? 'idle'
      const cls  = `anim-${mood}`
      el.classList.remove('anim-greet', 'anim-think', 'anim-excited', 'anim-confused', 'anim-idle')
      el.classList.add(cls)
      clearTimeout(animTimer)
      if (mood !== 'idle') {
        animTimer = setTimeout(() => {
          el?.classList.remove(cls)
          el?.classList.add('anim-idle')
        }, 1500)
      }
    },

    show() {
      if (el) el.style.display = 'flex'
    },

    hide() {
      if (el) el.style.display = 'none'
    },

    onClick(cb) {
      clickCbs.push(cb)
      el?.addEventListener('click', cb)
    },
  }
}
