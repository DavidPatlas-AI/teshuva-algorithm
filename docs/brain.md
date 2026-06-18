---
layout: page
title: "המוח (Brain API)"
permalink: /brain/
---

<div dir="rtl">

# Brain API — המוח הלומד

## עיקרון

המוח הוא שכבה טהורה — אין בה DOM, אין Chrome API, אין Electron.  
כל הגישה לאחסון עוברת דרך **Storage Adapter** שמוזרק מבחוץ.

---

## יצירת Instance

```js
import { createBrain }         from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()   // חובה — טוען נתונים שמורים
```

---

## API מלא

```js
// ── צפייה ─────────────────────────────────────────────────
brain.observe(text)           // → categoryId | 'uncategorized'

// ── הסברים ────────────────────────────────────────────────
brain.explain(categoryId)     // → מחרוזת עברית קצרה
brain.intent(categoryId)      // → Intent { type, heText, percentage, weight }
brain.greeting()              // → "בוקר טוב! ☀️" לפי שעה
brain.weeklyInsights(stats)   // → string[]

// ── סטטיסטיקות ────────────────────────────────────────────
brain.getStats()
// → {
//      session:    { politics: 3, sports: 1, ... },
//      allTime:    { politics: 47, sports: 12, ... },
//      weights:    { politics: 1.3, sports: 0.9, ... },
//      total:      60,
//      categories: { politics: { heLabel, color, keywords }, ... },
//      ids:        ["politics", "sports", ...]
//    }

// ── משוב ──────────────────────────────────────────────────
brain.positive(categoryId)    // מעלה weight ב-0.15
brain.negative(categoryId)    // מוריד weight ב-0.08

// ── ניהול ─────────────────────────────────────────────────
await brain.reset()

// ── דיבוג ─────────────────────────────────────────────────
brain.debug.score(text)       // → { sports: 3, politics: 1 }
brain.debug.classify(text)    // → 'sports'
```

---

## Intent Engine

`brain.intent()` מחזיר הסבר עמוק יותר מ-`explain()`:

```js
brain.intent('politics')
// → {
//      type:       'dominant',   // dominant|recurring|first-time|test|explicit
//      categoryId: 'politics',
//      heLabel:    'פוליטיקה',
//      percentage: 43,
//      weight:     1.3,
//      heText:     'פוליטיקה שולטת ב-43% מהפיד שלך...'
//    }
```

| סוג | תנאי |
|-----|------|
| `dominant` | מעל 40% מהפיד |
| `recurring` | 15–40% |
| `first-time` | 0 פוסטים קודמים |
| `test` | מתחת ל-15%, weight נייטרלי |
| `explicit` | weight ≥ 1.5 (משוב חיובי) |

---

## קטגוריות

9 קטגוריות מובנות — מקור האמת ב-`brain/categories.js`:

| מזהה | עברית | צבע |
|------|-------|-----|
| `politics` | פוליטיקה | #EF4444 |
| `sports` | ספורט | #3B82F6 |
| `entertainment` | בידור | #EC4899 |
| `technology` | טכנולוגיה | #8B5CF6 |
| `news` | חדשות | #F97316 |
| `health` | בריאות | #10B981 |
| `economy` | כלכלה | #F59E0B |
| `science` | מדע | #06B6D4 |
| `religion` | דת ומסורת | #A78BFA |

---

## Storage Adapters

```js
// Chrome Extension
import { createChromeAdapter }   from './brain/adapters/chrome-adapter.js'

// Electron Desktop
import { createElectronAdapter } from './brain/adapters/electron-adapter.js'

// בדיקות (in-memory)
const mem = () => {
  const s = {}
  return { get: k => Promise.resolve(s[k]??null), set: (k,v) => { s[k]=v } }
}
```

</div>
