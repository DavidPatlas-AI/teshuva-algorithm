/**
 * automation/engine.js — Rule-based automation engine
 *
 * Evaluates rules.json against current state and fires actions
 * through the mascot-controller.
 */

const DEFAULT_COOLDOWN_MS = 30 * 60_000

/**
 * createAutomationEngine(rules, controller, brain) → AutomationEngine
 * rules: parsed rules.json
 * controller: mascot-controller instance
 * brain: brain-api instance
 */
export function createAutomationEngine(rules, controller, brain) {
  const lastFiredAt = {}  // ruleId → timestamp
  const sessionData = {
    startTs:       Date.now(),
    positiveCount: 0,
    seenByCategory: {},
  }

  return {
    // Call this on every post seen
    onPostSeen(categoryId) {
      sessionData.seenByCategory[categoryId] = (sessionData.seenByCategory[categoryId] ?? 0) + 1
      evalRules('post_seen', { categoryId })
    },

    // Call this on every positive feedback
    onPositive(categoryId) {
      sessionData.positiveCount++
      evalRules('positive', { categoryId })
    },

    // Periodic check (call every 60s)
    tick() {
      evalRules('tick', {})
    },

    getSessionData() { return { ...sessionData } },
  }

  function evalRules(event, ctx) {
    for (const rule of rules) {
      if (!rule.enabled) continue
      if (cooldownActive(rule)) continue
      if (checkTrigger(rule.trigger, ctx)) {
        fireAction(rule)
        lastFiredAt[rule.id] = Date.now()
      }
    }
  }

  function cooldownActive(rule) {
    const cd  = rule.action?.cooldownMs ?? DEFAULT_COOLDOWN_MS
    const last = lastFiredAt[rule.id] ?? 0
    return cd > 0 && Date.now() - last < cd
  }

  function checkTrigger(trigger, ctx) {
    const totalSeen = Object.values(sessionData.seenByCategory).reduce((s, n) => s + n, 0)

    switch (trigger.type) {
      case 'category_percentage': {
        const count = sessionData.seenByCategory[trigger.categoryId] ?? 0
        return totalSeen > 0 && (count / totalSeen) >= trigger.threshold
      }
      case 'positive_count':
        return sessionData.positiveCount >= trigger.threshold
      case 'session_duration_min': {
        const elapsed = (Date.now() - sessionData.startTs) / 60_000
        return elapsed >= trigger.threshold
      }
      case 'first_in_category': {
        const catId = ctx.categoryId
        const count = sessionData.seenByCategory[catId] ?? 0
        return count === 1  // exactly 1 = just saw for the first time
      }
      default:
        return false
    }
  }

  function fireAction(rule) {
    const { action } = rule
    const stats = brain.getStats()
    const catId = Object.keys(sessionData.seenByCategory).sort(
      (a, b) => (sessionData.seenByCategory[b] ?? 0) - (sessionData.seenByCategory[a] ?? 0)
    )[0]
    const heLabel = stats.categories?.[catId]?.heLabel ?? catId ?? ''
    const text = action.text.replace('${heLabel}', heLabel)

    switch (action.type) {
      case 'say':
        controller.onWhyClick && controller.onWhyClick(catId)
        // fallthrough to direct say
        break
      case 'ask_question':
        break
    }

    // Both 'say' and 'ask_question' use the same speak path
    if (controller._speak) {
      controller._speak(text, action.mood ?? 'think')
    }
  }
}
