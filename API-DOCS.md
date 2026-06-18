# API Documentation — Teshuva Algorithm

## ארכיטקטורה כללית

```
Content Script / Desktop Renderer
       ↓
mascot-controller  (גשר מרכזי)
   ↓         ↓
 brain      mascot
   ↓
 state  →  storage adapter
```

---

## brain-api

```js
import { createBrain }         from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()
```

### Methods

| שיטה | קלט | פלט | תיאור |
|------|-----|-----|--------|
| `brain.observe(text)` | string | categoryId | מסווג טקסט → קטגוריה |
| `brain.explain(catId)` | string | string (Hebrew) | הסבר קצר |
| `brain.intent(catId)` | string | Intent | הסבר עמוק |
| `brain.greeting()` | — | string | ברכה לפי שעה |
| `brain.weeklyInsights(stats)` | Stats | string[] | תובנות שבועיות |
| `brain.getStats()` | — | Stats | כל הנתונים |
| `brain.positive(catId)` | string | void | weight +0.15 |
| `brain.negative(catId)` | string | void | weight -0.08 |
| `brain.reset()` | — | Promise | איפוס מלא |
| `brain.debug.score(text)` | string | object | ניקוד ניפוי |
| `brain.debug.classify(text)` | string | categoryId | סיווג ניפוי |

### Intent Object

```ts
interface Intent {
  type:       'dominant' | 'recurring' | 'first-time' | 'test' | 'explicit'
  categoryId: string
  heLabel:    string
  percentage: number   // 0–100
  weight:     number   // 0.1–3.0
  heText:     string   // Hebrew explanation
}
```

### Stats Object

```ts
interface Stats {
  session:    Record<categoryId, number>
  allTime:    Record<categoryId, number>
  weights:    Record<categoryId, number>
  total:      number
  categories: Record<categoryId, { heLabel, color, keywords }>
  ids:        string[]
}
```

---

## mascot-controller

```js
import { createMascotController } from './mascot/mascot-controller.js'

const controller = createMascotController(mascot, brain)
```

### Methods

| שיטה | תיאור |
|------|--------|
| `controller.start()` | טען brain, אנימציית ברכה |
| `controller.onPostSeen(text)` | → categoryId; Clippy מגיב |
| `controller.onPositive()` | אחרי שאלת "רלוונטי?" — כן |
| `controller.onNegative()` | אחרי שאלת "רלוונטי?" — לא |
| `controller.onWhyClick(catId)` | הסבר intent מעמיק |
| `controller.getStats()` | → Stats |
| `controller.destroy()` | ניקוי timers |

---

## extension/api.js

פרוטוקול הודעות popup ↔ background:

```js
import { api } from './extension/api.js'

const stats  = await api.getStats()     // GET_STATS
await api.positive('sports')            // RECORD_SIGNAL positive
await api.negative('politics')          // RECORD_SIGNAL negative
await api.resetStats()                  // RESET_STATS
const ins    = await api.getInsights()  // GET_INSIGHTS
```

### Message Types (shared/constants.js)

```js
MSG.GET_STATS      = 'GET_STATS'
MSG.RESET_STATS    = 'RESET_STATS'
MSG.RECORD_SIGNAL  = 'RECORD_SIGNAL'
MSG.GET_INSIGHTS   = 'GET_INSIGHTS'
```

### Response Format

```js
// success
{ ok: true,  data: <payload> }

// error
{ ok: false, error: 'message' }
```

---

## event-bus

```js
import { createEventBus } from './shared/event-bus.js'

const bus = createEventBus()

bus.on('post:seen', ({ categoryId }) => { ... })
bus.emit('post:seen', { categoryId: 'politics' })
bus.off('post:seen', handler)
```

### Event Types (shared/constants.js)

```js
EVENTS.POST_SEEN      = 'post:seen'
EVENTS.CATEGORY_LEARN = 'category:learn'
EVENTS.STATS_UPDATED  = 'stats:updated'
EVENTS.ONBOARDING     = 'onboarding'
```

---

## Storage Adapter Interface

```ts
interface StorageAdapter {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
}
```

### Implementations

```js
import { createChromeAdapter }   from './brain/adapters/chrome-adapter.js'
import { createElectronAdapter } from './brain/adapters/electron-adapter.js'

// In-memory (tests)
const memAdapter = () => {
  const store = {}
  return {
    get: k => Promise.resolve(store[k] ?? null),
    set: (k, v) => { store[k] = v }
  }
}
```

---

## Flow Diagrams

### Content Script Flow

```
Page loads → content/bundle.js injects Clippy
  ↓
feed-observer.js detects visible posts
  ↓
controller.onPostSeen(text)
  ↓
brain.observe(text) → categoryId
  ↓
questions.shouldAsk()? → ask question
  ↑ no
brain.intent(catId) → Intent
  ↓
mascot.say(intent.heText) + animate('think')
```

### Feedback Flow

```
User presses + (positive) / - (negative)
  ↓
controller.onPositive() / onNegative()
  ↓
brain.positive(catId) / brain.negative(catId)
  ↓
state.adjustWeight() → save to storage
  ↓
mascot.say(answer) + animate('excited'/'confused')
```
