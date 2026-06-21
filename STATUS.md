# סטטוס פרויקט — האלגוריתם שחזר בתשובה
*עודכן: יוני 2026*

---

## מה כבר בנוי ✅

### תוסף Chrome (`extension/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `manifest.json` | ✅ מוכן | MV3, כל 5 פלטפורמות, הרשאות storage/history/tabs |
| `background.js` | ✅ מקומפל | שמירת סטטיסטיקות, weights, הגדרות |
| `content/bundle.js` | ✅ מקומפל (2MB) | ה-content script המלא שרץ בדפדפן |
| `content/feed-observer.js` | ✅ | MutationObserver + scroll detection לאיתור פוסטים חדשים |
| `content/site-adapters.js` | ✅ | CSS selectors ל-Twitter/X, Facebook, Instagram, YouTube, TikTok |
| `content/action-engine.js` | ✅ | לוחץ "Not Interested" / "Hide" בשם המשתמש — 5 פלטפורמות |
| `content/dialogue-ui.js` | ✅ | שדה קלט טקסטואלי — שאל את קליפי |
| `content/feedback-ui.js` | ✅ | כפתורי 👍/👎 שמופיעים כשקליפי שואל שאלה |
| `content/youtube-innertube.js` | ✅ | מיירט YouTube InnerTube API לכותרות לפני render |
| `popup/popup.html + popup.js` | ✅ | חלון פופ-אפ עם סטטיסטיקות וגרפים |

### המוח (`brain/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `categories.js` | ✅ | 9 קטגוריות: פוליטיקה, ספורט, בידור, טכנולוגיה, חדשות, בריאות, כלכלה, מדע, דת |
| `classifier.js` | ✅ | ניקוד keyword-based עם משקלות (w:1/2/3) |
| `explanations.js` | ✅ | הסברים לפי קטגוריה, תובנות שבועיות, ברכות שעתיות |
| `intent.js` | ✅ | 5 סוגי כוונה: DOMINANT / RECURRING / FIRST_TIME / TEST / EXPLICIT |
| `brain-api.js` | ✅ | API ציבורי יחיד — observe, explain, intent, getStats |
| `state.js` | ✅ | אבסטרקציה לאחסון (session + allTime + weights + dismissed) |
| `adapters/` | ✅ | chrome-adapter + electron-adapter |

### המסכה — קליפי (`mascot/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `mascot-controller.js` | ✅ | מתאם בין brain ↔ mascot ↔ user |
| `animations.js` | ✅ | mood → animation mapping (greet/think/excited/confused/idle) |
| `mascot.svg` | ✅ | הדמות הגרפית של קליפי |

### אפליקציית Desktop — Electron (`desktop/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `main.js` | ✅ | Electron main process, חלון שקוף always-on-top |
| `renderer.js` | ✅ מקומפל | ממשק המשתמש |
| `index.html` | ✅ | UI המלא של האפליקציה |
| `dist-installer/` | ✅ | Windows installer מוכן להתקנה |

### אגנט / שיחה (`agent/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `dialogue.js` | ✅ | מנהל היסטוריית שיחה + בניית תגובה |
| `actions.js` | ✅ | פעולות שקליפי יכול לבצע |
| `memory.js` | ✅ | זיכרון ארוך-טווח של העדפות |

### תשתית
| קובץ | מצב | תיאור |
|------|-----|--------|
| `shared/constants.js` | ✅ | STORAGE_KEY, message types, cooldowns |
| `tests/` | ✅ | brain.test, classifier.test, questions.test, state.test |
| `web/index.html` | ✅ | אתר הנחיתה — **פעיל ב-Netlify** |

---

## מה חסר / לא מוכן ❌

### 1. **Badge הסבר ויזואלי על פוסטים** — הדבר הכי חשוב ❌
> הבטחנו: "כל פוסט מקבל הסבר — צפייה קודמת +62%, טרנד +24%, ממומן +14%"
> 
> מה קיים: קליפי *אומר* משהו בבלון. אין תגית שמופיעה *על הפוסט עצמו*.

**מה צריך לבנות:**
- `extension/content/post-badge.js` — תגית/badge שמופיע מתחת לפוסט
- מראה: קטגוריה + צבע + 2-3 אותות עם ‎%‎ + כפתור ❌

### 2. **חישוב אותות מרובים** ❌
> כרגע: מחזיר רק "פוליטיקה — 47% מהפיד שלך"
> 
> צריך: 3 אותות נפרדים (היסטוריה אישית, משקל פידבק, תדירות session)

**מה צריך לבנות:**
- פונקציה `buildSignals(categoryId, allTimeStats, weights, sessionStats)` ב-`brain/intent.js`

### 3. **אייקונים חסרים** ❌
> `icon16.png` ו-`icon32.png` חסרים (build.bat מתריע)
> 
> **פתרון:** פתח `extension/icon-generator.html` בדפדפן ← "הורד את כל האייקונים"

### 4. **bundle.js לא מסונכרן עם הקוד** ⚠️
> הקוד המקור עודכן אבל הבundle הקומפל עלול להיות ישן.
> 
> **פתרון:** הרץ `npm run build` לפני כל בדיקה של התוסף.

### 5. **clippyjs ו-CSP של MV3** ⚠️
> Manifest V3 אוסר on `unsafe-eval` — clippyjs משתמשת ב-new Function().
> ייתכן שהתוסף נחסם ב-Chrome חדש.
> 
> **פתרון אפשרי:** החלף את דמות קליפי ב-SVG + CSS animation מותאמת.

### 6. **הפופ-אפ — ממשק דל** ⚠️
> מציג גרפים וסטטיסטיקות אבל לא מספיק ידידותי למשתמש חדש.

---

## תהליך Build

```bash
# בנה את כל קבצי ה-JS המקומפלים
npm run build

# בנה רק את התוסף (content script)
npx esbuild extension/content/bundle-entry.js --bundle --format=iife --outfile=extension/content/bundle.js

# בנה רק את אפליקציית Desktop
npm run build:desktop

# צור installer של Windows
npm run dist
```

---

## להתקין את התוסף (מצב מפתח)

1. הרץ `npm run build`
2. פתח `chrome://extensions`
3. הפעל "מצב מפתח"
4. "טען תוסף לא ארוז" ← בחר תיקיית `extension/`

---

## הצעד הבא המומלץ

**בנה `post-badge.js`** — זהו הפיצ'ר שיהפוך את קליפי מ"מסביר בבלון" ל"מציג הסבר על כל פוסט". זה יביא את המוצר לתואם עם מה שמובטח באתר.
