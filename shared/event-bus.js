// pub/sub פנימי — תקשורת בין שכבות בלי תלות ישירה

export function createEventBus() {
  const listeners = {}

  return {
    on(event, cb) {
      if (!listeners[event]) listeners[event] = []
      listeners[event].push(cb)
    },

    off(event, cb) {
      if (!listeners[event]) return
      listeners[event] = listeners[event].filter(fn => fn !== cb)
    },

    emit(event, data) {
      for (const cb of listeners[event] ?? []) {
        try { cb(data) } catch (e) { console.error('[event-bus]', event, e) }
      }
    },
  }
}
