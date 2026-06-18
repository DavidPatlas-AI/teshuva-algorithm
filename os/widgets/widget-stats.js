export function createStatsWidget(container, brain) {
  const el = document.createElement('div')
  el.style.cssText = `
    background:white; border-radius:10px; padding:.8rem 1rem;
    border:1px solid #e2e8f0; box-shadow:0 2px 12px rgba(0,0,0,.06);
    font-family:Segoe UI,sans-serif; direction:rtl; min-width:180px;
  `
  container.appendChild(el)

  function update() {
    const stats = brain.getStats()
    const total = stats.total ?? 0
    const top   = getTop(stats.allTime ?? {}, stats.categories ?? {})
    el.innerHTML = `
      <div style="font-weight:800;color:#312e81;margin-bottom:.5rem">📊 סטטיסטיקות</div>
      <div style="font-size:.85rem;color:#64748b">פוסטים שנצפו: <strong style="color:#1e293b">${total}</strong></div>
      ${top ? `<div style="font-size:.85rem;color:#64748b;margin-top:.3rem">מובילה: <strong style="color:#6366f1">${top}</strong></div>` : ''}
    `
  }

  update()
  const timer = setInterval(update, 10_000)
  return { el, update, destroy: () => clearInterval(timer) }
}

function getTop(allTime, categories) {
  let best = null, bestN = 0
  for (const [k, n] of Object.entries(allTime)) {
    if (n > bestN) { bestN = n; best = k }
  }
  return best ? (categories[best]?.heLabel ?? best) : null
}
