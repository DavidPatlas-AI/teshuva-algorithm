# Admin Dashboard — לוח ניהול ארגוני

## תצוגות

### 1. Users Overview
- מספר משתמשים פעילים (יומי / שבועי / חודשי)
- התפלגות לפי tier (free / premium / pro)
- retention rate (7d / 30d / 90d)

### 2. Content Analytics (Aggregated, Anonymized)
- קטגוריות מובילות ברמת הארגון
- שינויים במגמות שבוע-על-שבוע
- רשתות חברתיות שנגשו אליהן הכי הרבה

### 3. Policy Compliance
- אחוז עמידה ב-content policies
- דוח חסימות (posts blocked / hidden)
- ניהול whitelist / blacklist לקטגוריות

### 4. Audit Log
- כל פעולת admin עם timestamp + user
- שינויים ב-permissions
- login events

---

## גישה ל-Dashboard

```
https://enterprise.teshuva-algorithm.com/dashboard
```

מאובטח עם:
- SSO (SAML 2.0 / OAuth 2.0)
- MFA חובה לאדמינים
- IP whitelist אופציונלי
- Session timeout: 30 דקות

---

## הרשאות Admin

| Role | יכולות |
|------|--------|
| `viewer` | קריאת לוחות בלבד |
| `editor` | עריכת policies |
| `admin` | ניהול משתמשים + policies |
| `super-admin` | כל הגישות + billing |
