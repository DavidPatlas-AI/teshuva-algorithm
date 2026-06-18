# Skins Marketplace

## מה זה סקין?

סקין מחליף את מראה הדמות (Clippy) באחרת — אנימציות שונות, קול שונה, אישיות שונה.  
הממשק נשאר זהה (`IMascot`) — רק המראה משתנה.

---

## סקינים מובנים

| שם | מזהה | תיאור | רמה |
|----|------|--------|-----|
| Clippy Classic | `clippy` | Clippy המקורי מ-Office 97 | חינמי |
| Merlin | `merlin` | קוסם מסתורי | פרימיום |
| Links | `links` | כלב ידידותי | פרימיום |
| Rocky | `rocky` | קשיח ועסקי | פרימיום |
| F1 | `f1` | מכונית מירוצים | Pro |
| Clippit 2.0 | `clippit` | גרסה מודרנית של Clippy | Pro |

---

## הורדת סקין קהילתי

```
skins/
├── default/          — Clippy המובנה
├── example-skin/     — תבנית ריקה לפיתוח
└── [name]/           — סקין קהילתי
    ├── skin.json     — מטא-דאטה
    ├── animations/   — קבצי GIF / spritesheet
    └── mascot.js     — מימוש IMascot
```

---

## פרסום סקין קהילתי

1. צור תיקייה בשם הסקין שלך
2. מלא `skin.json` (ר' schema.json)
3. צור `mascot.js` שמממש `IMascot`
4. שלח PR ל-repo עם התיקייה
5. לאחר review — הסקין נכנס ל-Marketplace
