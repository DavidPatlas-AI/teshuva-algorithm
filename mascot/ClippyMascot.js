// מסכת Clippy — עוטפת את clippyjs לממשק IMascot

import { validateMascot } from './IMascot.js'

export function createClippyMascot() {
  let agent = null
  const clickCallbacks = []

  const mascot = {
    async init() {
      // clippyjs מוזרק ל-window על ידי bundle-entry.js
      // ב-Electron — מוזרק ב-renderer-entry.js
      await new Promise((resolve, reject) => {
        window.clippy.load('Clippy', (a) => {
          if (!a) { reject(new Error('Clippy failed to load')); return }
          agent = a
          agent.show()

          // הוסף listener לקליק על האלמנט הפנימי של clippyjs
          const el = agent._el
          if (el) {
            el.addEventListener('click', () => {
              clickCallbacks.forEach(cb => cb())
            })
          }

          resolve()
        })
      })
    },

    say(text) {
      if (!agent) return
      agent.speak(text)
    },

    animate(name) {
      if (!agent) return
      if (name) {
        agent.play(name)
      } else {
        agent.animate()
      }
    },

    show() {
      agent?.show()
    },

    hide() {
      agent?.hide()
    },

    onClick(cb) {
      clickCallbacks.push(cb)
    },
  }

  return validateMascot(mascot)
}
