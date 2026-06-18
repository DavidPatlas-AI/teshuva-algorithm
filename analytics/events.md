# Analytics Events

> כל האנליטיקס הוא **מקומי בלבד** — לא נשלח לשרת.  
> נאסף ב-`chrome.storage.local` ומוצג בפופ-אפ ובדוחות.

---

## אירועים שנאספים

| Event | When | Data |
|-------|------|------|
| `extension.installed` | First install | `{ version }` |
| `session.start` | Tab opened on social site | `{ site, timestamp }` |
| `post.seen` | Feed post classified | `{ categoryId, site }` |
| `feedback.positive` | User pressed + | `{ categoryId }` |
| `feedback.negative` | User pressed - | `{ categoryId }` |
| `question.asked` | Question shown | `{ categoryId }` |
| `question.answered` | User answered | `{ categoryId, answer: 'yes'|'no' }` |
| `popup.opened` | Popup opened | `{}` |
| `popup.tab` | Tab changed in popup | `{ tab }` |
| `mascot.clicked` | Clippy clicked | `{}` |
| `insight.shown` | Intent explanation shown | `{ categoryId, intentType }` |

---

## מה לא נאסף

- תוכן הפוסטים (רק categoryId)
- כתובות URL ספציפיות
- מזהה משתמש / אימייל
- כל מידע אישי מזהה

---

## שימוש בנתונים

- **הפופ-אפ** — מציג אירועי session בזמן אמת
- **Weekly Insights** — ניתוח על פני 7 ימים
- **Debug mode** — `brain.debug.score(text)` לניפוי
