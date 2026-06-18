# 📎 האלגוריתם שחזר בתשובה
### *The Algorithm That Repented — v0.3.0*

> **What if the algorithm stopped hiding and started explaining itself?**

Every day, social media algorithms decide what you see — and they never tell you why.

This project is a small act of rebellion: a browser extension + desktop agent (Clippy, naturally) that sits with you while you browse, watches what the algorithm shows you, **tells you the truth** — and then **clicks "Not interested" on your behalf**.

---

## What It Does

1. **Watches** your feed — YouTube, X/Twitter, Facebook, Instagram, TikTok
2. **Classifies** every post into one of 9 categories (politics, sports, tech, etc.)
3. **Asks** you with floating 👍/👎 buttons: "Are you interested in this?"
4. **Learns** your preferences and adjusts its weight per category
5. **Acts** — when you press 👎, Clippy automatically clicks "Not interested" / "Hide post" for real
6. **Auto-dismisses** posts from categories you consistently dislike (configurable threshold)
7. **Shows you** exactly what it learned — dismissed count, category weights, sentiment badges

---

## Feature Status

| Feature | Status |
|---------|--------|
| Feed observer (YouTube, X, Facebook, Instagram, TikTok) | ✅ Working |
| 9-category brain classifier | ✅ Working |
| Clippy desktop agent (Electron) | ✅ Working |
| Clippy Chrome extension | ✅ Working |
| Floating 👍/👎 feedback buttons | ✅ Working |
| Action Engine — clicks "Not interested" | ✅ Working |
| Dismiss counter (persisted, shown in popup) | ✅ Working |
| Popup with 5 tabs (overview/categories/history/insights/settings) | ✅ Working |
| Settings tab — auto-dismiss toggle | ✅ Working |
| Weight badges per category (❤️/😐/😒/🚫) | ✅ Working |
| Chrome extension icons | ✅ Present |
| Landing page | ✅ Working |
| AI-powered dialogue layer | 🚧 Stub |
| TikTok action adapter | 🚧 Planned |
| YouTube InnerTube API integration | 🚧 Planned |

---

## Architecture

```
teshuva-algorithm/
├── brain/                    # Core intelligence
│   ├── brain-api.js          # Public API: observe, positive, negative, recordDismiss, getStats
│   ├── categories.js         # 9 categories with Hebrew labels + colors
│   ├── classifier.js         # Keyword-based text classification
│   ├── state.js              # Persisted weights, allTime, dismissed counters
│   ├── questions.js          # When + how to ask the user
│   ├── intent.js             # "Why are you seeing this?" explanations
│   ├── explanations.js       # Human-readable summaries
│   └── adapters/
│       ├── chrome-adapter.js # chrome.storage.local
│       └── memory-adapter.js # In-memory (for tests/desktop)
│
├── mascot/
│   ├── mascot-controller.js  # Brain ↔ Mascot ↔ User bridge
│   └── animations.js         # Mood → Clippy animation mapping
│
├── extension/
│   ├── manifest.json         # MV3, host permissions for 5 platforms
│   ├── content/
│   │   ├── bundle-entry.js   # Content script entry + wiring
│   │   ├── bundle.js         # Built bundle (esbuild output)
│   │   ├── action-engine.js  # Platform "Not interested" click logic
│   │   ├── feedback-ui.js    # Floating 👍/👎 buttons
│   │   ├── feed-observer.js  # MutationObserver for new posts
│   │   └── site-adapters.js  # CSS selectors per platform
│   ├── popup/
│   │   ├── popup.html        # 5-tab popup UI
│   │   ├── popup-entry.js    # Popup logic
│   │   └── popup.js          # Built bundle
│   ├── background-entry.js   # Service worker: storage + settings relay
│   └── api.js                # Content ↔ Background message protocol
│
├── desktop/
│   ├── main.js               # Electron window (340×340, always-on-top)
│   └── renderer-entry.js     # Desktop Clippy logic + IPC
│
├── shared/
│   └── constants.js          # Storage keys, message types, timing
│
├── agent/
│   └── dialogue.js           # Conversational AI stub
│
├── landing-page.html         # Public landing page
└── package.json              # v0.3.0
```

---

## Action Engine — Platform Support

When the user presses 👎 or when the brain weight drops below 0.4 (configurable), Clippy automatically:

| Platform | Action | DOM Strategy |
|----------|--------|--------------|
| **YouTube** | "Not interested" | Hover reveal → ytd-menu-renderer → option click |
| **X / Twitter** | "Not interested in this post" | `[data-testid="caret"]` → menu item |
| **Facebook** | "Hide post" | `[aria-label="More options"]` → menu item |
| **Instagram** | "Not interested" | Three-dot button → dialog button |

---

## Brain API

```js
import { createBrain } from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()

const categoryId = brain.observe('פוסט על פוליטיקה...')  // → 'politics'
brain.positive('politics')      // user liked it → weight +0.15
brain.negative('politics')      // user disliked → weight -0.08
brain.recordDismiss('politics') // post was actually removed from feed

const { allTime, weights, dismissed, dismissedTotal } = brain.getStats()
// weights.politics < 0.4 → auto-dismiss threshold crossed
```

---

## Setup

### Chrome Extension

1. Run `npm install && npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** → select the `extension/` folder
5. Navigate to YouTube, X, Facebook, or Instagram
6. Clippy appears bottom-right

### Desktop (Electron)

```bash
npm install
npm start
# Or double-click: "הפעל קליפי.bat"
```

---

## Popup Tabs

| Tab | Content |
|-----|---------|
| **סקירה** | Visits, social, dismissed banner |
| **קטגוריות** | Category bars with ❤️/😐/😒/🚫 badges |
| **היסטוריה** | Hour-of-day chart, top domains |
| **תובנות** | Weekly insights |
| **⚙️ הגדרות** | Auto-dismiss toggle, reset preferences |

---

## Roadmap

- **v0.4.0** — Improved YouTube selector (InnerTube API)
- **v0.5.0** — TikTok action adapter
- **v0.6.0** — AI dialogue via Claude API (ask Clippy "why?")
- **v1.0.0** — Category blocklist, export preferences, multi-language

---

*"האלגוריתם הזה לא מסתיר כלום ממך"*

MIT License · [GitHub](https://github.com/DavidPatlas-AI/teshuva-algorithm)
