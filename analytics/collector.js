/**
 * analytics/collector.js — Local-only event collection
 *
 * Events are stored in chrome.storage.local.
 * Never sent to any external server.
 */

const ANALYTICS_KEY = 'teshuva_analytics'
const MAX_EVENTS    = 500

export function createCollector(storage) {
  let events = []
  let loaded = false

  return {
    async load() {
      const saved = await storage.get(ANALYTICS_KEY)
      events = saved?.events ?? []
      loaded = true
    },

    track(name, data = {}) {
      if (!loaded) return
      events.push({ name, data, ts: Date.now() })
      if (events.length > MAX_EVENTS) events.shift()
      // Debounced save — don't await, fire-and-forget
      this._scheduleSave()
    },

    getEvents(name, windowMs) {
      const cutoff = windowMs ? Date.now() - windowMs : 0
      return events.filter(e =>
        (!name || e.name === name) && e.ts >= cutoff
      )
    },

    countBy(name, key, windowMs = 7 * 24 * 60 * 60_000) {
      const relevant = this.getEvents(name, windowMs)
      const counts = {}
      for (const { data } of relevant) {
        const val = data[key]
        if (val !== undefined) counts[val] = (counts[val] ?? 0) + 1
      }
      return counts
    },

    async save() {
      await storage.set(ANALYTICS_KEY, { events })
    },

    async reset() {
      events = []
      await storage.set(ANALYTICS_KEY, { events })
    },

    _saveTimer: null,
    _scheduleSave() {
      clearTimeout(this._saveTimer)
      this._saveTimer = setTimeout(() => this.save(), 2000)
    },
  }
}
