// פרוטוקול הודעות Extension — popup ו-content משתמשים בזה, לא ב-storage ישירות
// תשובה תמיד: { ok: true, data } | { ok: false, error }

import { MSG } from '../shared/constants.js'

export { MSG }

// שלח הודעה ל-background ו-await תשובה
export function sendMsg(type, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, ...payload }, response => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      } else if (!response?.ok) {
        reject(new Error(response?.error ?? 'Unknown error'))
      } else {
        resolve(response.data)
      }
    })
  })
}

// קיצורים נוחים
export const api = {
  getStats:      ()                        => sendMsg(MSG.GET_STATS),
  resetStats:    ()                        => sendMsg(MSG.RESET_STATS),
  positive:      (categoryId)              => sendMsg(MSG.RECORD_SIGNAL, { categoryId, type: 'positive' }),
  negative:      (categoryId)              => sendMsg(MSG.RECORD_SIGNAL, { categoryId, type: 'negative' }),
  getInsights:   ()                        => sendMsg(MSG.GET_INSIGHTS),
}
