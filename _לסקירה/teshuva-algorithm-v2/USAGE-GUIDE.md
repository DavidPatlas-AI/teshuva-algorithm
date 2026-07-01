# USAGE GUIDE — האלגוריתם שחזר בתשובה

מדריך שימוש מלא למפתחים ולמשתמשים.

---

## 1. מה הפרויקט עושה?

תוסף דפדפן + אפליקציית דסקטופ שצופים ברשתות החברתיות ומסבירים למה אתה רואה מה שאתה רואה.

**זרימת המידע:**
```
אתה גולש ב-Twitter / YouTube / Instagram
        ↓
feed-observer.js מזהה פוסטים גלויים
        ↓
mascot-controller.onPostSeen(text)
        ↓
brain.observe(text) → categoryId ("politics", "sports"...)
        ↓
Clippy מסביר: "אתה רואה ספורט כי 38% מהפיד שלך הוא בנושא הזה"
        ↓
נתונים נשמרים ב-chrome.storage תחת המפתח "teshuva_state"
        ↓
Popup מציג: היסטוריה, קטגוריות, תובנות
```

---

## 2. הפעלת גרסת הדסקטופ (Electron)

### דרישות
- Node.js 18+
- Windows (נבדק על Windows 11)

### התקנה והפעלה

```bash
# שכפל את הפרויקט
git clone https://github.com/YOUR_USERNAME/teshuva-algorithm
cd teshuva-algorithm

# התקן תלויות
npm install

# הפעל את Clippy על שולחן העבודה
npm start
# שקול גם: npm run desktop (אותו דבר)
```

Clippy יופיע בפינה הימנית-תחתונה של המסך.

**כפתור ימני על tray-icon** → הצג/הסתר | יציאה

**גרירה:** לחץ וגרור את Clippy לכל מקום על המסך.

### קובץ .bat לפתיחה מהירה

```batch
@echo off
cd /d "C:\Users\DAVID\teshuva-algorithm"
start "" "node_modules\electron\dist\electron.exe" "desktop\main.js"
```

---

## 3. התקנת תוסף הדפדפן (Chrome / Edge)

### שלב 1 — בנה את הקבצים

```bash
npm run build
```

פעולה זו מייצרת:
```
extension/content/bundle.js    ← סקריפט התוכן (1.9MB, כולל Clippy)
extension/background.js        ← Service Worker
extension/popup/popup.js       ← ממשק הפופ-אפ
desktop/renderer.js            ← גרפיקה של Clippy לדסקטופ
```

### שלב 2 — טען לדפדפן

1. פתח `chrome://extensions` (או `edge://extensions`)
2. הפעל **Developer mode** (פינה ימנית עליונה)
3. לחץ **Load unpacked**
4. בחר את תיקיית `extension/`

### שלב 3 — בדוק שעובד

עבור ל-Twitter/X, YouTube, Instagram, Facebook או TikTok.  
Clippy אמור להופיע בפינה הימנית-תחתונה תוך שניה.

> **בפעם הראשונה:** Clippy יגיד "שלום! אני האלגוריתם שחזר בתשובה. אצפה במה שאתה רואה ואסביר למה."

### רשתות נתמכות

| רשת | סלקטור |
|-----|---------|
| Twitter / X | `[data-testid="tweetText"]` |
| Facebook | `[data-ad-preview="message"], [dir="auto"]` |
| Instagram | `._a9zs span, .C4VMK span` |
| YouTube | `#video-title, #description-text` |
| TikTok | `[data-e2e="browse-video-desc"]` |
| localhost | `[data-testid="tweetText"]` |

---

## 4. brain-api — שימוש במוח

כל הלוגיקה הפנימית עוברת דרך `brain/brain-api.js`. **אל תייבא ישירות מ-classifier.js או state.js.**

### יצירת Instance

```js
import { createBrain }         from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'
// או: import { createElectronAdapter } from './brain/adapters/electron-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()   // חובה — טוען נתונים שמורים
```

### API מלא

