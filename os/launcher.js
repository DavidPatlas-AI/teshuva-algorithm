/**
 * os/launcher.js — System menu and app launcher
 */

export function createLauncher(windowManager, apps = []) {
  const defaultApps = [
    { id: 'notes',    icon: '📝', label: 'פתקים' },
    { id: 'tasks',    icon: '✅', label: 'משימות' },
    { id: 'insights', icon: '💡', label: 'תובנות' },
    { id: 'settings', icon: '⚙️', label: 'הגדרות' },
    ...apps,
  ]

  let panel = null

  return {
    toggle(container = document.body) {
      if (panel) { panel.remove(); panel = null; return }

      panel = document.createElement('div')
      panel.style.cssText = `
        position:fixed; bottom:60px; right:1rem;
        background:white; border:1px solid #e2e8f0; border-radius:14px;
        padding:1rem; box-shadow:0 8px 32px rgba(0,0,0,.15);
        z-index:9999; direction:rtl; font-family:Segoe UI,sans-serif;
        display:grid; grid-template-columns:repeat(4,1fr); gap:.5rem; width:240px;
      `

      for (const app of defaultApps) {
        const btn = document.createElement('button')
        btn.style.cssText = `
          display:flex;flex-direction:column;align-items:center;gap:.3rem;
          background:#f8fafc;border:none;border-radius:8px;padding:.7rem .3rem;
          cursor:pointer;font-size:.75rem;color:#312e81;font-weight:600;
        `
        btn.innerHTML = `<span style="font-size:1.4rem">${app.icon}</span>${app.label}`
        btn.addEventListener('click', () => {
          this.launch(app.id)
          panel?.remove()
          panel = null
        })
        panel.appendChild(btn)
      }

      document.addEventListener('click', e => {
        if (panel && !panel.contains(e.target)) { panel.remove(); panel = null }
      }, { once: true })

      container.appendChild(panel)
    },

    launch(appId) {
      windowManager.open({
        id:      appId,
        title:   defaultApps.find(a => a.id === appId)?.label ?? appId,
        content: `<div style="color:#64748b;text-align:center;padding:2rem">${appId} — בקרוב</div>`,
        width:   380,
        height:  280,
      })
    },
  }
}
