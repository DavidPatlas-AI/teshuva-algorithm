/**
 * apps/settings/settings.js — System settings app
 */

export function createSettingsApp(windowManager, controlCenter, brain) {
  return {
    open() {
      const state   = controlCenter.getState()
      const content = document.createElement('div')
      content.style.cssText = 'direction:rtl;font-family:Segoe UI,sans-serif'

      content.innerHTML = `
        <div style="margin-bottom:1rem">
          <div style="font-weight:700;color:#312e81;margin-bottom:.6rem">🤖 הסוכן</div>
          ${row('quietMode',    state.quietMode,    'מצב שקט (Clippy לא מדבר)')}
          ${row('learningMode', state.learningMode, 'מצב למידה')}
          ${row('clippy',       state.clippy,        'הצג Clippy')}
        </div>

        <div style="margin-bottom:1rem">
          <div style="font-weight:700;color:#312e81;margin-bottom:.6rem">📊 נתונים</div>
          <button id="btn-reset" style="
            background:#fee2e2;color:#dc2626;border:none;border-radius:6px;
            padding:.5rem 1rem;cursor:pointer;font-weight:700;font-size:.85rem">
            🗑️ אפס כל הנתונים
          </button>
        </div>

        <div style="color:#94a3b8;font-size:.8rem;margin-top:.5rem">
          גרסה: ${typeof chrome !== 'undefined' ? (chrome.runtime.getManifest?.()?.version ?? '—') : '—'}
        </div>
      `

      content.querySelectorAll('input[type=checkbox]').forEach(input => {
        input.addEventListener('change', () => {
          const key = input.dataset.key
          if (key === 'quietMode')    controlCenter.setQuietMode(input.checked)
          if (key === 'learningMode') controlCenter.setLearningMode(input.checked)
          if (key === 'clippy')       controlCenter.toggleClippy()
        })
      })

      content.querySelector('#btn-reset')?.addEventListener('click', async () => {
        if (confirm('לאפס את כל הנתונים? פעולה זו בלתי הפיכה.')) {
          await brain.reset()
          alert('הנתונים אופסו.')
        }
      })

      windowManager.open({ id: 'settings', title: '⚙️ הגדרות', content, width: 340, height: 320 })
    },
  }
}

function row(key, value, label) {
  return `
    <label style="display:flex;justify-content:space-between;align-items:center;
                  margin-bottom:.4rem;cursor:pointer;font-size:.9rem">
      <span>${label}</span>
      <input type="checkbox" data-key="${key}" ${value ? 'checked' : ''}
             style="width:16px;height:16px;cursor:pointer">
    </label>
  `
}
