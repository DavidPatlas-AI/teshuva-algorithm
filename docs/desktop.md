---
layout: page
title: "גרסת הדסקטופ"
permalink: /desktop/
---

<div dir="rtl">

# גרסת הדסקטופ (Electron)

## הפעלה

```bash
npm start
```

Clippy יופיע בפינה הימנית-תחתונה של שולחן העבודה — שקוף, תמיד מעל החלונות האחרים.

---

## יכולות

| יכולת | תיאור |
|-------|--------|
| **שקיפות** | חלון שקוף לגמרי, רק Clippy נראה |
| **Always on top** | תמיד מעל כל שאר החלונות |
| **גרירה** | לחץ וגרור את Clippy לכל מקום |
| **Tray icon** | גישה מהירה להצג/הסתר/יציאה |
| **ברכה** | מדבר לפי שעה: בוקר טוב / ערב טוב |
| **Idle animation** | אנימציה אוטומטית כל 15 שניות |
| **דיבור אוטומטי** | משפט רנדומלי כל 45 שניות |

---

## ארכיטקטורה

```
desktop/
├── main.js           — Main process (BrowserWindow, tray, IPC)
├── preload.js        — גשר בטוח מ-renderer ל-main
├── renderer-entry.js — קוד מקור (builds → renderer.js)
├── renderer.js       — Clippy על המסך (bundle esbuild)
└── index.html        — דף בסיס ריק
```

### תקשורת IPC

```
renderer.js (browser)  →  preload.js (bridge)  →  main.js (Node)
    mouseenter          →  desktopAPI.mouseEnter()  →  setIgnoreMouseEvents(false)
    mouseleave          →  desktopAPI.mouseLeave()  →  setIgnoreMouseEvents(true)
    drag start          →  desktopAPI.startDrag()   →  setIgnoreMouseEvents(false)
    move                →  desktopAPI.moveWindow()  →  win.setPosition(x+dx, y+dy)
```

---

## קובץ .bat להפעלה מהירה

```batch
@echo off
cd /d "C:\Path\To\teshuva-algorithm"
start "" "node_modules\electron\dist\electron.exe" "desktop\main.js"
```

---

## הגדרת חלון

| פרמטר | ערך |
|-------|-----|
| גודל | 340×340 פיקסלים |
| מיקום | 360px מהפינה הימנית-תחתונה |
| שקיפות | `transparent: true` |
| מסגרת | `frame: false` |
| עדיפות | `alwaysOnTop: true` |
| טסקבר | `skipTaskbar: true` |

</div>
