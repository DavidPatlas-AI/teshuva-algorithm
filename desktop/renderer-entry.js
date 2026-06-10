import { initAgent } from 'clippyjs'
import ClippyAgent from 'clippyjs/agents/clippy'

const MESSAGES = [
  "שלום! אני קליפי, הסוכן שחזר בתשובה 📎",
  "נראה שאתה עובד קשה. הפסקה?",
  "האם ידעת שאני יכול לעזור לך?",
  "מה אתה עושה היום?",
  "אני כאן אם תצטרך!",
  "זוכר אותי? 😄",
  "יש לך דוא\"ל שלא קראת?",
  "פסקה של 5 דקות יכולה לעזור לריכוז!",
  "מה שלומך היום?",
  "אל תשכח לשתות מים! 💧",
]

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5  && h < 12) return "בוקר טוב! ☀️"
  if (h >= 12 && h < 17) return "צהריים טובים! 🌤️"
  if (h >= 17 && h < 21) return "ערב טוב! 🌆"
  return "לילה טוב! 🌙"
}

;(async () => {
  const agent = await initAgent(ClippyAgent)
  agent.show()

  // Greeting
  await new Promise(r => setTimeout(r, 700))
  agent.speak(getGreeting())
  agent.animate()

  // Drag to move
  let dragging = false
  let lastX, lastY

  document.addEventListener('mousedown', e => {
    const el = e.target.closest('.clippy-container')
    if (!el) return
    dragging = true
    lastX = e.screenX
    lastY = e.screenY
    window.desktopAPI.startDrag()
    e.preventDefault()
  })

  document.addEventListener('mousemove', e => {
    const overClippy = !!e.target.closest('.clippy-container')
    if (overClippy) {
      window.desktopAPI.mouseEnter()
    } else if (!dragging) {
      window.desktopAPI.mouseLeave()
    }

    if (dragging) {
      const dx = e.screenX - lastX
      const dy = e.screenY - lastY
      window.desktopAPI.moveWindow(dx, dy)
      lastX = e.screenX
      lastY = e.screenY
    }
  })

  document.addEventListener('mouseup', () => {
    dragging = false
  })

  // Click = random message
  document.addEventListener('click', e => {
    if (!e.target.closest('.clippy-container')) return
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    agent.speak(msg)
    agent.animate()
  })

  // Auto-animate every 8 sec
  setInterval(() => {
    agent.animate()
  }, 8000)

  // Auto-speak every 45 sec
  setInterval(() => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    agent.speak(msg)
    agent.animate()
  }, 45000)

})()