```js
// רשום פוסט שנצפה — מחזיר categoryId
const catId = brain.observe("Netanyahu said in the Knesset today...")
// → "politics"

// הסבר קצר
brain.explain("politics")
// → "אתה רואה פוליטיקה כי 43% מהתוכן שלך הוא בנושא הזה."

// הסבר עמוק (intent)
brain.intent("politics")
// → {
//      type: "dominant",       // dominant | recurring | first-time | test | explicit
//      categoryId: "politics",
//      heLabel: "פוליטיקה",
//      percentage: 43,
//      weight: 1.3,
//      heText: "פוליטיקה שולטת ב-43% מהפיד שלך — האלגוריתם בטוח שזה מה שאתה רוצה."
//    }

// ברכה לפי שעה
brain.greeting()
// → "בוקר טוב! ☀️"  /  "ערב טוב! 🌆"  /  "לילה טוב! 🌙"

// תובנות שבועיות (לטאב Insights בפופ-אפ)
brain.weeklyInsights({ peakHour: 22, socialCounts: { "x.com": 94 } })
// → ["הנושא שאתה נחשף אליו הכי הרבה הוא פוליטיקה — 43% מהתוכן.", ...]

// כל הסטטיסטיקות
brain.getStats()
// → {
//      session:    { politics: 3, sports: 1, ... },   // הסשן הנוכחי בלבד
//      allTime:    { politics: 47, sports: 12, ... },  // מצטבר
//      weights:    { politics: 1.3, sports: 0.9, ... },// עניין המשתמש
//      total:      60,                                  // סה"כ פוסטים הסשן
//      categories: { politics: { heLabel, color, keywords }, ... },
//      ids:        ["politics", "sports", ...]
//    }

// משוב מהמשתמש
brain.positive("sports")   // ← המשתמש לחץ 👍, מעלה weight
brain.negative("politics") // ← המשתמש לחץ 👎, מוריד weight

// איפוס מלא
await brain.reset()

// כלי דיבוג
brain.debug.score("כדורגל גול מכבי")
// → { sports: 3 }
brain.debug.classify("כדורגל גול מכבי")
// → "sports"
```

### Storage Adapters

```js
// Chrome Extension
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'
// עוטף chrome.storage.local

// Electron Desktop
import { createElectronAdapter } from './brain/adapters/electron-adapter.js'
// שומר ב-JSON ב-userData/teshuva-state.json

// Memory (לבדיקות)
const memoryAdapter = () => {
  const store = {}
  return {
    get: key        => Promise.resolve(store[key] ?? null),
    set: (key, val) => { store[key] = val; return Promise.resolve() },
  }
}
```

---

## 5. mascot-controller — גשר מוח ↔ דמות

`mascot/mascot-controller.js` הוא נקודת הכניסה היחידה ללוגיקה. bundle-entry.js לא מכיל לוגיקה — הוא רק מחבר.

### שימוש

```js
import { createMascotController } from './mascot/mascot-controller.js'

// mascot חייב לממש את IMascot: { say, animate, show, hide, onClick }
const controller = createMascotController(mascot, brain)

// בהפעלה — טוען brain + מציג ברכה
await controller.start()

// כשפוסט חדש גולש
const catId = controller.onPostSeen("כדורגל גול מכבי")
// Clippy מחליט אם להסביר או לשאול שאלה

// תשובת המשתמש לשאלה
controller.onPositive()   // לחץ + או 👍
controller.onNegative()   // לחץ - או 👎

// "למה אני רואה את זה?"
controller.onWhyClick("sports")

// קבל סטטיסטיקות
controller.getStats()
```

### לוגיקת ה-Controller

```
onPostSeen(text)
    ↓
brain.observe(text) → catId
    ↓
sessionCount >= 5 ולא נשאלנו עדיין?
    YES → buildQuestion(catId) → mascot.say(שאלה)   [pendingQuestion נשמר]
    NO  → brain.explain(catId) → mascot.say(הסבר)
```

---

## 6. extension/api.js — פרוטוקול הודעות

