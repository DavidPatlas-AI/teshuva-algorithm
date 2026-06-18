// ממשק משוב מהיר — מציג כפתורי 👍/👎 כשקליפי שואל שאלה
// צף מעל כל האלמנטים, מסיר עצמו אחרי תשובה או timeout

const STYLES = `
  #tshuva-feedback {
    position: fixed;
    bottom: 160px;
    right: 24px;
    z-index: 2147483646;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    font-family: 'Segoe UI', Arial, sans-serif;
    animation: tshuva-fadein 0.3s ease;
  }
  @keyframes tshuva-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tshuva-label {
    font-size: 11px;
    color: #a0a0b0;
    background: #1a1a2e;
    padding: 4px 10px;
    border-radius: 99px;
    direction: rtl;
  }
  .tshuva-btns {
    display: flex;
    gap: 8px;
  }
  .tshuva-btn {
    padding: 8px 18px;
    border: none;
    border-radius: 99px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, opacity 0.15s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    direction: rtl;
  }
  .tshuva-btn:hover { transform: scale(1.08); }
  .tshuva-yes { background: #059669; color: white; }
  .tshuva-no  { background: #dc2626; color: white; }
`

let styleEl  = null
let barEl    = null
let autoHide = null

function injectStyles() {
  if (styleEl || document.getElementById('tshuva-styles')) return
  styleEl = document.createElement('style')
  styleEl.id = 'tshuva-styles'
  styleEl.textContent = STYLES
  document.head.appendChild(styleEl)
}

export function createFeedbackUI(onPositive, onNegative) {

  function show(categoryLabel) {
    hide()
    injectStyles()

    barEl = document.createElement('div')
    barEl.id = 'tshuva-feedback'
    barEl.innerHTML = `
      <div class="tshuva-label">🤔 מה דעתך על תוכן ${categoryLabel}?</div>
      <div class="tshuva-btns">
        <button class="tshuva-btn tshuva-no">👎 לא מעניין</button>
        <button class="tshuva-btn tshuva-yes">👍 כן, מעניין</button>
      </div>
    `

    barEl.querySelector('.tshuva-yes').onclick = () => { onPositive(); hide() }
    barEl.querySelector('.tshuva-no').onclick  = () => { onNegative(); hide() }
    document.body.appendChild(barEl)

    // auto-hide אם המשתמש לא מגיב
    autoHide = setTimeout(hide, 12_000)
  }

  function hide() {
    clearTimeout(autoHide)
    barEl?.remove()
    barEl    = null
    autoHide = null
  }

  return { show, hide }
}
