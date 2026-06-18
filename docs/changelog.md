---
layout: page
title: "שינויים"
permalink: /changelog/
---

<div dir="rtl">

# Changelog

## v0.3.0 — 2026-06-16

### חדש
- **GitHub Pages** — תיעוד מלא ב-docs/ (mascot, brain, extension, desktop, roadmap)
- **דף נחיתה** — landing-page.html שיווקי
- **Intent Engine** — brain.intent() מחזיר הסבר עמוק (dominant/recurring/first-time)
- **shared/constants.js** — מקור אמת יחיד לקבועים (STORAGE_KEY, MSG, EVENTS)
- **shared/event-bus.js** — event bus מודולרי
- **extension/api.js** — פרוטוקול הודעות מאובחן (popup ↔ background)
- **בדיקות אוטומטיות** — brain.test.js, state.test.js, classifier.test.js, questions.test.js
- **USAGE-GUIDE.md** — מדריך מפתח עברי מלא

### שיפורים
- `bundle-entry.js` מואחד — אפס לוגיקה inline, הכל ב-mascot-controller
- `popup-entry.js` משתמש ב-api.js במקום chrome.storage ישיר
- `questions.js` הפך לפקטורי (state מבודד לכל instance)
- Migration אוטומטי של נתוני v0.1.x ב-background

### תיקוני באגים
- קונפליקט storage keys (allTime vs teshuva_state)
- `.clippy-container` class לא קיים — תוקן ל-`agent._el`
- Popup time-labels השתמשו ב-grid-column בתוך flex container
- `start-drag` IPC handler חסר ב-main.js
- CATEGORIES_META מפוצל בשלושה מקומות — אוחד ל-categories.js

---

## v0.2.0 — 2026-06

### חדש
- ארכיטקטורת **brain/** מודולרית (state, classifier, explanations, questions)
- שכבת **mascot/** עם IMascot interface
- **mascot-controller** — גשר מרכזי brain ↔ mascot
- **Idle animation loop** — כל 15 שניות
- **Storage Adapter pattern** — Chrome ו-Electron באותו brain
- 4 **esbuild bundle targets**
- **Electron desktop app** — שקוף, always-on-top, tray icon, גרירה

### שיפורים
- Mood mapping: greet / think / excited / confused / idle
- Speak cooldown (9 שניות) נגד spam

---

## v0.1.0 — 2026-05

### חדש
- MVP: תוסף Chrome ראשון
- Clippy מופיע ב-Twitter/YouTube/Instagram/TikTok
- סיווג קטגוריות (9 קטגוריות)
- פופ-אפ בסיסי עם סטטיסטיקות

</div>
