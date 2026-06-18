---
layout: page
title: "מפת דרכים"
permalink: /roadmap/
---

<div dir="rtl">

# מפת דרכים

## v0.3.0 — GitHub Release (הנוכחי)

- [x] ארכיטקטורת Brain מודולרית (state, classifier, explanations, questions, intent)
- [x] שכבת Mascot עם ממשק IMascot
- [x] mascot-controller — גשר מרכזי ללא לוגיקה מפוזרת
- [x] shared/constants.js + shared/event-bus.js
- [x] 4 bundle targets (esbuild)
- [x] Storage Adapter pattern (Chrome + Electron)
- [x] פרוטוקול הודעות api.js (popup ↔ background)
- [x] Intent Engine (dominant/recurring/first-time/test/explicit)
- [x] בדיקות אוטומטיות (brain, state, classifier, questions)
- [x] GitHub Pages
- [x] USAGE-GUIDE מלא בעברית

---

## v0.4.0 — UX

- [ ] **Onboarding**: מסך ברוך הבא + הסבר קצר בפעם הראשונה
- [ ] **Dashboard**: עמוד סטטיסטיקות חזותי עם גרפים (Chart.js)
- [ ] **Notifications**: הודעות דחיפה של Chrome לתובנות שבועיות
- [ ] **Dark mode**: תמיכה ב-`prefers-color-scheme`
- [ ] **Custom categories**: המשתמש מגדיר קטגוריות משלו

---

## v0.5.0 — AI

- [ ] **LLM classification**: שיפור דיוק הסיווג עם מודל שפה קטן
- [ ] **Personalized insights**: ניתוח דפוסים על פני שבועות
- [ ] **Cross-platform**: Firefox extension
- [ ] **Export**: ייצוא נתונים ל-CSV / JSON

---

## v1.0.0 — מוצר

- [ ] **Chrome Web Store**: פרסום רשמי
- [ ] **Multi-language**: אנגלית + ערבית
- [ ] **Privacy mode**: מצב בלי אחסון בכלל
- [ ] **Open API**: endpoint ציבורי לשיתוף insights (אנונימי)

---

## רעיונות לעתיד

- תמיכה בדמויות נוספות (לא רק Clippy)
- אינטגרציה עם RSS readers
- מצב "Focus" — Clippy מסתיר עצמו בזמן עבודה

</div>
