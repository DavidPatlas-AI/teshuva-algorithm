// svg-mascot.js — מסכת Clippy מבוססת SVG + CSS בלבד
// מחליפה את clippyjs כדי לעמוד ב-CSP של MV3 (אין eval / new Function)

const WRAPPER_ID = 'tshuva-mascot-wrapper'
const CSS_ID     = 'tshuva-mascot-css'

const SVG_MARKUP = `
<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg" width="80" height="90" class="tshuva-svg">
  <ellipse cx="40" cy="10" rx="18" ry="6" fill="none" stroke="#FCD34D" stroke-width="3.5" stroke-dasharray="4 2"/>
  <line x1="40" y1="16" x2="40" y2="22" stroke="#6D28D9" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="40" cy="14" r="3.5" fill="#FCD34D"/>
  <rect x="12" y="22" width="56" height="52" rx="16" fill="#7C3AED"/>
  <rect x="14" y="24" width="52" height="48" rx="14" fill="#8B5CF6"/>
  <circle cx="29" cy="38" r="10" fill="white"/>
  <circle cx="51" cy="38" r="10" fill="white"/>
  <circle class="tshuva-pupil-l" cx="30" cy="39" r="6" fill="#1E1B4B"/>
  <circle class="tshuva-pupil-r" cx="52" cy="39" r="6" fill="#1E1B4B"/>
  <circle cx="31.5" cy="36.5" r="2.2" fill="white"/>
  <circle cx="53.5" cy="36.5" r="2.2" fill="white"/>
  <ellipse cx="20" cy="46" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.6"/>
  <ellipse cx="60" cy="46" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.6"/>
  <path class="tshuva-mouth" d="M 27 52 Q 40 62 53 52" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 40 66 C 40 63.5,36 61,36 64 C 36 66.5,40 69.5,40 69.5 C 40 69.5,44 66.5,44 64 C 44 61,40 63.5,40 66 Z" fill="#FCA5A5"/>
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
  filter: drop-shadow(0 4px 12px rgba(124,58,237,.5));
  transition: transform .15s ease;
  display: block;
}
#${WRAPPER_ID}:hover .tshuva-svg {
  transform: scale(1.07);
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
