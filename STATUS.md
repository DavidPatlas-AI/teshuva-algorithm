# סטטוס פרויקט — האלגוריתם שחזר בתשובה
*עודכן: יוני 2026*

---

## מה כבר בנוי ✅

### תוסף Chrome (`extension/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `manifest.json` | ✅ מוכן | MV3, כל 5 פלטפורמות, הרשאות storage/history/tabs |
| `background.js` | ✅ מקומפל | שמירת סטטיסטיקות, weights, הגדרות |
| `content/bundle.js` | ✅ מקומפל (86KB) | content script — SVG mascot, ללא clippyjs |
| `content/feed-observer.js` | ✅ | MutationObserver + scroll detection לאיתור פוסטים חדשים |
| `content/site-adapters.js` | ✅ | CSS selectors ל-Twitter/X, Facebook, Instagram, YouTube, TikTok |
| `content/action-engine.js` | ✅ | לוחץ "Not Interested" / "Hide" בשם המשתמש — 5 פלטפורמות |
| `content/dialogue-ui.js` | ✅ | שדה קלט טקסטואלי — שאל את קליפי |
| `content/feedback-ui.js` | ✅ | כפתורי 👍/👎 שמופיעים כשקליפי שואל שאלה |
| `content/youtube-innertube.js` | ✅ | מיירט YouTube InnerTube API לכותרות לפני render |
| `content/post-badge.js` | ✅ | Badge ויזואלי על כל פוסט: קטגוריה + 3 אותות + % + כפתור ❌ |
| `popup/popup.html + popup.js` | ✅ | חלון פופ-אפ עם סטטיסטיקות וגרפים |
| `popup/onboarding.html` | ✅ | 5 שקפי onboarding למשתמשים חדשים |
| `icons/` | ✅ | icon16/32/48/128.png |

### המוח (`brain/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `categories.js` | ✅ | 9 קטגוריות: פוליטיקה, ספורט, בידור, טכנולוגיה, חדשות, בריאות, כלכלה, מדע, דת |
| `classifier.js` | ✅ | ניקוד keyword-based עם משקלות (w:1/2/3) |
| `explanations.js` | ✅ | הסברים לפי קטגוריה, תובנות שבועיות, ברכות שעתיות |
| `intent.js` | ✅ | 5 סוגי כוונה: DOMINANT / RECURRING / FIRST_TIME / TEST / EXPLICIT |
| `signals.js` | ✅ | 3 אותות נפרדים: היסטוריה אישית, משקל עניין, תדירות סשן |
| `brain-api.js` | ✅ | API ציבורי יחיד — observe, explain, intent, signals, getStats |
| `state.js` | ✅ | אבסטרקציה לאחסון (session + allTime + weights + dismissed) |
| `adapters/` | ✅ | chrome-adapter + electron-adapter |

### המסכה — קליפי (`mascot/`)
| קובץ | מצב | תיאור |
|------|-----|--------|
| `svg-mascot.js` | ✅ | מסכת SVG + CSS — CSP-safe לחלוטין, אין eval/new Function |
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
| `web/index.html` | ✅ | אתר הנחיתה — **פעיל ב-Netlify**, מתורגם: עברית / אנגלית / רוסית |

---

## מה עוד ניתן לשפר 🔧

### 1. **בדיקה אמיתית על אתרים** ⚠️
> התוסף לא נבדק בדפדפן Chrome אמיתי על Twitter / Facebook.
> לבדיקה: טען כ-Unpacked extension, פתח Twitter, וודא שקליפי מופיע.

### 2. **site-adapters.js לפלטפורמות החדשות** ⚠️
> LinkedIn, Reddit, Threads נוספו ל-manifest אבל אין להן CSS selectors ב-site-adapters.js.
> קליפי יופיע אבל לא יזהה פוסטים — צריך להוסיף selectors.

---

## תהליך Build

```bash
# בנה את כל קבצי ה-JS המקומפלים
npm run build

# בנה רק את התוסף (content script)
npx esbuild extension/content/bundle-entry.js --bundle --format=iife --outfile=extension/content/bundle.js
```

---

## להתקין את התוסף (מצב מפתח)

1. הרץ `npm run build`
2. פתח `chrome://extensions`
3. הפעל "מצב מפתח"
4. "טען תוסף לא ארוז" ← בחר תיקיית `extension/`
