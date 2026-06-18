/**
 * agent/actions.js — Actions the agent can perform
 *
 * All actions go through the mascot interface (IMascot).
 * No direct DOM access.
 */

import { SPEAK_COOLDOWN_MS } from '../shared/constants.js'
import { playMood }          from '../mascot/animations.js'

/**
 * createActions(mascot, brain) → ActionsAPI
 * The agent calls these to interact with the user.
 */
export function createActions(mascot, brain) {
  let lastSpokenAt    = 0
  let pendingQuestion = null

  function canSpeak() {
    return Date.now() - lastSpokenAt > SPEAK_COOLDOWN_MS
  }

  function spoke() {
    lastSpokenAt = Date.now()
  }

  return {
    // Send a message to the user (with cooldown guard)
    say(text, mood = 'idle') {
      if (!canSpeak()) return false
      playMood(mascot, mood)
      mascot.say(text)
      spoke()
      return true
    },

    // Force-say regardless of cooldown (for important events)
    forceSay(text, mood = 'idle') {
      playMood(mascot, mood)
      mascot.say(text)
      spoke()
    },

    // Play an animation without speaking
    animate(mood = 'idle') {
      playMood(mascot, mood)
    },

    // Ask the user a yes/no question
    askQuestion(question) {
      if (!canSpeak()) return false
      pendingQuestion = question
      playMood(mascot, 'think')
      mascot.say(question.text)
      spoke()
      return true
    },

    // Get the pending question (if any)
    getPendingQuestion() {
      return pendingQuestion
    },

    // Clear pending question
    clearQuestion() {
      pendingQuestion = null
    },

    // Explain a category to the user
    explain(categoryId) {
      const intent = brain.intent(categoryId)
      return this.say(intent.heText, 'think')
    },

    // Proactive insight — agent volunteers information
    proactiveInsight(stats) {
      const insights = brain.weeklyInsights(stats)
      if (!insights.length) return false
      const insight = insights[Math.floor(Math.random() * Math.min(3, insights.length))]
      return this.say(insight, 'think')
    },

    // Show onboarding message
    greet() {
      return this.forceSay(brain.greeting(), 'greet')
    },

    // Hide / show mascot
    hide() { mascot.hide() },
    show() { mascot.show() },

    canSpeak,
    getLastSpokenAt: () => lastSpokenAt,
  }
}
