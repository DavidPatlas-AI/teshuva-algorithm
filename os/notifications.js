/**
 * os/notifications.js — In-app notification system
 *
 * Shows toast notifications from the agent or the OS layer.
 * Does NOT use chrome.notifications — all in-DOM.
 */

export function createNotifications(container = document.body) {
  const queue = []
  let active  = 0
  const MAX_ACTIVE = 3

  const tray = document.createElement('div')
  tray.style.cssText = `
    position:fixed; bottom:1rem; left:1rem;
    display:flex; flex-direction:column-reverse; gap:.5rem;
    z-index:99998; pointer-events:none;
  `
  container.appendChild(tray)

  function show(notification) {
    if (active >= MAX_ACTIVE) { queue.push(notification); return }
    active++

    const el = document.createElement('div')
    el.style.cssText = `
      background:white; border:1px solid #e2e8f0; border-radius:8px;
      padding:.8rem 1.2rem; max-width:280px; box-shadow:0 4px 16px rgba(0,0,0,.1);
      font-family:Segoe UI,sans-serif; font-size:.9rem; direction:rtl; text-align:right;
      pointer-events:auto; opacity:0; transition:opacity .2s;
      border-right:4px solid ${notification.color ?? '#6366f1'};
    `
    el.innerHTML = `
      <div style="font-weight:700;margin-bottom:.25rem">${notification.title ?? 'Clippy'}</div>
      <div style="color:#64748b">${notification.body}</div>
    `

    tray.appendChild(el)
    requestAnimationFrame(() => { el.style.opacity = '1' })

    const duration = notification.duration ?? 4000
    setTimeout(() => {
      el.style.opacity = '0'
      setTimeout(() => {
        el.remove()
        active--
        if (queue.length) show(queue.shift())
      }, 200)
    }, duration)
  }

  return {
    info(body, title = 'מידע')    { show({ title, body, color: '#6366f1' }) },
    success(body, title = 'הצלחה') { show({ title, body, color: '#10b981' }) },
    warn(body, title = 'שים לב')  { show({ title, body, color: '#f59e0b' }) },
    error(body, title = 'שגיאה')  { show({ title, body, color: '#ef4444' }) },
    agent(body) {
      show({ title: '📎 Clippy', body, color: '#312e81', duration: 5000 })
    },
    dismiss() {
      tray.querySelectorAll('div').forEach(el => el.remove())
      active = 0
    },
  }
}
