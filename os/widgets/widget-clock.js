export function createClockWidget(container) {
  const el = document.createElement('div')
  el.style.cssText = `
    background:rgba(49,46,129,.9); color:white; border-radius:10px;
    padding:.7rem 1.2rem; font-family:Segoe UI,monospace; direction:ltr; text-align:center;
    box-shadow:0 2px 12px rgba(0,0,0,.2); min-width:120px;
  `
  container.appendChild(el)

  function update() {
    const now = new Date()
    const time = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const date = now.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'short' })
    el.innerHTML = `
      <div style="font-size:1.4rem;font-weight:800;letter-spacing:.05em">${time}</div>
      <div style="font-size:.75rem;opacity:.75;margin-top:.2rem">${date}</div>
    `
  }

  update()
  const timer = setInterval(update, 1000)
  return { el, destroy: () => clearInterval(timer) }
}
