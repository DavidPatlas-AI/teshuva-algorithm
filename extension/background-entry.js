// Service worker — background.js הנבנה מקובץ זה
// מנהל storage ומשמש כ-relay בין popup ↔ content ↔ storage

import { STORAGE_KEY, SETTINGS_KEY, MSG } from '../shared/constants.js'
import { CATEGORY_IDS }     from '../brain/categories.js'

// ── אתחול בהתקנה ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== 'install') return

  // כתוב state ריק תחת המפתח האחיד
  const empty = Object.fromEntries(CATEGORY_IDS.map(id => [id, 0]))
  await chrome.storage.local.set({
    [STORAGE_KEY]: {
      allTime:     { ...empty },
      weights:     Object.fromEntries(CATEGORY_IDS.map(id => [id, 1.0])),
      installedAt: Date.now(),
    },
    teshuva_onboarded: false,
  })
})

// ── מיגרציה מפורמט ישן (allTime flat key) ───────────────────
chrome.runtime.onStartup.addListener(migrateIfNeeded)
chrome.runtime.onInstalled.addListener(migrateIfNeeded)

async function migrateIfNeeded() {
  const data = await chrome.storage.local.get(['allTime', STORAGE_KEY])

  // אם כבר יש teshuva_state — אין מה לעשות
  if (data[STORAGE_KEY]) return

  // מצאנו allTime ישן — מעבירים
  if (data.allTime) {
    const existing = await chrome.storage.local.get(STORAGE_KEY)
    const state    = existing[STORAGE_KEY] ?? { allTime: {}, weights: {} }
    Object.assign(state.allTime, data.allTime)
    await chrome.storage.local.set({ [STORAGE_KEY]: state })
    await chrome.storage.local.remove('allTime')
  }
}

// ── Message handler ───────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  handle(msg).then(sendResponse).catch(err => sendResponse({ ok: false, error: err.message }))
  return true  // async response
})

async function handle(msg) {
  switch (msg.type) {

    case MSG.GET_STATS: {
      const data  = await chrome.storage.local.get(STORAGE_KEY)
      const state = data[STORAGE_KEY] ?? {}
      return { ok: true, data: state }
    }

    case MSG.RESET_STATS: {
      const empty = Object.fromEntries(CATEGORY_IDS.map(id => [id, 0]))
      await chrome.storage.local.set({
        [STORAGE_KEY]: {
          allTime:   { ...empty },
          weights:   Object.fromEntries(CATEGORY_IDS.map(id => [id, 1.0])),
          dismissed: { ...empty },
        },
      })
      return { ok: true }
    }

    case MSG.RECORD_SIGNAL: {
      // positive / negative feedback מה-content script
      const { categoryId, type } = msg
      const data  = await chrome.storage.local.get(STORAGE_KEY)
      const state = data[STORAGE_KEY] ?? { weights: {} }
      const w     = state.weights?.[categoryId] ?? 1.0

      state.weights[categoryId] = type === 'positive'
        ? Math.min(3.0, w + 0.15)
        : Math.max(0.1, w - 0.08)

      await chrome.storage.local.set({ [STORAGE_KEY]: state })
      return { ok: true }
    }

    case MSG.GET_INSIGHTS: {
      return { ok: true, data: [] }
    }

    case MSG.GET_SETTINGS: {
      const data = await chrome.storage.local.get(SETTINGS_KEY)
      return { ok: true, data: data[SETTINGS_KEY] ?? { autoDismiss: true } }
    }

    case MSG.UPDATE_SETTINGS: {
      const { autoDismiss } = msg
      await chrome.storage.local.set({ [SETTINGS_KEY]: { autoDismiss } })

      // שדר לכל טאבי התוסף שהגדרות השתנו
      const tabs = await chrome.tabs.query({})
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, { type: MSG.SETTINGS_CHANGED, autoDismiss })
        } catch {}   // tab might not have content script — ignore
      }
      return { ok: true }
    }

    default:
      return { ok: false, error: `Unknown message type: ${msg.type}` }
  }
}
