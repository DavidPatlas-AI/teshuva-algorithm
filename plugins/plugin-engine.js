/**
 * plugins/plugin-engine.js — Plugin loader with sandbox
 *
 * Plugins communicate only via event-bus and a restricted api subset.
 * They cannot import brain or DOM directly.
 */

export function createPluginEngine(bus, api) {
  const plugins   = new Map()   // id → { manifest, instance }
  const active    = new Set()

  // Restricted API surface exposed to plugins
  const sandboxApi = {
    getStats:  () => api.getStats(),
    positive:  (catId) => api.positive(catId),
    negative:  (catId) => api.negative(catId),
  }

  return {
    register(plugin) {
      const { PLUGIN_MANIFEST } = plugin
      if (!PLUGIN_MANIFEST?.id) throw new Error('[plugin-engine] missing PLUGIN_MANIFEST.id')
      if (plugins.has(PLUGIN_MANIFEST.id)) {
        console.warn(`[plugin-engine] duplicate plugin: ${PLUGIN_MANIFEST.id}`)
        return
      }
      plugins.set(PLUGIN_MANIFEST.id, { plugin, manifest: PLUGIN_MANIFEST, instance: null })
    },

    activate(id) {
      const entry = plugins.get(id)
      if (!entry) throw new Error(`[plugin-engine] unknown plugin: ${id}`)
      if (active.has(id)) return

      try {
        const instance = entry.plugin.activate({ bus, api: sandboxApi })
        entry.instance = instance
        active.add(id)
        console.log(`[plugin-engine] activated: ${id}`)
      } catch (e) {
        console.error(`[plugin-engine] activation error (${id}):`, e)
      }
    },

    activateAll() {
      for (const id of plugins.keys()) this.activate(id)
    },

    deactivate(id) {
      const entry = plugins.get(id)
      if (!entry?.instance) return
      try {
        entry.instance.deactivate?.()
      } catch (e) {
        console.error(`[plugin-engine] deactivation error (${id}):`, e)
      }
      entry.instance = null
      active.delete(id)
    },

    deactivateAll() {
      for (const id of active) this.deactivate(id)
    },

    list() {
      return [...plugins.values()].map(e => ({
        ...e.manifest,
        active: active.has(e.manifest.id),
      }))
    },
  }
}
