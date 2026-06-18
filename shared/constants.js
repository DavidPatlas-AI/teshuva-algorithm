// קבועים גלובליים — כל הקבצים מייבאים מכאן, אין magic strings

// ── Storage ───────────────────────────────────────────────────
export const STORAGE_KEY    = 'teshuva_state'
export const ONBOARDING_KEY = 'teshuva_onboarded'

// ── Timing ────────────────────────────────────────────────────
export const SPEAK_COOLDOWN_MS = 9_000   // מינימום זמן בין דיבורים
export const ASK_AFTER_COUNT   = 5       // כמה פוסטים לפני שאלה למשתמש
export const ASK_COOLDOWN_MS   = 5 * 60_000  // מינימום זמן בין שאלות

// ── Events (shared/event-bus.js) ─────────────────────────────
export const EVENTS = {
  POST_SEEN:      'post:seen',       // { text, categoryId }
  CATEGORY_LEARN: 'category:learn',  // { categoryId, type: 'positive'|'negative' }
  STATS_UPDATED:  'stats:updated',   // Stats object
  ONBOARDING:     'onboarding',      // { isNew: boolean }
}

// ── Storage ────────────────────────────────────────────────────
export const SETTINGS_KEY = 'teshuva_settings'

// ── Extension message types (extension/api.js) ────────────────
export const MSG = {
  GET_STATS:        'GET_STATS',
  RESET_STATS:      'RESET_STATS',
  RECORD_SIGNAL:    'RECORD_SIGNAL',    // { categoryId, type: 'positive'|'negative' }
  GET_INSIGHTS:     'GET_INSIGHTS',
  GET_SETTINGS:     'GET_SETTINGS',
  UPDATE_SETTINGS:  'UPDATE_SETTINGS',  // { autoDismiss: boolean }
  SETTINGS_CHANGED: 'SETTINGS_CHANGED', // broadcast to content scripts
}
