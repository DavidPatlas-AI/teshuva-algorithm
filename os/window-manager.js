/**
 * os/window-manager.js — Floating window system for the desktop layer
 *
 * Creates draggable, resizable, z-indexed windows inside a container element.
 * All windows are positioned within document.body by default.
 */

let nextZIndex = 1000
let nextId     = 1

export function createWindowManager(container = document.body) {
  const windows = new Map()  // id → { el, options }

  return {
    // Open a new window
    open({ title = '', content = '', width = 320, height = 240, x = 80, y = 80, id } = {}) {
      const winId = id ?? `win-${nextId++}`
      if (windows.has(winId)) { this.focus(winId); return winId }

      const el = document.createElement('div')
      el.className = 'teshuva-window'
      el.style.cssText = `
        position:fixed; left:${x}px; top:${y}px; width:${width}px; min-height:${height}px;
        background:#fff; border:1px solid #e2e8f0; border-radius:10px;
        box-shadow:0 8px 32px rgba(0,0,0,.15); z-index:${nextZIndex++};
        display:flex; flex-direction:column; direction:rtl; font-family:Segoe UI,sans-serif;
      `

      // Title bar
      const titleBar = document.createElement('div')
      titleBar.style.cssText = `
        background:#312e81; color:#fff; padding:.5rem 1rem; border-radius:10px 10px 0 0;
        display:flex; justify-content:space-between; align-items:center; cursor:move;
        font-weight:700; font-size:.9rem; user-select:none;
      `
      titleBar.innerHTML = `<span>${title}</span><span class="win-close" style="cursor:pointer;font-size:1.1rem">✕</span>`
      titleBar.querySelector('.win-close').addEventListener('click', () => this.close(winId))

      // Content area
      const body = document.createElement('div')
      body.style.cssText = 'padding:1rem; flex:1; overflow:auto;'
      if (typeof content === 'string') {
        body.innerHTML = content
      } else {
        body.appendChild(content)
      }

      el.appendChild(titleBar)
      el.appendChild(body)
      container.appendChild(el)

      makeDraggable(el, titleBar)
      el.addEventListener('mousedown', () => this.focus(winId))

      windows.set(winId, { el, options: { title, width, height } })
      return winId
    },

    close(id) {
      const win = windows.get(id)
      if (win) { win.el.remove(); windows.delete(id) }
    },

    focus(id) {
      const win = windows.get(id)
      if (win) win.el.style.zIndex = nextZIndex++
    },

    closeAll() {
      for (const id of windows.keys()) this.close(id)
    },

    list() {
      return [...windows.entries()].map(([id, w]) => ({ id, title: w.options.title }))
    },
  }
}

function makeDraggable(el, handle) {
  let startX, startY, startLeft, startTop

  handle.addEventListener('mousedown', e => {
    startX    = e.clientX
    startY    = e.clientY
    startLeft = parseInt(el.style.left) || 0
    startTop  = parseInt(el.style.top)  || 0

    function onMove(e) {
      el.style.left = `${startLeft + e.clientX - startX}px`
      el.style.top  = `${startTop  + e.clientY - startY}px`
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    e.preventDefault()
  })
}
