/**
 * assistant/scheduler.js — Cron-like scheduler for periodic agent actions
 *
 * Uses setInterval internally. Does not depend on any external cron service.
 */

/**
 * createScheduler() → Scheduler
 */
export function createScheduler() {
  const jobs = new Map()  // id → { fn, intervalMs, timer, lastRunAt }

  return {
    // Register a recurring job
    every(id, intervalMs, fn) {
      if (jobs.has(id)) this.cancel(id)
      const timer = setInterval(() => {
        const job = jobs.get(id)
        if (job) job.lastRunAt = Date.now()
        try { fn() } catch (e) { console.error(`[scheduler] job "${id}" error:`, e) }
      }, intervalMs)
      jobs.set(id, { fn, intervalMs, timer, lastRunAt: null })
    },

    // Register a one-time delayed job
    after(id, delayMs, fn) {
      const timer = setTimeout(() => {
        jobs.delete(id)
        try { fn() } catch (e) { console.error(`[scheduler] after "${id}" error:`, e) }
      }, delayMs)
      jobs.set(id, { fn, intervalMs: 0, timer, lastRunAt: null, oneShot: true })
    },

    cancel(id) {
      const job = jobs.get(id)
      if (!job) return
      clearInterval(job.timer)
      clearTimeout(job.timer)
      jobs.delete(id)
    },

    cancelAll() {
      for (const id of jobs.keys()) this.cancel(id)
    },

    list() {
      return [...jobs.entries()].map(([id, j]) => ({
        id,
        intervalMs: j.intervalMs,
        lastRunAt:  j.lastRunAt,
        oneShot:    j.oneShot ?? false,
      }))
    },
  }
}

// ── Preset intervals ────────────────────────────────────────
export const INTERVALS = {
  EVERY_MINUTE:   60_000,
  EVERY_5_MIN:   300_000,
  EVERY_15_MIN:  900_000,
  EVERY_HOUR:  3_600_000,
  EVERY_DAY:  86_400_000,
}
