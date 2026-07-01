/**
 * agent/dialogue.js — Conversational dialogue manager
 *
 * Manages short-term conversation history, intent analysis, and context window.
 * Does NOT call external LLM APIs — all processing is local.
 */

const MAX_TURNS = 10  // short-term context window

const INTENT_KEYWORDS = {
  question:   ['למה', 'מה', 'איך', 'מתי', 'כמה', 'why', 'what', 'how', 'when'],
  positive:   ['כן', 'בסדר', 'מסכים', 'yes', 'ok', 'great', '👍'],
  negative:   ['לא', 'לא רוצה', 'no', 'stop', 'נוראי', '👎'],
  reset:      ['אפס', 'התחל מחדש', 'reset', 'clear'],
  explain:    ['הסבר', 'תסביר', 'explain', 'למה אני רואה', 'why do i see'],
  stats:      ['סטטיסטיקות', 'כמה', 'statistics', 'stats', 'how many'],
  greeting:   ['שלום', 'היי', 'hello', 'hi', 'בוקר', 'morning'],
}

/**
 * createDialogue(memory) → DialogueEngine
 * memory: optional agent/memory.js instance for long-term recall
 */
export function createDialogue(memory = null) {
  const turns = []  // { role: 'user'|'agent', text, intent, ts }[]
  let lastUserTs = 0

  return {
    // Add a user message and analyze its intent
    addUserTurn(text) {
      const intent = detectIntent(text)
      const turn   = { role: 'user', text, intent, ts: Date.now() }
      turns.push(turn)
      if (turns.length > MAX_TURNS) turns.shift()
      lastUserTs = Date.now()
      memory?.noteInteraction(text, intent)
      return intent
    },

    // Add an agent response
    addAgentTurn(text) {
      turns.push({ role: 'agent', text, intent: null, ts: Date.now() })
      if (turns.length > MAX_TURNS) turns.shift()
    },

    // Generate a contextual response based on the last user turn + history
    buildResponse(categoryId, brain) {
      const lastUser = [...turns].reverse().find(t => t.role === 'user')
      if (!lastUser) return null

      const { intent } = lastUser

      switch (intent) {
        case 'explain':
          return brain.intent(categoryId).heText

        case 'stats': {
          const stats = brain.getStats()
          const total = stats.total ?? 0
          return total === 0
            ? 'עוד לא צברת נתונים — המשך לגלוש!'
            : `צפית ב-${total} פוסטים. הקטגוריה המובילה: ${getTopCategory(stats)}.`
        }

        case 'reset':
          return 'מוכן לאפס הכל? לחץ + לאישור, - לביטול.'

        case 'greeting':
          return brain.greeting()

        case 'question':
          return brain.explain(categoryId)

        case 'positive':
        case 'negative':
          return null  // handled by mascot-controller

        default:
          return brain.explain(categoryId)
      }
    },

    getHistory()    { return [...turns] },
    getLastIntent() { return turns.filter(t => t.role === 'user').slice(-1)[0]?.intent ?? null },
    getLastUserTs() { return lastUserTs },
    clearHistory()  { turns.length = 0 },

    // Context window summary for long-term memory consolidation
    getSummary() {
      const userTurns = turns.filter(t => t.role === 'user')
      const intents   = [...new Set(userTurns.map(t => t.intent).filter(Boolean))]
      return { turnCount: turns.length, intents, lastText: userTurns.slice(-1)[0]?.text ?? '' }
    },
  }
}

// ── Internal ────────────────────────────────────────────────

function detectIntent(text) {
  const lower = text.toLowerCase()
  for (const [intent, kws] of Object.entries(INTENT_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return intent
  }
  return 'general'
}

function getTopCategory(stats) {
  let best = null, bestN = 0
  for (const [k, n] of Object.entries(stats.allTime ?? {})) {
    if (n > bestN) { bestN = n; best = k }
  }
  return stats.categories?.[best]?.heLabel ?? best ?? '—'
}
