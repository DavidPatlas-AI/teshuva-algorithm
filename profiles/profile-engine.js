import { STORAGE_KEY } from '../shared/constants.js'

const PROFILE_KEY = 'teshuva_profile'

/**
 * createProfileEngine(storage) → ProfileEngine
 */
export function createProfileEngine(storage) {
  let profile = null

  return {
    async load() {
      const saved = await storage.get(PROFILE_KEY)
      profile = saved ?? defaultProfile()
      if (!profile.createdAt) profile.createdAt = new Date().toISOString()
      return profile
    },

    get() {
      return profile
    },

    updatePreferences(prefs) {
      if (!profile) return
      Object.assign(profile.preferences, prefs)
      profile.updatedAt = new Date().toISOString()
    },

    updateHistory(allTime, weights, totalSeen) {
      if (!profile) return
      profile.history.allTime    = allTime
      profile.history.weights    = weights
      profile.history.totalSeen  = totalSeen
      profile.history.lastSeenAt = new Date().toISOString()
      if (!profile.history.firstSeenAt) {
        profile.history.firstSeenAt = profile.history.lastSeenAt
      }
      profile.updatedAt = new Date().toISOString()
    },

    updateBehavior(behavior) {
      if (!profile) return
      Object.assign(profile.behavior, behavior)
    },

    async save() {
      if (!profile) return
      await storage.set(PROFILE_KEY, profile)
    },

    // Merge two profiles (for multi-device sync)
    merge(remote) {
      if (!profile || !remote) return profile
      const merged = JSON.parse(JSON.stringify(profile))

      // Merge allTime: take max count per category
      for (const [k, v] of Object.entries(remote.history?.allTime ?? {})) {
        merged.history.allTime[k] = Math.max(merged.history.allTime[k] ?? 0, v)
      }

      // Merge weights: average
      for (const [k, v] of Object.entries(remote.history?.weights ?? {})) {
        const local = merged.history.weights[k] ?? 1.0
        merged.history.weights[k] = (local + v) / 2
      }

      merged.updatedAt = new Date().toISOString()
      profile = merged
      return merged
    },

    async reset() {
      profile = defaultProfile()
      profile.createdAt = new Date().toISOString()
      await storage.set(PROFILE_KEY, profile)
    },
  }
}

function defaultProfile() {
  return {
    version: '1.0',
    id: 'default',
    createdAt: null,
    updatedAt: null,
    preferences: {
      language: 'he',
      mascot: 'clippy',
      skin: 'default',
      speakCooldownMs: 9000,
      idleIntervalMs: 15000,
      showOnboarding: true,
      notificationsEnabled: false,
    },
    history: {
      allTime: {},
      weights: {},
      totalSeen: 0,
      firstSeenAt: null,
      lastSeenAt: null,
    },
    behavior: {
      avgSessionLengthMin: 0,
      peakHour: null,
      dominantCategory: null,
      feedVariety: 0,
    },
  }
}
