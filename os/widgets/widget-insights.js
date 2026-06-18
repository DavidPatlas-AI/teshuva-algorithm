import { buildWeeklyInsights } from '../../brain/insights.js'

export function createInsightsWidget(container, brain) {
  const el = document.createElement('div')
  el.style.cssText = `
    background:white; border-radius:10px; padding:.8rem 1rem;
    border:1px solid #e2e8f0; box-shadow:0 2px 12px rgba(0,0,0,.06);
    font-family:Segoe UI,sans-serif; direction:rtl; max-width:260px;
  `
  container.appendChild(el)

  function update() {
    const stats    = brain.getStats()
    const insights = buildWeeklyInsights(stats).slice(0, 3)
    const items    = insights.map(i => `<li style="margin-bottom:.3rem">${i}</li>`).join('')
    el.innerHTML = `
      <div style="font-weight:800;color:#312e81;margin-bottom:.5rem">💡 תובנות</div>
      <ul style="font-size:.82rem;color:#475569;padding-right:1rem;list-style:disc">
        ${items || '<li>עוד לא מספיק נתונים</li>'}
      </ul>
    `
  }

  update()
  const timer = setInterval(update, 30_000)
  return { el, update, destroy: () => clearInterval(timer) }
}
