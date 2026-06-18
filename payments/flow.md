# Payments Flow — תהליך רכישה

## ספק תשלומים: Stripe

---

## זרימה מלאה

```
1. המשתמש לוחץ "שדרג לפרימיום" (בפופ-אפ / modal)
        ↓
2. פתיחת Stripe Checkout בחלון חדש
   (לא iframe — Stripe דורש חלון מלא להגנה)
        ↓
3. המשתמש מזין פרטי כרטיס ומאשר
        ↓
4. Stripe שולח webhook לשרת
        ↓
5. השרת מייצר license key (JWT / UUID4)
        ↓
6. התוסף מקבל license key (via background → popup callback)
        ↓
7. chrome.storage.local.set({ licenseKey, tier, expiresAt })
        ↓
8. paywall.js → unlockFeatures()
        ↓
9. Clippy: "ברוך הבא לפרימיום! 🎉"
```

---

## מבנה License Key

```json
{
  "sub":   "uuid-v4",
  "tier":  "premium",
  "iat":   1718000000,
  "exp":   1749536000
}
```

(JWT חתום ב-HS256 עם secret השרת)

---

## טיפול בפקיעת מנוי

1. `paywall.validateLicense()` בודק `exp`
2. אם פג תוקף → modal "המנוי שלך פג"
3. מציע חידוש מיידי
4. פיצ'רי פרימיום נכבים בהדרגה (grace period 7 ימים)

---

## טסטינג

```js
// מצב dev: לדלג על license check
const DEV_BYPASS = process.env.DEV_PREMIUM === 'true'
```

ב-production — הסר את ה-bypass לחלוטין.
