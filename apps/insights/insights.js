/**
 * apps/insights/insights.js — Weekly insights viewer app
 */

import { buildWeeklyInsights, summarizeBehavior } from '../../brain/insights.js'

export function createInsightsApp(windowManager, brain) {
  return {
    open() {
      const stats    = brain.getStats()
      const insights = buildWeeklyInsights(stats)
      const summary  = summarizeBehavior(stats)

      const content = document.createElement('div')
      content.style.cssText = 'direction:rtl;font-family:Segoe UI,sans-serif'

      const cats = Object.entries(stats.allTime ?? {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

      content.innerHTML = `
        <div style="margin-bottom:1rem">
          <div style="font-weight:700;color:#312e81;margin-bottom:.5rem">📊 סיכום שבועי</div>
          <div style="font-size:.85rem;color:#64748b;display:grid;grid-template-columns:1fr 1fr;gap:.4rem">
            <span>סה"כ פוסטים: <strong>${stats.total ?? 0}</strong></span>
            <span>מגוון: <strong>${summary.variety} קטגוריות</strong></span>
            <span>משקל ממוצע: <strong>${summary.avgWeight}</strong></span>
          </div>
        </div>

        <div style="margin-bottom:1rem">
          <div style="font-weight:700;color:#312e81;margin-bottom:.5rem">💡 תובנות</div>
          ${insights.map(i => `<div style="font-size:.85rem;color:#475569;margin-bottom:.4rem">• ${i}</div>`).join('') || '<div style="color:#94a3b8;font-size:.85rem">עוד לא מספיק נתונים</div>'}
        </div>

        <div>
          <div style="font-weight:700;color:#312e81;margin-bottom:.5rem">🏆 טופ קטגוריות</div>
          ${cats.map(([k, n]) => {
            const label = stats.categories?.[k]?.heLabel ?? k
            const color = stats.categories?.[k]?.color ?? '#999'
            const pct   = stats.total ? Math.round((n / stats.total) * 100) : 0
            return `
              <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.4rem;font-size:.85rem">
                <div style="width:12px;height:12px;border-radius:50%;background:${color};flex-shrink:0"></div>
                <span style="flex:1">${label}</span>
                <span style="color:#64748b">${pct}%</span>
              </div>
            `
          }).join('')}
        </div>
      `

      windowManager.open({ id: 'insights', title: '💡 תובנות', content, width: 380, height: 420 })
    },
  }
}