popup.js ו-content scripts לא קוראים מ-storage ישירות — הם שולחים הודעות ל-background.js.

### שימוש מ-popup או content

```js
import { api, MSG, sendMsg } from './extension/api.js'

// קיצורים נוחים
const state    = await api.getStats()       // → { allTime, weights, installedAt }
await api.resetStats()                       // מאפס הכל
await api.positive("sports")                // שולח RECORD_SIGNAL + positive
await api.negative("politics")              // שולח RECORD_SIGNAL + negative
const insights = await api.getInsights()    // → [] (placeholder ל-v0.2)

// גישה נמוכה אם צריך
const data = await sendMsg(MSG.GET_STATS)
```

### טיפוסי הודעות

```js
MSG.GET_STATS      // → { allTime, weights, installedAt }
MSG.RESET_STATS    // → (void)
MSG.RECORD_SIGNAL  // payload: { categoryId, type: 'positive'|'negative' }
MSG.GET_INSIGHTS   // → [] (מיועד ל-v0.2)
```

### מה background.js עושה

- שומר ב-`chrome.storage.local` תחת המפתח `"teshuva_state"`
- בהפעלה ראשונה: מאתחל state ריק
- מיגרציה: אם קיים `allTime` (פורמט ישן) — מעביר ל-`teshuva_state` אוטומטית

---

## 7. shared/event-bus.js — pub/sub פנימי

לשימוש עתידי לתקשורת בין שכבות ללא תלות ישירה.

```js
import { createEventBus } from './shared/event-bus.js'
import { EVENTS }         from './shared/constants.js'

const bus = createEventBus()

// הרשמה לאירוע
bus.on(EVENTS.POST_SEEN, ({ text, categoryId }) => {
  console.log('פוסט חדש:', categoryId)
})

// שליחת אירוע
bus.emit(EVENTS.POST_SEEN, { text: '...', categoryId: 'sports' })

// ביטול הרשמה
bus.off(EVENTS.POST_SEEN, handler)
```

### אירועים מוגדרים (`shared/constants.js`)

```js
EVENTS.POST_SEEN       // { text, categoryId }
EVENTS.CATEGORY_LEARN  // { categoryId, type: 'positive'|'negative' }
EVENTS.STATS_UPDATED   // Stats object
EVENTS.ONBOARDING      // { isNew: boolean }
```

---

## 8. Debug — איך מאבחנים בעיות

### בדיקת הסיווג

פתח DevTools ב-Twitter/X (F12) ← Console:

```js
// בדוק ניקוד טקסט
window.__teshuvaBrain?.debug.score("כדורגל גול מכבי")
// → { sports: 3 }

window.__teshuvaBrain?.debug.classify("election government vote")
// → "politics"
```

> **הוספה אופציונלית:** ב-bundle-entry.js אפשר לחשוף `window.__teshuvaBrain = brain` בסביבת dev.

### בדיקת storage

ב-DevTools → Application → Storage → Extension Storage:
- מפתח: `teshuva_state`
- תוכן: `{ allTime: { politics: 5, sports: 2, ... }, weights: { ... } }`

### בדיקת הודעות ל-background

