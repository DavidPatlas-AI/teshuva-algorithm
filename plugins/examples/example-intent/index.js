export const PLUGIN_MANIFEST = {
  id:      'example-intent',
  name:    'Intent Logger',
  version: '1.0.0',
  events:  ['post:seen'],
}

export function activate({ bus, api }) {
  async function onPostSeen({ categoryId }) {
    const stats = await api.getStats()
    const total = Object.values(stats.allTime ?? {}).reduce((s, n) => s + n, 0)
    const count = stats.allTime?.[categoryId] ?? 0
    const pct   = total > 0 ? Math.round((count / total) * 100) : 0
    console.log(`[example-intent] ${categoryId}: ${pct}% of feed`)
  }

  bus.on('post:seen', onPostSeen)

  return {
    deactivate() {
      bus.off('post:seen', onPostSeen)
    },
  }
}
