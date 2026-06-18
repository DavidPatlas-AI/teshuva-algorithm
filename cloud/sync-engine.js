/**
 * cloud/sync-engine.js — State export/import/merge for Pro cloud sync
 */

const SYNC_VERSION = '1.0'

/**
 * exportState(stats, profilePrefs) → object (ready to JSON.stringify)
 */
export function exportState(stats, profilePrefs = {}) {
  return {
    syncVersion: SYNC_VERSION,
    exportedAt:  new Date().toISOString(),
    allTime:     { ...stats.allTime },
    weights:     { ...stats.weights },
    preferences: { ...profilePrefs },
  }
}

/**
 * importState(data) → { allTime, weights, preferences }
 * Validates and parses a state exported by exportState().
 */
export function importState(data) {
  if (!data || data.syncVersion !== SYNC_VERSION) {
    throw new Error('[sync] incompatible sync version')
  }
  return {
    allTime:     data.allTime     ?? {},
    weights:     data.weights     ?? {},
    preferences: data.preferences ?? {},
  }
}

/**
 * mergeState(local, remote) → merged
 * Non-destructive merge: always produces a state >= both inputs.
 */
export function mergeState(local, remote) {
  const allTime = mergeMax(local.allTime ?? {}, remote.allTime ?? {})
  const weights = mergeAvg(local.weights ?? {}, remote.weights ?? {})
  const preferences = lastWriteWins(
    { data: local.preferences ?? {}, ts: local.updatedAt ?? 0 },
    { data: remote.preferences ?? {}, ts: remote.updatedAt ?? 0 }
  )
  return { allTime, weights, preferences, mergedAt: new Date().toISOString() }
}

// ── Strategies ───────────────────────────────────────────────

function mergeMax(a, b) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b)) {
    out[k] = Math.max(out[k] ?? 0, v)
  }
  return out
}

function mergeAvg(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const out = {}
  for (const k of keys) {
    const av = a[k] ?? 1.0
    const bv = b[k] ?? 1.0
    out[k] = Math.round(((av + bv) / 2) * 1000) / 1000
  }
  return out
}

function lastWriteWins(a, b) {
  return a.ts >= b.ts ? a.data : b.data
}
