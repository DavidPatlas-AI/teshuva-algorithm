import { pickMood, playMood } from './animations.js'

/**
 * Emotion model — maps brain state to emotional mood.
 *
 * Each emotion has:
 *   name     — internal id
 *   mood     — maps to animations.js MOOD_ANIMATIONS key
 *   trigger  — condition function (weights, sessionStats, total) → boolean
 *   priority — higher wins when multiple emotions trigger simultaneously
 */
const EMOTIONS = [
  {
    name: 'overwhelmed',
    mood: 'confused',
    priority: 10,
    trigger: (weights, _session, total) =>
      total > 50 && Object.values(weights).some(w => w >= 2.0),
  },
  {
    name: 'happy',
    mood: 'excited',
    priority: 8,
    trigger: (weights) =>
      Object.values(weights).filter(w => w >= 1.5).length >= 2,
  },
  {
    name: 'curious',
    mood: 'think',
    priority: 6,
    trigger: (_weights, session) => {
      const active = Object.values(session).filter(n => n > 0).length
      return active >= 4
    },
  },
  {
    name: 'bored',
    mood: 'confused',
    priority: 4,
    trigger: (_weights, session) => {
      const total = Object.values(session).reduce((s, n) => s + n, 0)
      return total < 3
    },
  },
  {
    name: 'neutral',
    mood: 'idle',
    priority: 1,
    trigger: () => true,
  },
]

/**
 * computeEmotion(weights, sessionStats) → { name, mood }
 * Returns the highest-priority emotion that triggers.
 */
export function computeEmotion(weights = {}, sessionStats = {}) {
  const total = Object.values(sessionStats).reduce((s, n) => s + n, 0)
  const triggered = EMOTIONS
    .filter(e => e.trigger(weights, sessionStats, total))
    .sort((a, b) => b.priority - a.priority)

  return triggered[0] ?? EMOTIONS.find(e => e.name === 'neutral')
}

/**
 * expressEmotion(mascot, weights, sessionStats)
 * Computes the current emotion and plays the matching animation.
 */
export function expressEmotion(mascot, weights = {}, sessionStats = {}) {
  const { mood } = computeEmotion(weights, sessionStats)
  playMood(mascot, mood)
}

/**
 * moodFromWeight(weight) → mood string
 * Simple helper: single weight → mood (used when only one category matters).
 */
export function moodFromWeight(weight) {
  return pickMood(weight)
}

export { EMOTIONS }
