/**
 * ai/context.js — User context memory (short + long term)
 */

const SHORT_TERM_SIZE = 20  // last N posts
const LONG_TERM_MAX   = 100 // max persisted contexts

/**
 * createContextEngine(storageAdapter) → ContextEngine
 */
export function createContextEngine(storage) {
  let shortTerm = []  // { text, categoryId, timestamp }[]
  let longTerm  = []  // { summary, categories, timestamp }[]

  return {
    async load() {
      const saved = await storage.get('teshuva_context')
      if (saved) {
        shortTerm = saved.shortTerm ?? []
        longTerm  = saved.longTerm  ?? []
      }
    },

    // Add a seen post to short-term memory
    addPost(text, categoryId) {
      shortTerm.push({ text: text.slice(0, 200), categoryId, timestamp: Date.now() })
      if (shortTerm.length > SHORT_TERM_SIZE) shortTerm.shift()
    },

    // Consolidate short-term → long-term (call periodically)
    consolidate() {
      if (shortTerm.length < 5) return
      const categories = {}
      for (const { categoryId } of shortTerm) {
        categories[categoryId] = (categories[categoryId] ?? 0) + 1
      }
      longTerm.push({ summary: summarize(shortTerm), categories, timestamp: Date.now() })
      if (longTerm.length > LONG_TERM_MAX) longTerm.shift()
      shortTerm = []
    },

    // Get recent context for explanation
    getRecentContext() {
      return {
        shortTerm: [...shortTerm],
        longTerm:  longTerm.slice(-10),
      }
    },

    // What topics dominated recently?
    getDominantTopics(windowMs = 30 * 60_000) {
      const cutoff = Date.now() - windowMs
      const recent = shortTerm.filter(p => p.timestamp >= cutoff)
      const counts = {}
      for (const { categoryId } of recent) counts[categoryId] = (counts[categoryId] ?? 0) + 1
      return Object.entries(counts).sort(([, a], [, b]) => b - a).map(([k]) => k)
    },

    async save() {
      await storage.set('teshuva_context', { shortTerm, longTerm })
    },

    reset() {
      shortTerm = []
      longTerm  = []
    },
  }
}

function summarize(posts) {
  const cats = [...new Set(posts.map(p => p.categoryId))]
  return `${posts.length} posts: ${cats.join(', ')}`
}
