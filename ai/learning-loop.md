# Learning Loop — לולאת הלמידה

## עקרון

הדמות לומדת ממך לאורך זמן דרך 3 מנגנונים:

1. **Implicit** — כל פוסט שמוצג → allTime count עולה
2. **Explicit** — 👍/👎 → weight עולה/יורד
3. **Context** — הקשר של הגלישה → recommendations משתפרות

---

## מחזור הלמידה

```
פוסט מופיע בפיד
  ↓
brain.observe(text) → categoryId
  ↓
state.incrementSession(categoryId)    ← implicit
  ↓
controller.onPostSeen → שואל שאלה?
  ↓ כן
brain.positive/negative(categoryId)   ← explicit
  ↓
state.adjustWeight()
  ↓
context.addPost(text, categoryId)     ← context memory
  ↓ כל 20 פוסטים
context.consolidate() → long-term memory
```

---

## Weight Evolution

משקל מתחיל ב-1.0 ומשתנה:
- 👍 → +0.15 (מקסימום 3.0)
- 👎 → -0.08 (מינימום 0.1)

אחרי שבוע ללא פעילות בקטגוריה → drift חזרה ל-1.0 (decay rate: 0.02/day)

---

## Short-term vs Long-term Memory

| | Short-term | Long-term |
|--|-----------|-----------|
| גודל | 20 פוסטים אחרונים | 100 entries |
| תוכן | טקסט + קטגוריה | summary + dominant topics |
| שימוש | context מיידי | דפוסים לאורך זמן |
| TTL | עד consolidate | לנצח (עם max limit) |

---

## שיפור לאורך זמן

```
יום 1:  brain מסווג נכון ~70%
יום 7:  weights מכוונים → ~80%
יום 30: context memory → ~85%
יום 90: long-term patterns → ~90%+
```

---

## Privacy

כל הנתונים נשמרים **מקומית בלבד** ב-`chrome.storage.local` / `electron-store`.  
אין שום נתון שנשלח לשרת חיצוני (בגרסה החינמית והפרימיום).  
רק ב-Pro ובאישור מפורש מתבצע סנכרון E2E מוצפן.
