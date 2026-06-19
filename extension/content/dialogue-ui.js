// ממשק שיחה טקסטואלית עם קליפי — מופיע בלחיצה על הדמות
// שדה קלט צף מעל כל תוכן, תגובות מוצגות בבלון הדיבור של clippyjs

const STYLES = `
  #tshuva-chat {
    position: fixed;
    bottom: 165px;
    right: 20px;
    z-index: 2147483646;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 6px;
    direction: rtl;
    animation: tshuva-chat-in 0.2s ease;
  }
  @keyframes tshuva-chat-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  #tshuva-chat-input {
    background: #1a1a2e;
    border: 1.5px solid #4c4c8f;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    color: #e8e8ff;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    outline: none;
    padding: 8px 14px;
    transition: border-color 0.2s;
    width: 190px;
  }
  #tshuva-chat-input:focus { border-color: #7c7cff; }
  #tshuva-chat-input::placeholder { color: #5a5a8a; }
  .tshuva-chat-btn {
    background: #3d3d7a;
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    font-size: 15px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    transition: background 0.15s;
    width: 34px;
  }
  .tshuva-chat-btn:hover { background: #5c5caa; }
`

export function createDialogueUI(onSend) {
  let container = null
  let styleEl   = null
  let autoHide  = null

  function injectStyles() {
    if (document.getElementById('tshuva-chat-style')) return
    styleEl = document.createElement('style')
    styleEl.id = 'tshuva-chat-style'
    styleEl.textContent = STYLES
    document.head.appendChild(styleEl)
  }

  function show() {
    hide()
    injectStyles()

    container = document.createElement('div')
    container.id = 'tshuva-chat'
    container.innerHTML = `
      <button class="tshuva-chat-btn" id="tshuva-chat-close" title="סגור">✕</button>
      <input id="tshuva-chat-input" type="text" placeholder="שאל את קליפי..." maxlength="200" autocomplete="off" />
      <button class="tshuva-chat-btn" id="tshuva-chat-send" title="שלח">➤</button>
    `
    document.body.appendChild(container)

    const input   = container.querySelector('#tshuva-chat-input')
    const sendBtn = container.querySelector('#tshuva-chat-send')
    const closeBtn = container.querySelector('#tshuva-chat-close')

    setTimeout(() => input.focus(), 50)

    function submit() {
      const text = input.value.trim()
      if (!text) return
      onSend(text)
      input.value = ''
      resetAutoHide()
    }

    sendBtn.onclick = submit
    closeBtn.onclick = hide

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submit() }
      if (e.key === 'Escape') hide()
    })

    // מרחיק סגירה אוטומטית בכל הקלדה
    input.addEventListener('input', resetAutoHide)
    resetAutoHide()
  }

  function resetAutoHide() {
    clearTimeout(autoHide)
    autoHide = setTimeout(hide, 30_000)
  }

  function hide() {
    clearTimeout(autoHide)
    container?.remove()
    container = null
  }

  function toggle() {
    if (container) hide()
    else show()
  }

  return { show, hide, toggle }
}