ב-DevTools של ה-Service Worker (chrome://extensions → Inspect):
```js
chrome.runtime.sendMessage({ type: 'GET_STATS' }, console.log)
// → { ok: true, data: { allTime: {...}, weights: {...} } }
```

### Electron DevTools

```bash
# ב-main.js הוסף זמנית:
win.webContents.openDevTools({ mode: 'detach' })
```

---

## 9. הוספת קטגוריה חדשה

**קובץ יחיד לעדכן:** `brain/categories.js`

```js
// הוסף את הקטגוריה החדשה לאובייקט CATEGORIES:
export const CATEGORIES = {
  // ... קטגוריות קיימות ...

  cooking: {                          // ← מזהה (אנגלית, camelCase)
    heLabel: 'בישול ואוכל',          // ← תווית עברית לתצוגה
    color: '#F59E0B',                 // ← צבע hex לגרפים
    keywords: {
      he: ['מתכון', 'בישול', 'אפייה', 'מסעדה', 'שף', 'אוכל'],
      en: ['recipe', 'cooking', 'baking', 'restaurant', 'chef', 'food', 'meal'],
    },
  },
}
```

אחרי השינוי:
```bash
npm run build
```

לאחר מכן — רענן את התוסף ב-chrome://extensions.

---

## 10. הוספת דמות חדשה (Mascot)

כל דמות חייבת לממש את `IMascot` מ-`mascot/IMascot.js`:

```js
// mascot/MyMascot.js
import { validateMascot } from './IMascot.js'

export function createMyMascot() {
  // ... אתחול הדמות שלך ...

  return validateMascot({
    async init() {
      // טען את הדמות ל-DOM
    },
    say(text) {
      // הצג בועת טקסט
    },
    animate(name) {
      // הפעל אנימציה לפי שם (או רנדומלי)
    },
    show() { /* הצג */ },
    hide() { /* הסתר */ },
    onClick(cb) {
      // רשום callback לקליק
    },
  })
}
```

אחרי יצירת הדמות, החלף ב-`bundle-entry.js`:

```js
// לפני:
const mascot = {
  say:     text => agent.speak(text),
  animate: name => name ? agent.play(name) : agent.animate(),
  // ...
}

// אחרי (עם דמות מותאמת):
import { createMyMascot } from '../../mascot/MyMascot.js'
const myMascot = createMyMascot()
await myMascot.init()
const controller = createMascotController(myMascot, brain)
```

---

## 11. הרצת בדיקות

### דרישות
```bash
npm install --save-dev jest
```

### הרצה
```bash
npm test
```

### קבצי הבדיקות

| קובץ | בודק |
|------|------|
| `tests/brain.test.js` | brain-api — observe, explain, intent, positive/negative, reset |
| `tests/classifier.test.js` | scoreText, classify — עברית, אנגלית, uncategorized |
| `tests/state.test.js` | createState — load, observe, signals, weights, reset |
| `tests/questions.test.js` | createQuestions — shouldAsk, markAsked, build, whyDoISeeThis |

**חשוב:** כל הבדיקות משתמשות ב-memory adapter — אין תלות ב-Chrome API או DOM.

### דוגמה להוספת בדיקה

```js
// tests/intent.test.js
import { buildIntent, INTENT_TYPE } from '../brain/intent.js'

test('first-time כשאין נתונים', () => {
  const intent = buildIntent('sports', {}, {})
  expect(intent.type).toBe(INTENT_TYPE.FIRST_TIME)
})

test('dominant כשמעל 40%', () => {
  const intent = buildIntent('politics', { politics: 50, sports: 10 }, {})
  expect(intent.type).toBe(INTENT_TYPE.DOMINANT)
  expect(intent.percentage).toBe(83)
})
```

---

## 12. מפת דרכים לגרסה הבאה

### v0.2.0 — חוויית משתמש
- [ ] כפתורי 👍/👎 ב-UI (כרגע רק + / - מקלדת)
- [ ] אנימציות mood בהתאם ל-intent (greet / think / excited / confused)
- [ ] שימוש ב-`brain.intent()` לקבלת הסברים עמוקים יותר

### v0.3.0 — זיהוי אלגוריתם
- [ ] זיהוי תוכן ממומן (Promoted / Sponsored)
- [ ] מעקב אחר ירידת נראות (suppressed posts)
- [ ] זיהוי תבניות ויראליות

### v0.4.0 — קהילה
- [ ] יצוא נתונים אנונימי
- [ ] דשבורד קהילתי
- [ ] API למחקר

### v1.0.0 — מוצר
- [ ] פרסום ב-Chrome Web Store
- [ ] דמויות נוספות (Merlin, Bonzi, דמות עברית)
- [ ] תמיכה בשפות (ערבית, צרפתית, ספרדית)
- [ ] מסווג LLM מקומי (במקום keyword matching)

---

*מדריך זה תואם לקוד בגרסה v0.1.0 של הפרויקט.*
