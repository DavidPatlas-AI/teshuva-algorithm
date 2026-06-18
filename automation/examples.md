# Automation Examples — דוגמאות לחוקים אוטומטיים

## עקרון

כל חוק מורכב מ: **trigger** (מתי?) + **action** (מה קורה?)

---

## דוגמה 1 — פוליטיקה מוגזמת

```json
{
  "id": "politics-overload",
  "trigger": {
    "type": "category_percentage",
    "categoryId": "politics",
    "threshold": 0.5,
    "window": "session"
  },
  "action": {
    "type": "ask_question",
    "text": "50% מהפיד שלך הוא פוליטיקה — רוצה הפסקה?",
    "mood": "confused"
  }
}
```

**מה קורה:** אם יותר מ-50% מהפוסטים בסשן הם פוליטיקה, Clippy שואל אם המשתמש רוצה הפסקה.

---

## דוגמה 2 — רצף לייקים

```json
{
  "id": "positive-streak",
  "trigger": {
    "type": "positive_count",
    "threshold": 3
  },
  "action": {
    "type": "say",
    "text": "נראה שאתה מוצא הרבה תוכן מעניין! רוצה לראות ניתוח שבועי?",
    "mood": "excited"
  }
}
```

**מה קורה:** אחרי 3 לחיצות 👍 בסשן אחד, Clippy מציע ניתוח שבועי.

---

## דוגמה 3 — גלישה ממושכת

```json
{
  "id": "long-session",
  "trigger": {
    "type": "session_duration_min",
    "threshold": 30
  },
  "action": {
    "type": "say",
    "text": "גולש כבר חצי שעה — אולי כדאי להפסיק קצת?",
    "mood": "think",
    "cooldownMs": 3600000
  }
}
```

**מה קורה:** אחרי 30 דקות גלישה רצופה, Clippy מציין זאת.

---

## דוגמה 4 — קטגוריה חדשה

```json
{
  "id": "new-category",
  "trigger": {
    "type": "first_in_category",
    "categoryId": "*"
  },
  "action": {
    "type": "say",
    "text": "זה הפוסט הראשון שלך על ${heLabel} — מעניין!",
    "mood": "greet",
    "cooldownMs": 0
  }
}
```

**מה קורה:** בפעם הראשונה שרואים תוכן מקטגוריה חדשה, Clippy מגיב.

---

## הוספת חוק מותאם

ערוך `automation/rules.json` — אין צורך ב-rebuild.
שמור על מבנה: `{ id, name, trigger, action, enabled }`.
