# mobile/ — האלגוריתם שחזר בתשובה · React Native

אפליקציית מובייל (Android + iOS) שמחקה את קליפי הדסקטופ.

## מבנה תיקיות

```
mobile/
├── config.json               ← כתובת brain-api + פרמטרים
├── index.js                  ← נקודת כניסה
├── src/
│   ├── App.js                ← ניווט + FloatingBubble עטוף בכל המסכים
│   ├── api/
│   │   └── brain.js          ← fetch לכל endpoint של brain-api
│   ├── mascot/
│   │   └── Clippy.js         ← SVG + Reanimated (bob, look, excited, confused)
│   ├── components/
│   │   ├── SpeechBubble.js   ← בועת טקסט מונפשת
│   │   └── FloatingBubble.js ← Clippy draggable + speech bubble
│   ├── screens/
│   │   ├── InsightsScreen.js ← תובנות שבועיות + breakdown
│   │   ├── ExplainScreen.js  ← קלט טקסט → explain API → תוצאה
│   │   ├── SettingsScreen.js ← API URL, סף מחיקה, toggle overlay
│   │   └── MascotMenu.js     ← תפריט pop-up מקליפי
│   ├── services/
│   │   ├── BrainService.js   ← singleton + pub-sub לנתוני brain
│   │   └── FloatingService.js← SYSTEM_ALERT_WINDOW + lifecycle
│   ├── hooks/
│   │   ├── useClippyMessages.js ← מחזור הודעות + say()
│   │   └── useBrainApi.js    ← wrapper עם loading/error state
│   ├── animations/
│   │   ├── bob.js, fade.js, popin.js, glowpulse.js
│   └── styles/
│       └── theme.js          ← צבעים, גופנים, radius, צלל
├── android/
│   └── app/src/main/
│       ├── AndroidManifest.xml
│       └── java/com/teshuva/
│           ├── FloatingService.java       ← SYSTEM_ALERT_WINDOW foreground service
│           ├── OverlayPermissionModule.java ← React Native bridge
│           ├── OverlayPermissionPackage.java
│           └── MainApplication.java      ← רושם את OverlayPermissionPackage
```

---

## התקנה

```bash
cd mobile
npm install

# iOS (Mac only)
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### גרסת Node מינימלית: 18
### Java: 17  |  Android SDK: 34

---

## Brain API

ערוך `config.json` לפני ההרצה:

```json
{
  "brain_api": "http://192.168.1.X:3000/api"
}
```

> השתמש בכתובת ה-IP הפנימית של המחשב שלך (לא localhost)
> כי האמולטור/מכשיר הפיזי לא מגיע אל localhost של המחשב.

---

## הרשאות Android

| הרשאה | למה |
|-------|-----|
| `SYSTEM_ALERT_WINDOW` | Floating bubble מעל אפליקציות אחרות |
| `FOREGROUND_SERVICE` | FloatingService רץ ברקע |
| `INTERNET` | brain-api calls |

בהרצה ראשונה באנדרואיד: האפליקציה תפתח אוטומטית את מסך ההגדרות לאשר "הצג מעל אפליקציות אחרות".

---

## iOS

ב-iOS הבועה הצפה רצה **בתוך** חלון האפליקציה בלבד (iOS לא מאפשר overlay על אפליקציות אחרות ללא App Extension).
הפלט הוויזואלי זהה לחלוטין בתוך האפליקציה.
