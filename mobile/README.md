# mobile/ — האלגוריתם שחזר בתשובה · React Native

אפליקציית מובייל (Android + iOS) שמביאה את קליפי לטלפון — אותו "מוח" מסווג תוכן שכבר רץ בתוסף Chrome ובאפליקציית ה-Electron.

## סטטוס נוכחי

ה-`brain/` האמיתי מחובר ופועל מקומית במכשיר (AsyncStorage, בלי שרת) — סיווג טקסט, הסברים, תובנות שבועיות ומשוב חיובי/שלילי כולם אמיתיים, לא מדומים. `src/api/brain-server-stub.js` וה-fetch client הישן (`src/api/brain.js`) הוצאו משימוש והועברו ל-`_לסקירה/pre-phase2-network-stub/`.

| שלב | מה | סטטוס |
|-----|-----|--------|
| 1 | הרצת השלד הקיים על Android (נתונים מזויפים) — הוכחת toolchain | ✅ הושלם (2026-07-13, אחרי שדרוג ל-RN 0.81.6 — ראו CLAUDE.md) |
| 2 | חיבור ה-`brain/` האמיתי מקומית במכשיר (בלי שרת) | ✅ הושלם (2026-07-13 — ראו CLAUDE.md) |
| 3 | חיזוק Android ל-production (חתימה, אייקונים, בועה צפה אמיתית) | ✅ הושלם (2026-07-13/14 — ראו CLAUDE.md) |
| 4 | ניטור פיד אמיתי ב-Instagram/TikTok/Twitter (AccessibilityService) | ✅ הושלם 2026-07-14 — **sideload בלבד, לא ב-Play Store** (ראו CLAUDE.md) |
| 5 | פרסום ל-Google Play | ⏳ ממתין לאישור (ללא שלב 4 — ראו הסבר במדיניות Accessibility ב-CLAUDE.md) |
| 6 | יציבות אחרי השקה + החלטת מונטיזציה | ⏳ ממתין |
| 7 | פורט ל-iOS (build בענן — אין Mac מקומי) | ⏳ ממתין לאישור |

## ארכיטקטורה — למה בלי שרת

`brain/brain-api.js` (בשורש הפרויקט) הוא JS טהור, בלי תלות ב-DOM, עם ממשק אחסון ניתן-להזרקה (`{get(key), set(key,value)}`). התוסף (`chrome-adapter.js`), ה-desktop (`electron-adapter.js`) והמובייל (`react-native-adapter.js`) כולם מריצים אותו מקומית, כל אחד עם ה-storage המתאים לו:

```
brain/adapters/react-native-adapter.js   ← @react-native-async-storage/async-storage
```

**אין שרת HTTP.** זה גם מפשט מאוד את הצהרת הפרטיות מול Play/Apple: שום תוכן לא עוזב את המכשיר. `brain/` ו-`shared/` נמצאים מחוץ ל-root של Metro (`mobile/`) — `metro.config.js` חושף אותם דרך `watchFolders` + `resolver.nodeModulesPaths` (כדי ש-imports כמו `@react-native-async-storage/async-storage` בתוך `brain/adapters/` יפלו חזרה ל-`mobile/node_modules`).

```
mobile/
├── config.json               ← פרמטרים כלליים (בלי brain_api — הוסר, אין יותר שרת)
├── index.js                  ← נקודת כניסה
├── src/
│   ├── App.js                ← ניווט + FloatingBubble + brainService.init() לפני mount (מונע race מול AsyncStorage)
│   ├── mascot/Clippy.js       ← SVG + Reanimated (bob, look, excited, confused)
│   ├── components/
│   │   ├── SpeechBubble.js, FloatingBubble.js
│   │   └── RichText.js            ← מפרק <b>...</b> מ-weeklyInsights() ל-<Text> מודגש אמיתי
│   ├── screens/
│   │   ├── InsightsScreen.js, ExplainScreen.js, SettingsScreen.js, MascotMenu.js
│   ├── services/
│   │   ├── BrainService.js        ← עוטף createBrain(createReactNativeAdapter()); getHomeStats/explainText/getWeeklyInsights/positive/negative/reset
│   │   └── FloatingService.js     ← SYSTEM_ALERT_WINDOW + lifecycle (Android בלבד)
│   ├── hooks/
│   │   ├── useClippyMessages.js, useBrainApi.js
│   └── animations/
│       └── bob.js, fade.js, popin.js, glowpulse.js
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── java/com/teshuva/
│           ├── FloatingService.java, OverlayPermissionModule.java, OverlayPermissionPackage.java
│           └── MainApplication.kt, MainActivity.kt   ← Kotlin (RN 0.81 template API), לא Java
└── ios/
    └── TeshuvaAlgorithm.xcodeproj   ← קיים, אבל בלי .xcassets/AppIcon — ייבנה בשלב 6
```

