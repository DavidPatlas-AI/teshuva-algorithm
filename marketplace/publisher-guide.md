# Publisher Guide — מדריך לפרסום ב-Marketplace

## שלב 1 — הכן את הפריט

צור תיקייה עם:
```
my-skin/
├── manifest.json   ← חובה
├── index.js        ← entry point
├── preview.gif     ← תמונת תצוגה מקדימה (400×300 px)
└── README.md       ← הסבר קצר
```

מלא את `manifest.json` לפי `manifest-schema.json`.

---

## שלב 2 — בדוק מקומית

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/teshuva-algorithm
cd teshuva-algorithm

# Install your skin locally
cp -r my-skin/ skins/

# Test it
npm run build
# Load extension and verify skin works
```

---

## שלב 3 — שלח PR

1. Fork את הפרויקט
2. הוסף את הסקין ל-`skins/` או הפלאגין ל-`plugins/`
3. כתב בדיקה ב-`tests/`
4. שלח Pull Request עם כותרת: `skin: My Skin Name` / `plugin: My Plugin Name`

---

## שלב 4 — ביקורת

- Bot בודק אוטומטית: schema, entry file, preview
- Maintainer עושה code review
- אחרי approve — merge ופרסום אוטומטי ב-Marketplace

---

## כללי פרסום

- **ללא קוד זדוני** — אין fetch לשרתים חיצוניים בלי הסבר
- **ללא מעקב** — אין שמירת מידע אישי מזהה
- **MIT License** — קוד חייב להיות פתוח
- **preview חובה** — GIF אנימטיבי מומלץ

---

## הכנסות

- פריטים חינמיים: 100% בחינם לנצח
- פריטים בתשלום: 70% למפתח, 30% לפלטפורמה (עתידי)
