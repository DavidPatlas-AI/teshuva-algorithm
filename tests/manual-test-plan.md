# Manual Test Plan — האלגוריתם שחזר בתשובה

בדיקות ידניות לאימות שכל השכבות מתחברות נכון.  
מבצעים לפני כל release.

---

## הכנה

```bash
npm run build
```

טען את `extension/` ב-`chrome://extensions` (Developer mode → Load unpacked).

---

## A — זיהוי פוסט חדש

**מטרה:** feed-observer → mascot-controller → brain → Clippy מדבר

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| A1 | פתח [localhost test-page.html](../test-page.html) בדפדפן | Clippy מופיע בפינה ימנית-תחתונה |
| A2 | המתן 1 שנייה | Clippy אומר ברכה: "בוקר טוב!" / "ערב טוב!" |
| A3 | גלול לאט מטה | Clippy שותק (cooldown 9 שניות בין דיבורים) |
| A4 | המתן 10 שניות, גלול שוב | Clippy מסביר קטגוריה שזוהתה |
| A5 | בדוק ב-DevTools → Application → Extension Storage | `teshuva_state.allTime` מתעדכן |

**שכבות שנבדקות:** `feed-observer.js` → `mascot-controller.onPostSeen()` → `brain.observe()` → `chrome.storage`

---

## B — הצגת שאלה (אחרי 5 פוסטים מאותה קטגוריה)

**מטרה:** questions.shouldAsk → Clippy שואל → pending question נשמר

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| B1 | גלול מהר על 5+ פוסטים מאותה קטגוריה | Clippy שואל "האם זה מעניין אותך?" |
| B2 | בדוק שהאנימציה היא **think** (מהרהר) | Clippy נראה חושב |
| B3 | לחץ `+` על המקלדת | Clippy אומר "תודה! אסמן שאתה אוהב X" + אנימציית **excited** |
| B4 | בדוק ב-storage | `teshuva_state.weights[catId]` עלה ב-0.15 |

---

## C — הצגת הסבר (explain)

**מטרה:** brain.intent() → text עמוק → Clippy explain mood

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| C1 | גלול על פוסטי ספורט | Clippy אומר משהו על ספורט |
| C2 | בדוק שהאנימציה היא **think** | לא excited, לא confused |
| C3 | ההסבר מכיל % ו"למה" | כולל אחוז וסוג intent |

---

## D — לחיצת 👍 / 👎

**מטרה:** brain.positive/negative → weight מתעדכן → Clippy מגיב

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| D1 | לחץ `+` בזמן שיש שאלה פתוחה | `weights[catId]` עלה, Clippy **excited** |
| D2 | לחץ `-` בזמן שיש שאלה פתוחה | `weights[catId]` ירד, Clippy **confused** |
| D3 | לחץ `+` בלי שאלה פתוחה | אין שינוי (pendingQ = null) |

---

## E — עדכון סטטיסטיקות

**מטרה:** storage מתעדכן → popup מציג נכון

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| E1 | גלול 10+ פוסטים | ספירות עולות ב-storage |
| E2 | פתח את הפופ-אפ (לחץ על icon התוסף) | Tab "Overview" — ספירות תואמות |
| E3 | לחץ Tab "Categories" | עמודות לפי קטגוריות |
| E4 | לחץ Tab "History" | גרף שעות, דומיינים |
| E5 | לחץ Tab "Insights" | תובנות כמו אחוז גלישה חברתית |

---

## F — טעינת Popup

**מטרה:** popup → api.getStats() → background.js → storage

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| F1 | פתח פופ-אפ | טוען תוך < 500ms |
| F2 | בדוק header | מציג מספר ביקורים ב-7 ימים |
| F3 | פתח DevTools של background (chrome://extensions → Inspect) | אין errors בconsole |
| F4 | שלח ידנית ב-console: `chrome.runtime.sendMessage({type:'GET_STATS'}, console.log)` | `{ ok: true, data: { allTime: {...} } }` |

---

## G — Reset Stats

**מטרה:** api.resetStats() → storage מתאפס → popup מתרענן

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| G1 | פתח פופ-אפ | יש נתונים מוצגים |
| G2 | לחץ "אפס נתונים" | popup מתרענן |
| G3 | בדוק storage | `teshuva_state.allTime` — כל הערכים 0 |
| G4 | בדוק פופ-אפ | "עדיין לא זוהה תוכן" |

---

## H — הודעת פתיחה (Onboarding)

**מטרה:** ONBOARDING_KEY → הודעה ראשונה ← פעם אחת בלבד

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| H1 | מחק `teshuva_onboarded` מ-storage | — |
| H2 | רענן את הדף | Clippy: "שלום! אני האלגוריתם שחזר בתשובה..." |
| H3 | המתן 6 שניות | Clippy: "פשוט גלול כרגיל..." |
| H4 | רענן שוב | Clippy: ברכה רגילה (לא onboarding) |

---

## I — Desktop (Electron)

**מטרה:** main.js + preload.js + renderer + drag + tray

| צעד | פעולה | תוצאה צפויה |
|-----|--------|-------------|
| I1 | `npm start` | Clippy מופיע בפינה ימנית-תחתונה של המסך |
| I2 | המתן 1 שנייה | Clippy אומר ברכה + מנגן אנימציה |
| I3 | גרור את Clippy | Clippy זז עם העכבר |
| I4 | לחץ על Clippy | Clippy אומר משפט רנדומלי |
| I5 | לחץ ימני על tray icon | תפריט: הצג/הסתר | יציאה |
| I6 | לחץ double-click על tray | Clippy מסתתר/מופיע |
| I7 | המתן 15 שניות | Clippy מנגן אנימציה אוטומטית |
| I8 | המתן 45 שניות | Clippy אומר משפט אוטומטי |

---

## J — בדיקות אינטגרציה בין שכבות

**מטרה:** ודא ש-API chain שלם עובד ללא break

```
extension/content → mascot-controller ✓ (bundle-entry.js מחבר בלבד)
mascot-controller → brain-api         ✓ (brain.observe, intent, explain)
brain-api → storage adapter           ✓ (chrome-adapter → chrome.storage)
popup.js → extension/api.js           ✓ (api.getStats → sendMsg → background)
background.js → storage               ✓ (STORAGE_KEY = 'teshuva_state')
```

| בדיקה | פקודה ב-console | תוצאה צפויה |
|-------|----------------|-------------|
| J1 | `chrome.storage.local.get('teshuva_state', console.log)` | אובייקט עם allTime + weights |
| J2 | `chrome.runtime.sendMessage({type:'RECORD_SIGNAL', categoryId:'sports', type:'positive'}, console.log)` | `{ ok: true }` |
| J3 | `chrome.runtime.sendMessage({type:'RESET_STATS'}, console.log)` | `{ ok: true }` |
