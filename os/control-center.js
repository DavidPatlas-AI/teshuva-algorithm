/**
 * os/control-center.js — Control panel for system modes and quick toggles
 */

export function createControlCenter(storage) {
  const STATE_KEY = 'teshuva_os_state'
  let state = {
    quietMode:    false,
    learningMode: true,
    premiumMode:  false,
    clippy:       true,
  }
  let callbacks = []

  function notify() {
    for (const cb of callbacks) { try { cb({ ...state }) } catch (e) {} }
  }

  return {
    async load() {
      const saved = await storage.get(STATE_KEY)
      if (saved) Object.assign(state, saved)
    },

    // Modes
    setQuietMode(on) {
      state.quietMode = on
      notify()
      storage.set(STATE_KEY, state)
    },

    setLearningMode(on) {
      state.learningMode = on
      notify()
      storage.set(STATE_KEY, state)
    },

    toggleClippy() {
      state.clippy = !state.clippy
      notify()
      storage.set(STATE_KEY, state)
      return state.clippy
    },

    getState() { return { ...state } },

    onChange(cb) { callbacks.push(cb) },

    // Render a floating control panel
    render(container = document.body) {
      const panel = document.createElement('div')
      panel.style.cssText = `
        position:fixed; top:1rem; left:1rem; background:white;
        border:1px solid #e2e8f0; border-radius:12px; padding:1rem;
        box-shadow:0 4px 24px rgba(0,0,0,.1); z-index:9000;
        direction:rtl; font-family:Segoe UI,sans-serif; width:220px;
      `
      panel.innerHTML = `
        <div style="font-weight:800;color:#312e81;margin-bottom:.8rem">📎 מרכז בקרה</div>
        ${toggle('quietMode',    state.quietMode,    'מצב שקט')}
        ${toggle('learningMode', state.learningMode, 'מצב למידה')}
        ${toggle('premiumMode',  state.premiumMode,  'פרימיום')}
        ${toggle('clippy',       state.clippy,       'הצג Clippy')}
      `

      panel.querySelectorAll('input[type=checkbox]').forEach(input => {
        input.addEventListener('change', () => {
          state[input.dataset.key] = input.checked
          notify()
          storage.set(STATE_KEY, state)
        })
      })

      container.appendChild(panel)
      return panel
    },
  }
}

function toggle(key, value, label) {
  return `
    <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem;cursor:pointer">
      <span style="font-size:.9rem">${label}</span>
      <input type="checkbox" data-key="${key}" ${value ? 'checked' : ''}
        style="width:16px;height:16px;cursor:pointer">
    </label>
  `
}
