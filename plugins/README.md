# Plugins — מערכת הרחבות

## מה זה Plugin?

Plugin הוא מודול JavaScript שנטען דינמית ומאזין לאירועים דרך event-bus.  
Plugins לא יכולים לגשת ישירות ל-brain או ל-DOM — רק דרך API מוגדר.

---

## איך כותבים Plugin

```js
// plugins/examples/my-plugin/index.js

export const PLUGIN_MANIFEST = {
  id:      'my-plugin',
  name:    'My Plugin',
  version: '1.0.0',
  events:  ['post:seen', 'stats:updated'],
}

export function activate({ bus, api }) {
  bus.on('post:seen', ({ categoryId, text }) => {
    console.log('[my-plugin] saw:', categoryId)
    // Can call api.getStats(), api.positive(), etc.
  })

  bus.on('stats:updated', (stats) => {
    // React to stats changes
  })

  return {
    deactivate() {
      bus.off('post:seen', ...)
    }
  }
}
```

---

## איך טוענים Plugin

```js
import { createPluginEngine } from './plugins/plugin-engine.js'
import MyPlugin from './plugins/examples/my-plugin/index.js'

const plugins = createPluginEngine(bus, api)
plugins.register(MyPlugin)
plugins.activateAll()
```

---

## API שזמין ל-Plugin

| שיטה | תיאור |
|------|--------|
| `api.getStats()` | קריאת נתונים (read-only) |
| `api.positive(catId)` | שלח feedback חיובי |
| `api.negative(catId)` | שלח feedback שלילי |

Plugins **לא יכולים** לשנות נתונים ישירות — רק דרך api.

---

## Events שזמינים

| Event | Data |
|-------|------|
| `post:seen` | `{ categoryId, text }` |
| `category:learn` | `{ categoryId, type: 'positive'|'negative' }` |
| `stats:updated` | `Stats` |
| `onboarding` | `{ step }` |
