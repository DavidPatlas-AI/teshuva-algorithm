// post-badge.js — תגית הסבר שמופיעה מתחת לכל פוסט מזוהה
// מציגה: קטגוריה + 3 אותות עם % + כפתור דחייה

const CSS = `
  .tshuva-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 2px;
    padding: 5px 10px 5px 8px;
    background: rgba(10,10,20,0.88);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11.5px;
    color: #d0d0e0;
    direction: rtl;
    cursor: default;
    user-select: none;
    backdrop-filter: blur(4px);
    max-width: 420px;
    flex-wrap: wrap;
    position: relative;
    z-index: 9999;
    animation: tshuva-badge-in 0.25s ease;
  }
  @keyframes tshuva-badge-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tshuva-badge-icon {
    font-size: 13px;
    flex-shrink: 0;
  }
  .tshuva-badge-cat {
    font-weight: 700;
    font-size: 12px;
  }
  .tshuva-badge-sep {
    color: rgba(255,255,255,0.25);
    font-size: 10px;
  }
  .tshuva-badge-signal {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10.5px;
    color: #9090aa;
    white-space: nowrap;
  }
  .tshuva-badge-signal-bar {
    display: inline-block;
    width: 28px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.12);
    vertical-align: middle;
    overflow: hidden;
  }
  .tshuva-badge-signal-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .tshuva-badge-signal-fill.pos  { background: #22c55e; }
  .tshuva-badge-signal-fill.neu  { background: #f59e0b; }
  .tshuva-badge-signal-fill.neg  { background: #ef4444; }
  .tshuva-badge-pct {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .tshuva-badge-pct.pos { color: #22c55e; }
  .tshuva-badge-pct.neu { color: #f59e0b; }
  .tshuva-badge-pct.neg { color: #ef4444; }
  .tshuva-badge-dismiss {
    margin-right: auto;
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    font-size: 13px;
    padding: 0 2px;
    line-height: 1;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .tshuva-badge-dismiss:hover { color: #ef4444; }
`

let styleInjected = false
function injectStyles() {
  if (styleInjected || document.getElementById('tshuva-badge-styles')) return
  const s = document.createElement('style')
  s.id = 'tshuva-badge-styles'
  s.textContent = CSS
  document.head.appendChild(s)
  styleInjected = true
}

/**
 * מוסיף badge הסבר לאלמנט פוסט
 * @param {HTMLElement} postEl — אלמנט הפוסט ב-DOM
 * @param {string} categoryId
 * @param {string} categoryLabel — שם עברי
 * @param {string} categoryColor — hex צבע
 * @param {{ label: string, value: number, type: string }[]} signals
 * @param {() => void} [onDismiss] — callback ללחיצת ❌
 * @returns {HTMLElement|null} — ה-badge שנוצר, או null אם כבר קיים
 */
export function injectPostBadge(postEl, categoryId, categoryLabel, categoryColor, signals, onDismiss) {
  if (!postEl) return null

  // לא להוסיף פעמיים לאותו אלמנט
  if (postEl.querySelector('.tshuva-badge')) return null

  injectStyles()

  const badge = document.createElement('div')
  badge.className = 'tshuva-badge'
  badge.dataset.tshuvaCategory = categoryId

  const signalHtml = signals.map(sig => {
    const cls = sig.type === 'positive' ? 'pos' : sig.type === 'negative' ? 'neg' : 'neu'
    return `
      <span class="tshuva-badge-signal">
        <span class="tshuva-badge-signal-bar">
          <span class="tshuva-badge-signal-fill ${cls}" style="width:${sig.value}%"></span>
        </span>
        <span class="tshuva-badge-pct ${cls}">${sig.value}%</span>
        ${sig.label}
      </span>
    `
  }).join(`<span class="tshuva-badge-sep">·</span>`)

  badge.innerHTML = `
    <span class="tshuva-badge-icon" style="color:${categoryColor}">📎</span>
    <span class="tshuva-badge-cat" style="color:${categoryColor}">${categoryLabel}</span>
    <span class="tshuva-badge-sep">|</span>
    ${signalHtml}
    <button class="tshuva-badge-dismiss" title="הסתר פוסט זה">✕</button>
  `

  badge.querySelector('.tshuva-badge-dismiss').addEventListener('click', (e) => {
    e.stopPropagation()
    badge.style.opacity = '0'
    badge.style.transform = 'scale(0.9)'
    badge.style.transition = 'all 0.2s ease'
    setTimeout(() => badge.remove(), 200)
    onDismiss?.()
  })

  // מוסיף אחרי האלמנט (not inside) לא לשבור layout
  postEl.insertAdjacentElement('afterend', badge)
  return badge
}

/**
 * מסיר את כל ה-badges מהעמוד (לשימוש בניקוי / toggle)
 */
export function removeAllBadges() {
  document.querySelectorAll('.tshuva-badge').forEach(b => b.remove())
}
