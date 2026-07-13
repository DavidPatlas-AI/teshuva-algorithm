# mobile/ — האלגוריתם שחזר בתשובה · React Native

אפליקציית מובייל (Android + iOS) שמביאה את קליפי לטלפון — אותו "מוח" מסווג תוכן שכבר רץ בתוסף Chrome ובאפליקציית ה-Electron.

## סטטוס נוכחי

השלד קיים ועובד ברמת ה-UI (מסכים, ניווט, מסכת קליפי מונפשת, מודול native לבועה צפה באנדרואיד), אבל **עדיין לא מחובר ללוגיקה אמיתית**. הוא קורא היום לשרת HTTP מדומה (`src/api/brain-server-stub.js`) שמחזיר נתונים רנדומליים קבועים מראש — אין שרת אמיתי ולא יהיה.

| שלב | מה | סטטוס |
|-----|-----|--------|
| 1 | הרצת השלד הקיים על Android (נתונים מזויפים) — הוכחת toolchain | ✅ הושלם (2026-07-13, אחרי שדרוג ל-RN 0.81.6 — ראו CLAUDE.md) |
| 2 | חיבור ה-`brain/` האמיתי מקומית במכשיר (בלי שרת) | ⏳ ממתין |
| 3 | חיזוק Android ל-production (חתימה, אייקונים, בועה צפה אמיתית) | ⏳ ממתין |
| 4 | פרסום ל-Google Play | ⏳ ממתין לאישור |
| 5 | יציבות אחרי השקה + החלטת מונטיזציה | ⏳ ממתין |
| 6 | פורט ל-iOS (build בענן — אין Mac מקומי) | ⏳ ממתין לאישור |

## ארכיטקטורה — למה בלי שרת

`brain/brain-api.js` (בשורש הפרויקט) הוא JS טהור, בלי תלות ב-DOM, עם ממשק אחסון ניתן-להזרקה (`{get(key), set(key,value)}`). התוסף (`chrome-adapter.js`) וה-desktop (`electron-adapter.js`) כבר מריצים אותו מקומית, כל אחד עם ה-storage המתאים לו. המובייל יעבוד באותה שיטה בדיוק:

```
brain/adapters/react-native-adapter.js   ← @react-native-async-storage/async-storage (שלב 2, טרם נכתב)
```

**אין ואינו מתוכנן שרת HTTP אמיתי.** זה גם מפשט מאוד את הצהרת הפרטיות מול Play/Apple: שום תוכן לא עוזב את המכשיר.

```
mobile/
├── config.json               ← פרמטרים (brain_api יוסר בשלב 2)
├── index.js                  ← נקודת כניסה
├── src/
│   ├── App.js                ← ניווט + FloatingBubble עטוף בכל המסכים
│   ├── api/
│   │   ├── brain.js               ← כרגע fetch לשרת מדומה; בשלב 2 ייבוא ישיר מ-brain/brain-api.js
│   │   └── brain-server-stub.js   ← שרת http() גולמי (לא Express, למרות התיעוד הפנימי) עם נתונים מזויפים — ייצא משימוש בשלב 2
│   ├── mascot/Clippy.js       ← SVG + Reanimated (bob, look, excited, confused)
│   ├── components/
│   │   ├── SpeechBubble.js
│   │   └── FloatingBubble.js
│   ├── screens/
│   │   ├── InsightsScreen.js, ExplainScreen.js, SettingsScreen.js, MascotMenu.js
│   ├── services/
│   │   ├── BrainService.js        ← כרגע מדבר בשפת ה-stub (explain/getMood/sendFeedback); בשלב 2 ישוכתב לשפת brain-api.js האמיתית (observe/positive/negative/recordDismiss/getStats/signals)
│   │   └── FloatingService.js     ← SYSTEM_ALERT_WINDOW + lifecycle (Android בלבד)
│   ├── hooks/
│   │   ├── useClippyMessages.js, useBrainApi.js
│   └── animations/
│       └── bob.js, fade.js, popin.js, glowpulse.js
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── java/com/teshuva/
│           ├── FloatingService.java, OverlayPermissionModule.java, OverlayPermissionPackage.java, MainApplication.java
└── ios/
    └── TeshuvaAlgorithm.xcodeproj   ← קיים, אבל בלי .xcassets/AppIcon — ייבנה בשלב 6
```

⚠️ **9 הקטגוריות האמיתיות** (politics/sports/entertainment/tech/news/health/economy/religion/science, ב-`brain/categories.js`) שונות מ-5 הקטגוריות המזויפות שמופיעות היום ב-`brain-server-stub.js`. הן יתעדכנו בשלב 2 יחד עם החיבור האמיתי.

---

## התקנה (שלב 1 — עדיין עם נתונים מזויפים)

```bash
cd mobile
npm install

# Android
npx react-native run-android

# iOS — לא ניתן להריץ מקומית בלי Mac, ראה שלב 6
```

### דרישות
- Node 18+, Java 17, Android SDK (`ANDROID_HOME`)
- **מכשיר Android פיזי עם USB debugging מופעל (מומלץ)** או Android Virtual Device

### חיבור לשרת המדומה (זמני, יוסר בשלב 2)

```bash
npm run stub   # מריץ שרת מדומה על localhost:3000
```

- `config.json` כרגע מצביע על `http://localhost:3000/api` — זה **לא יעבוד** לא באמולטור (צריך `10.0.2.2`) ולא בטלפון פיזי כמו שהוא.
- לטלפון פיזי דרך USB: `adb reverse tcp:3000 tcp:3000` פותר את זה בלי לגעת ב-config.
- לאמולטור: לשנות ל-`http://10.0.2.2:3000/api`.

---

## הרשאות Android

| הרשאה | למה |
|-------|-----|
| `SYSTEM_ALERT_WINDOW` | Floating bubble מעל אפליקציות אחרות |
| `FOREGROUND_SERVICE` / `FOREGROUND_SERVICE_SPECIAL_USE` | FloatingService רץ ברקע — שתיהן דורשות justification נפרד ב-Play Console בשלב 4 |
| `INTERNET` | כרגע ל-fetch לשרת המדומה בלבד — יוסר בשלב 2 |

בהרצה ראשונה באנדרואיד: האפליקציה תפתח אוטומטית את מסך ההגדרות לאשר "הצג מעל אפליקציות אחרות".

## iOS

ב-iOS הבועה הצפה רצה **בתוך** חלון האפליקציה בלבד (iOS לא מאפשר overlay על אפליקציות אחרות ללא App Extension). אין Mac זמין מקומית — בניית iOS תתבצע דרך שירות build בענן בשלב 6, לא לפני שהאנדרואיד עובד מקצה לקצה.
