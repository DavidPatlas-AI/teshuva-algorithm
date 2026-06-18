# Upgrade Flow — מסלול שדרוג

## טריגרים לשדרוג

הדמות מציגה הצעת שדרוג במקרים:

1. אחרי 7 ימי שימוש — "כבר שבוע שאני עוזר לך! רוצה לראות מה עוד יש?"
2. כשהמשתמש מנסה פיצ'ר פרימיום — modal עם הסבר
3. אחרי 50 פוסטים מסווגים — "הגעת ל-50 פוסטים! בפרימיום יש לי עוד הרבה מה להגיד..."
4. בדוח שבועי — "הדוח השבועי זמין רק לפרימיום — רוצה לנסות?"

## זרימת שדרוג

```
משתמש לוחץ "שדרג"
  ↓
Modal: "Clippy פרימיום" עם השוואת תוכניות
  ↓
בחירת תוכנית
  ↓
חלון תשלום (Stripe embedded)
  ↓
אישור → שמירת license key ב-chrome.storage.local
  ↓
Clippy: "ברוך הבא לפרימיום! 🎉 בואו נסתכל על השבוע שלך..."
  ↓
פתיחת Weekly Insights ראשון
```

## בדיקת License

```js
// premium/license.js
export async function isPremium() {
  const { licenseKey } = await chrome.storage.local.get('licenseKey')
  if (!licenseKey) return false
  // validate against server (or local hash for MVP)
  return validateKey(licenseKey)
}

export function isPremiumFeature(featureId) {
  return PREMIUM_FEATURES.includes(featureId)
}
```

## Feature Gating

```js
import { isPremium, isPremiumFeature } from '../premium/license.js'

async function useFeature(featureId, fn) {
  if (!isPremiumFeature(featureId)) return fn()
  if (await isPremium()) return fn()
  showUpgradeModal(featureId)
}
```
