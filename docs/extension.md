---
layout: page
title: "תוסף הדפדפן"
permalink: /extension/
---

<div dir="rtl">

# תוסף הדפדפן

## ארכיטקטורה

```
extension/
├── manifest.json          — הגדרות התוסף (Manifest V3)
├── background-entry.js    — קוד מקור ל-Service Worker
├── background.js          — Service Worker הנבנה (npm run build)
├── api.js                 — פרוטוקול הודעות
├── content/
│   ├── bundle-entry.js    — קוד מקור לסקריפט התוכן
│   ├── bundle.js          — סקריפט התוכן הנבנה (~1.9MB)
│   ├── feed-observer.js   — זיהוי פוסטים גלויים
│   └── site-adapters.js   — CSS selectors לכל רשת
└── popup/
    ├── popup-entry.js     — קוד מקור לפופ-אפ
    ├── popup.js           — פופ-אפ הנבנה
    └── popup.html         — תצוגת הפופ-אפ
```

---

## כיצד הסקריפט עובד

```
אתה גולש ב-Twitter
    ↓
feed-observer.js מזהה פוסטים גלויים (MutationObserver + scroll)
    ↓
mascot-controller.onPostSeen(text)
    ↓
brain.observe(text) → categoryId
    ↓
brain.intent(categoryId) → { type, heText }
    ↓
Clippy מסביר בעברית
```

---

## רשתות נתמכות

| רשת | סלקטור |
|-----|---------|
| Twitter / X | `[data-testid="tweetText"]` |
| Facebook | `[data-ad-preview="message"]` |
| Instagram | `._a9zs span` |
| YouTube | `#video-title` |
| TikTok | `[data-e2e="browse-video-desc"]` |

להוספת רשת: ערוך `extension/content/site-adapters.js`.

---

## פרוטוקול הודעות (extension/api.js)

כל תקשורת בין popup ↔ background עוברת דרך `api.js`:

```js
import { api } from './extension/api.js'

// קבל סטטיסטיקות
const stats = await api.getStats()
// → { allTime: { politics: 5 }, weights: { politics: 1.3 } }

// שלח משוב
await api.positive('sports')
await api.negative('politics')

// אפס
await api.resetStats()
```

---

## הפופ-אפ — 4 לשוניות

| לשונית | תוכן |
|--------|------|
| **סקירה** | ביקורים, רשתות חברתיות, קטגוריה מובילה |
| **קטגוריות** | עמודות לפי קטגוריה (חי + היסטוריה) |
| **היסטוריה** | גרף שעות, טופ-10 דומיינים |
| **תובנות** | 5-6 תובנות אוטומטיות שבועיות |

</div>