**9 הקטגוריות האמיתיות** (politics/sports/entertainment/tech/news/health/economy/religion/science, ב-`brain/categories.js`) הן היחידות שמוצגות באפליקציה כעת — אין יותר קטגוריות מזויפות מה-stub הישן. שני נתונים שהיו מומצאים לגמרי בעבר ("מצב רוח" של האלגוריתם, "דיוק: 91%") הוסרו/הוחלפו בנתונים אמיתיים (ברכה לפי שעה, אחוז הסרה מחושב).

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

אין יותר שרת מדומה להריץ — ה-brain רץ מקומית מהרגע שהאפליקציה עולה.

---

## הרשאות Android

| הרשאה | למה |
|-------|-----|
| `SYSTEM_ALERT_WINDOW` | Floating bubble מעל אפליקציות אחרות |
| `FOREGROUND_SERVICE` / `FOREGROUND_SERVICE_SPECIAL_USE` | FloatingService רץ ברקע — שתיהן דורשות justification נפרד ב-Play Console אם/כשמגיעים לשלב 5 |
| `INTERNET` | **לא בשימוש ע"י האפליקציה עצמה** (אין fetch/network calls) — נשאר רק כי React Native's own Metro/debug bridge בפיתוח דורש אותו. אפשר להוציא ב-release build ייעודי אם רוצים manifest מינימלי יותר |

בהרצה ראשונה באנדרואיד: האפליקציה תפתח אוטומטית את מסך ההגדרות לאשר "הצג מעל אפליקציות אחרות".

**הבועה הצפה מעל אפליקציות אחרות (מ-2026-07-13) מציגה קליפי אמיתי** — vector drawable נייטיבי (`res/drawable/clippy_overlay.xml`) עם אנימציית "bob" נייטיבית (`ObjectAnimator`), לא רק נקודה שקופה. הקליפי המלא והאינטראקטיבי (עיניים עוקבות, מצבי-רוח, תפריט) נשאר בלעדי לתוך האפליקציה עצמה — ה-overlay הוא גרסה סטטית+bob בלבד, בכוונה, כדי לא לשכפל את כל מנוע ה-Reanimated בנייטיב. לחיצה על הבועה הצפה עדיין פותחת את האפליקציה; גרירה עדיין עובדת.

## חתימת Production

`mobile/android/app/release.keystore` + `mobile/android/keystore.properties` — **שניהם gitignored, אף פעם לא ב-git.** ה-`keystore.properties` (לא committed) חייב backup מחוץ לריפו (מנהל סיסמאות) — Google Play דורש את אותו מפתח חתימה לכל עדכון עתידי; אובדן שלו = אי-אפשר לעדכן את האפליקציה יותר תחת אותו רישום. `app/build.gradle` טוען את הקובץ הזה אוטומטית אם קיים ומחתים את ה-`release` build type איתו; בלעדיו, release build נופל חזרה לחתימת debug (לא ראוי לפרסום, אבל עדיין ניתן ל-build). לוודא שה-APK/AAB באמת חתום עם המפתח הנכון: `apksigner verify --print-certs app-release.apk` ולהשוות ל-fingerprint מ-`keytool -list -v -keystore release.keystore`.

