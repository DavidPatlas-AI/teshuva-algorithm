# Contributing — איך תורמים לפרויקט

## הרצת הפרויקט

```bash
git clone https://github.com/YOUR_USERNAME/teshuva-algorithm
cd teshuva-algorithm
npm install
npm run build
```

לגרסת דסקטופ:
```bash
npm start
```

לתוסף: טען את `extension/` ב-`chrome://extensions` (Developer mode).

---

## הוספת קטגוריה חדשה

**קובץ:** `brain/categories.js` (אל תיגע ב-`brain-api.js`)

```js
export const CATEGORIES = {
  // ... קטגוריות קיימות ...

  cooking: {
    heLabel: 'בישול',
    color: '#F59E0B',
    keywords: ['מתכון', 'recipe', 'אוכל', 'food', 'בישול', 'cooking', 'שף']
  }
}
```

אחרי הוספה — הפעל `npm run build` ורענן את התוסף.

---

## הוספת דמות חדשה (Mascot)

1. צור `mascot/MySkin.js`:

```js
export function createMySkin() {
  return {
    async init() { /* הכנס דמות ל-DOM */ },
    say(text)    { /* הצג בועת טקסט */ },
    animate(name){ /* הפעל אנימציה */ },
    show()       { },
    hide()       { },
    onClick(cb)  { /* רשום callback */ },
  }
}
```

2. השתמש בה ב-`bundle-entry.js`:
```js
import { createMySkin } from '../../mascot/MySkin.js'
const mascot = createMySkin()
await mascot.init()
```

3. הוסף `skin.json` בתיקיית `skins/` לפי הפורמט ב-`skins/schema.json`.

---

## הגשת PR

1. Fork את הפרויקט
2. צור branch: `git checkout -b feat/my-feature`
3. בצע שינויים, כתוב בדיקות
4. `npm test` — ודא שהכל עובר
5. `npm run build` — ודא שה-bundle נבנה
6. `git commit -m "feat: תיאור קצר"`
7. Push וצור PR

---

## כללי קוד

- **ESM modules בלבד** — `import/export`, לא `require()`
- **אל תיגע ב-`brain-api.js` ו-`brain/categories.js`** ישירות — שנה דרך הממשקים
- **אל תוסיף state** ברמת ה-module — השתמש ב-factory functions
- **אין DOM** בשכבת ה-brain — רק ב-mascot ו-entry points
- **Storage** רק דרך adapter — לא `chrome.storage` ישיר מ-brain
- בדיקות: צור `tests/feature.test.js` לכל פיצ'ר חדש

---

## מבנה ה-commits

```
feat: הוספת קטגוריה "בישול"
fix: תיקון באג בחישוב weights
docs: עדכון CONTRIBUTING.md
test: הוספת בדיקות ל-insights.js
refactor: פישוט mascot-controller
```

---

## שאלות?

פתח Issue ב-GitHub עם תג `question`.  
תגיות: `bug`, `enhancement`, `question`, `skin`, `documentation`
