---
layout: page
title: "הדמות (Mascot)"
permalink: /mascot/
---

<div dir="rtl">

# מערכת הדמות (Mascot)

## ארכיטקטורה

```
mascot/
├── IMascot.js           — הגדרת ממשק (interface)
├── ClippyMascot.js      — מימוש Clippy
├── animations.js        — mood → שם אנימציה
└── mascot-controller.js — גשר brain ↔ mascot (entry point יחיד)
```

---

## IMascot — הממשק

כל דמות חייבת לממש את 6 השיטות האלה:

```js
{
  init()           // → Promise<void> — טען לDOM
  say(text)        // → void — הצג בועת טקסט
  animate(name)    // → void — הפעל אנימציה (שם ספציפי או רנדומלי)
  show()           // → void
  hide()           // → void
  onClick(cb)      // → void — רשום callback לקליק
}
```

---

## mascot-controller — שימוש

```js
import { createMascotController } from './mascot/mascot-controller.js'

const controller = createMascotController(mascot, brain)

await controller.start()           // טוען brain + ברכה
controller.onPostSeen(text)        // → categoryId, Clippy מגיב
controller.onPositive()            // 👍 → brain.positive + excited mood
controller.onNegative()            // 👎 → brain.negative + confused mood
controller.onWhyClick(categoryId)  // Clippy מסביר מעמיק
controller.getStats()              // → Stats object
controller.destroy()               // ניקוי (idle loop)
```

---

## Mood Mapping

| פעולה | Mood | אנימציה |
|-------|------|---------|
| `start()` — ברכה | `greet` | Wave, Greeting |
| `onPostSeen()` — הסבר | `think` | Thinking, LookDown |
| `onPositive()` | `excited` | Congratulate, Wave |
| `onNegative()` | `confused` | LookLeft, LookRight |
| idle (כל 15 שניות) | `idle` | IdleRopePile, IdleFingerTap |

---

## הוספת דמות חדשה

```js
// mascot/MyMascot.js
import { validateMascot } from './IMascot.js'

export function createMyMascot() {
  return validateMascot({
    async init() { /* הכנס לDOM */ },
    say(text)    { /* בועת טקסט */ },
    animate(name){ /* אנימציה */ },
    show()       { /* הצג */ },
    hide()       { /* הסתר */ },
    onClick(cb)  { /* רשום callback */ },
  })
}
```

ואז ב-`bundle-entry.js`:
```js
import { createMyMascot } from '../../mascot/MyMascot.js'
const mascot = createMyMascot()
await mascot.init()
const controller = createMascotController(mascot, brain)
```

</div>
