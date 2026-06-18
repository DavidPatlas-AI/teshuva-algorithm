/**
 * assistant/skill-engine.js — Skill loader and permissions manager
 */

export function createSkillEngine(bus, api) {
  const skills  = new Map()   // id → { manifest, instance }
  const enabled = new Set()

  return {
    register(skill) {
      const { SKILL_MANIFEST } = skill
      if (!SKILL_MANIFEST?.id) throw new Error('[skill-engine] missing SKILL_MANIFEST')
      if (skills.has(SKILL_MANIFEST.id)) return  // idempotent
      skills.set(SKILL_MANIFEST.id, { skill, manifest: SKILL_MANIFEST, instance: null })
    },

    enable(id) {
      const entry = skills.get(id)
      if (!entry || enabled.has(id)) return
      try {
        const instance = entry.skill.activate({ bus, api })
        entry.instance = instance
        enabled.add(id)
        console.log(`[skill-engine] enabled: ${id}`)
      } catch (e) {
        console.error(`[skill-engine] error enabling ${id}:`, e)
      }
    },

    enableAll() {
      for (const id of skills.keys()) this.enable(id)
    },

    disable(id) {
      const entry = skills.get(id)
      entry?.instance?.deactivate?.()
      entry && (entry.instance = null)
      enabled.delete(id)
    },

    disableAll() {
      for (const id of enabled) this.disable(id)
    },

    isEnabled(id) { return enabled.has(id) },

    list() {
      return [...skills.values()].map(e => ({
        ...e.manifest,
        enabled: enabled.has(e.manifest.id),
      }))
    },
  }
}
