export const PLUGIN_MANIFEST = {
  id:      'example-logger',
  name:    'Activity Logger',
  version: '1.0.0',
  events:  ['post:seen', 'stats:updated'],
}

export function activate({ bus }) {
  const log = []

  function onPostSeen(data) {
    log.push({ event: 'post:seen', ...data, at: Date.now() })
    if (log.length > 100) log.shift()
    console.log('[example-logger] post seen:', data.categoryId)
  }

  bus.on('post:seen', onPostSeen)

  return {
    getLogs: () => [...log],
    deactivate() {
      bus.off('post:seen', onPostSeen)
    },
  }
}
