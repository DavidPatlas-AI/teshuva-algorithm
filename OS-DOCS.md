# OS-DOCS — Teshuva OS Layer

## מבנה המערכת

```
os/
├── window-manager.js   — חלונות צפים (drag, z-index, open/close)
├── file-system.js      — מערכת קבצים וירטואלית (localStorage)
├── notifications.js    — Toast notifications
├── control-center.js   — מרכז בקרה (modes toggle)
├── launcher.js         — תפריט מערכת + הפעלת אפליקציות
├── home-screen.html    — מסך הבית
├── home-screen.js      — bootstrap מסך הבית
├── theme.css           — עיצוב מערכת (dark/light)
└── widgets/
    ├── widget-clock.js
    ├── widget-stats.js
    ├── widget-insights.js
    └── widget-shortcuts.js

apps/
├── notes/    — עורך פתקים
├── tasks/    — ניהול משימות
├── insights/ — תובנות שבועיות
└── settings/ — הגדרות מערכת
```

---

## איך עובדים עם window-manager

```js
import { createWindowManager } from './os/window-manager.js'

const wm = createWindowManager(document.body)

// פתיחת חלון
const winId = wm.open({
  title:   'כותרת',
  content: '<p>תוכן HTML</p>',
  width:   380,
  height:  280,
  x:       100,  // מיקום מהשמאל
  y:       100,  // מיקום מהעליון
  id:      'my-window',  // אופציונלי
})

wm.close(winId)    // סגירה
wm.focus(winId)    // העלאה לקדמה
wm.closeAll()      // סגור הכל
wm.list()          // [{ id, title }, ...]
```

---

## איך מוסיפים אפליקציה

1. צור `apps/myapp/myapp.js`:

```js
export function createMyApp(windowManager) {
  return {
    open() {
      const content = document.createElement('div')
      content.innerHTML = '<p>האפליקציה שלי</p>'
      windowManager.open({ title: 'האפליקציה שלי', content, width: 320, height: 240 })
    }
  }
}
```

2. ייבא ב-`os/home-screen.js`:
```js
import { createMyApp } from '../apps/myapp/myapp.js'
const myApp = createMyApp(wm)
```

3. הוסף כפתור בתפריט:
```js
const launcher = createLauncher(wm, [
  { id: 'myapp', icon: '🆕', label: 'האפליקציה שלי' }
])
```

---

## איך מוסיפים Widget

```js
// os/widgets/widget-mywidget.js
export function createMyWidget(container, ...deps) {
  const el = document.createElement('div')
  el.className = 'teshuva-widget'
  el.innerHTML = '<div class="teshuva-widget-title">הווידג\'ט שלי</div>'
  container.appendChild(el)
  return { el, destroy() {} }
}
```

ייבא ב-`home-screen.js`:
```js
import { createMyWidget } from './widgets/widget-mywidget.js'
createMyWidget(widgetArea)
```

---

## איך מחברים את הסוכן

```js
import { createMascotController } from '../mascot/mascot-controller.js'
import { createDialogue }         from '../agent/dialogue.js'
import { createMemory }           from '../agent/memory.js'
import { createActions }          from '../agent/actions.js'

const memory    = createMemory(storage)
const dialogue  = createDialogue(memory)
const controller = createMascotController(mascot, brain, { dialogue, memory })

await controller.start()

// כשמשתמש מקליד טקסט:
controller.onUserText('למה אני רואה פוליטיקה?')
```

---

## חיבור Automation Engine

```js
import { createAutomationEngine } from '../automation/engine.js'
import rules from '../automation/rules.json' assert { type: 'json' }

const automation = createAutomationEngine(rules.rules, controller, brain)

// קישור לאירועים:
controller.onPostSeen = (text) => {
  const catId = brain.observe(text)
  automation.onPostSeen(catId)
  return catId
}
```

---

## גרסאות

| גרסה | תכונה |
|------|-------|
| v4.0.0 | Enterprise, Marketplace מלא |
| v5.0.0 | AI Agent (dialogue, memory, actions) |
| v6.0.0 | Automation Engine |
| v8.0.0 | Full Marketplace (server, payments, reviews) |
| v9.0.0 | Personal Assistant (tasks, scheduler, skills) |
| v10.0.0 | **Personal OS Layer (current)** |
