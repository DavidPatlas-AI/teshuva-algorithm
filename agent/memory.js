/**
 * agent/memory.js — Long-term factual memory about the user
 *
 * Stores facts with importance scores. Old, low-importance facts decay and are forgotten.
 * All storage is local — no external service.
 */

const MEMORY_KEY    = 'teshuva_agent_memory'
const MAX_FACTS     = 50
const DECAY_RATE    = 0.05   // importance -= 0.05 per day
const FORGET_BELOW  = 0.1    // fact is deleted when importance < 0.1
const MS_PER_DAY    = 86_400_000

/**
 * createMemory(storage) → AgentMemory
 */
export function createMemory(storage) {
  let facts = []  // { id, key, value, importance, ts, updatedAt }[]
  let interactionCount = 0

  return {
    async load() {
      const saved = await storage.get(MEMORY_KEY)
      facts            = saved?.facts            ?? []
      interactionCount = saved?.interactionCount ?? 0
      decay()
    },

    // Store or update a fact
    remember(key, value, importance = 0.7) {
      const existing = facts.find(f => f.key === key)
      if (existing) {
        existing.value      = value
        existing.importance = Math.min(1.0, existing.importance + 0.1)
        existing.updatedAt  = Date.now()
      } else {
        facts.push({ id: `${key}-${Date.now()}`, key, value, importance, ts: Date.now(), updatedAt: Date.now() })
        if (facts.length > MAX_FACTS) {
          // Evict lowest importance
          facts.sort((a, b) => b.importance - a.importance)
          facts = facts.slice(0, MAX_FACTS)
        }
      }
    },

    // Recall a fact by key
    recall(key) {
      const fact = facts.find(f => f.key === key)
      if (fact) {
        fact.importance = Math.min(1.0, fact.importance + 0.05)  // accessing = reinforcing
        return fact.value
      }
      return null
    },

    // Forget a specific fact
    forget(key) {
      facts = facts.filter(f => f.key !== key)
    },

    // Note an interaction (called by dialogue.js)
    noteInteraction(text, intent) {
      interactionCount++
      if (intent === 'positive')  this.remember('last_positive_interaction', Date.now(), 0.6)
      if (intent === 'question')  this.remember('curiosity_score', (this.recall('curiosity_score') ?? 0) + 1, 0.5)
      if (interactionCount % 10 === 0) {
        this.remember('total_interactions', interactionCount, 0.9)
      }
    },

    // All facts, sorted by importance
    getAllFacts() {
      return [...facts].sort((a, b) => b.importance - a.importance)
    },

    // High-importance facts for context
    getTopFacts(n = 5) {
      return this.getAllFacts().slice(0, n)
    },

    getInteractionCount() { return interactionCount },

    async save() {
      await storage.set(MEMORY_KEY, { facts, interactionCount })
    },

    async reset() {
      facts            = []
      interactionCount = 0
      await storage.set(MEMORY_KEY, { facts, interactionCount })
    },
  }

  function decay() {
    const now = Date.now()
    for (const fact of facts) {
      const daysSince = (now - fact.updatedAt) / MS_PER_DAY
      fact.importance = Math.max(0, fact.importance - DECAY_RATE * daysSince)
    }
    facts = facts.filter(f => f.importance >= FORGET_BELOW)
  }
}