## ניטור פיד אמיתי (Instagram / TikTok / Twitter) — sideload בלבד

`FeedWatcherService.kt` הוא Android `AccessibilityService` שקורא טקסט גלוי על המסך באפליקציות שברשימת היעד (`res/xml/accessibility_service_config.xml` — כרגע Instagram/TikTok/Twitter), מסווג אותו עם `ClippyClassifier.kt` (פורט נייטיבי, ידני, של `brain/categories.js` — **לעדכן ידנית בשני המקומות אם משנים קטגוריות**), ואם התוכן לא רצוי — מבצע swipe-up כדי לדלג עליו.

**⚠️ הגרסה הזו לא מיועדת ל-Google Play ולא תפורסם שם.** מדיניות ה-Accessibility API של Google אוסרת שימוש "אוטונומי" ב-API הזה על אפליקציות שאינן כלי נגישות מוסמכים, עם חריג צר ל"אוטומציה דטרמיניסטית מבוססת חוקים" — קליפי כנראה עומד בחריג הזה (המסווג הוא מילון מילות-מפתח קבוע, לא AI ששוקל), אבל בודק אנושי עלול לפרש אחרת, והסיכון הוא **ברמת חשבון המפתח כולו**, לא רק האפליקציה. ההחלטה (של דוד): רק sideload אישי.

**גישה מכוונת: סריקת טקסט כללית, לא selectors לפי אפליקציה.** בניגוד לתוסף ה-Chrome (`extension/content/site-adapters.js` — סלקטורי CSS ספציפיים לכל אתר), עצי ה-view של אפליקציות native לא ניתנים לבדיקה/יציבים כמו DOM של דפדפן. הגישה כאן קוראת את כל הטקסט הגלוי על המסך (לא משנה איזו אפליקציה) ומדלגת (swipe) אם הוא מסווג כלא-רצוי — עובד על כל אפליקציית פיד גוללת בלי תחזוקה per-app, אבל **לא שולח אות "Not Interested" לאלגוריתם של הפלטפורמה** כמו שהתוסף עושה — רק דילוג ויזואלי. הבדל אמיתי מהתוסף, מוצג כאן במפורש ולא כשוות-ערך.

**הפעלה:** אנדרואיד לא מאפשר להעניק הרשאת Accessibility אוטומטית — המשתמש חייב ללחוץ "פתח הגדרות נגישות" במסך ההגדרות ולהפעיל ידנית. אנדרואיד גם **מכבה אוטומטית** שירותי נגישות בכל עדכון/התקנה מחדש של האפליקציה (אמצעי אבטחה של המערכת) — צריך להפעיל מחדש אחרי כל `adb install -r`.

**סטטיסטיקות** נשמרות ב-`SharedPreferences` נייטיבי (`clippy_feed_watcher`), נפרד מה-AsyncStorage של `brain-api.js` (שמשקף רק בדיקות ידניות של "הסבר פוסט" בתוך האפליקציה) — `BrainService.js`'s `getHomeStats()`/`getWeeklyInsights()` ממזגים את שני המקורות לתצוגה אחת מלאה, דרך `NativeModules.OverlayPermission.getFeedWatcherStats()`.

**נבדק במגבלות הסביבה:** אין Instagram/TikTok/Twitter מותקנים על `Clippy_Test` (אמולטור בלי Play Store) — אומת המנגנון עצמו (קריאת accessibility tree אמיתי מ-Chrome, סיווג נכון, שמירת סטטיסטיקה, ביצוע swipe) לא ההתנהגות הספציפית מול Instagram/TikTok/Twitter. **דוד צריך לבדוק זאת במכשיר האמיתי שלו** אחרי sideload של ה-APK.

## iOS

ב-iOS הבועה הצפה רצה **בתוך** חלון האפליקציה בלבד (iOS לא מאפשר overlay על אפליקציות אחרות ללא App Extension). אין Mac זמין מקומית — בניית iOS תתבצע דרך שירות build בענן בשלב 6, לא לפני שהאנדרואיד עובד מקצה לקצה.
