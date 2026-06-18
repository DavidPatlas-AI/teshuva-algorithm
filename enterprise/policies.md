# Enterprise Policies — מדיניות ארגונית

## Content Policies

ארגון יכול להגדיר:

### Category Policies

```json
{
  "politics": {
    "blocked":       false,
    "alertThreshold": 0.6,
    "autoHide":      false,
    "label":         "פוליטיקה"
  },
  "gambling": {
    "blocked":      true,
    "autoHide":     true
  }
}
```

### Enforcement Modes

| Mode | תיאור |
|------|--------|
| `monitor` | רק מדידה, ללא התערבות (default) |
| `alert` | התראה למשתמש כשמעל threshold |
| `hide` | הסתרת תוכן חסום אוטומטית |
| `block` | חסימה מלאה (לא ניתן לגשת) |

---

## Data Retention Policy

| נתון | תקופה |
|------|-------|
| Analytics events | 90 ימים |
| User profiles | כל עוד המנוי פעיל + 30 ימים |
| Audit logs | 2 שנים (compliance) |
| Encrypted backups | 30 ימים |

---

## GDPR / Privacy Compliance

- **Right to Access**: המשתמש יכול לבקש dump מלא של הנתונים שלו
- **Right to Erasure**: מחיקה מלאה תוך 30 ימים מבקשה
- **Data Portability**: ייצוא JSON/CSV
- **DPA**: חוזה עיבוד נתונים זמין לחתימה
