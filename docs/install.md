---
layout: page
title: "התקנה"
permalink: /install/
---

<div dir="rtl">

# התקנה מלאה

## דרישות מקדימות

- Node.js גרסה 18 ומעלה
- Chrome או Edge (גרסה 100+)
- Windows / macOS / Linux

---

## שלב 1 — שכפל את הפרויקט

```bash
git clone https://github.com/YOUR_USERNAME/teshuva-algorithm
cd teshuva-algorithm
```

---

## שלב 2 — התקן תלויות

```bash
npm install
```

---

## שלב 3 — בנה את הקבצים

```bash
npm run build
```

פעולה זו מייצרת:

| קובץ | גודל | תיאור |
|------|------|--------|
| `extension/content/bundle.js` | ~1.9MB | סקריפט תוכן (כולל Clippy) |
| `extension/background.js` | ~10KB | Service Worker |
| `extension/popup/popup.js` | ~19KB | ממשק הפופ-אפ |
| `desktop/renderer.js` | ~1.9MB | גרפיקת Clippy לדסקטופ |

---

## שלב 4 — טען את התוסף לדפדפן

1. פתח `chrome://extensions`
2. הפעל **Developer mode** (פינה ימנית עליונה)
3. לחץ **Load unpacked**
4. בחר את תיקיית `extension/`
5. עבור ל-Twitter, YouTube, או Instagram — Clippy יופיע!

---

## שלב 5 (אופציונלי) — הפעל את גרסת הדסקטופ

```bash
npm start
```

Clippy יופיע בפינה הימנית-תחתונה של שולחן העבודה.

---

## פתרון בעיות נפוצות

**Clippy לא מופיע:**
- ודא שה-build הצליח (אין שגיאות ב-console)
- רענן את התוסף ב-`chrome://extensions`

**שגיאת CORS בצד ה-background:**
- פתח DevTools של Service Worker ב-`chrome://extensions` → Inspect

**Electron לא נפתח:**
- ודא ש-`npm install` הורד את Electron: `ls node_modules/electron/dist/`

</div>
