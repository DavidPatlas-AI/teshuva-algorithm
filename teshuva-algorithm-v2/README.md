# 📎 האלגוריתם שחזר בתשובה
### *The Algorithm That Repented*

> **What if the algorithm stopped hiding and started explaining itself?**

---

## The Idea

Every day, social media algorithms decide what you see — and they never tell you why.

This project is a small act of rebellion:  
A browser extension + desktop agent (Clippy, naturally) that sits with you while you browse, watches what the algorithm shows you, and **tells you the truth**.

*"You're seeing this because you clicked on politics 43% of the time this week."*  
*"You've visited YouTube 94 times in the last 7 days."*  
*"Your peak browsing hour is 11 PM."*

The algorithm repents. It confesses. It explains.

---

## Screenshot

> 📸 *Screenshot coming soon — load the extension and Clippy will appear in the bottom-right corner.*

---

## What's Inside

```
📦 teshuva-algorithm/
├── 🧠 brain/          — Learning engine
│   ├── categories.js  — Single source of truth for 9 content categories
│   ├── classifier.js  — Keyword-based text → category classifier
│   ├── state.js       — Persistent stats (allTime, weights) via storage adapter
│   ├── explanations.js — Hebrew explanation strings
│   ├── questions.js   — User-facing questions (shouldAsk / build)
│   ├── intent.js      — Deep "why" reasoning: dominant / recurring / first-time
│   └── brain-api.js   — Public facade (the only file you import)
├── 🎭 mascot/
│   ├── IMascot.js         — Interface contract
│   ├── ClippyMascot.js    — Clippy implementation
│   ├── animations.js      — Mood → animation mapping
│   └── mascot-controller.js — Brain ↔ mascot bridge (single entry point)
├── 🔌 extension/
│   ├── background-entry.js — Service worker source (builds → background.js)
│   ├── api.js             — Message protocol: popup/content → background
│   ├── content/
│   │   ├── bundle-entry.js — Content script source (builds → bundle.js)
│   │   ├── feed-observer.js — MutationObserver + scroll listener
│   │   └── site-adapters.js — CSS selectors per social network
│   └── popup/
│       ├── popup-entry.js  — Popup source (builds → popup.js)
│       └── popup.html
├── 🖥️ desktop/
│   ├── main.js        — Electron main process
│   ├── preload.js     — IPC bridge
│   └── renderer-entry.js — Desktop Clippy (builds → renderer.js)
└── 📦 shared/
    ├── constants.js   — STORAGE_KEY, MSG types, EVENTS, timeouts
    └── event-bus.js   — Lightweight pub/sub
```

### Features

| Feature | Status |
|---------|--------|
| Clippy mascot on desktop | ✅ |
| Content category detection | ✅ |
| Hebrew + English keywords | ✅ |
| Browsing history analysis | ✅ |
| Live feed analysis (Twitter, YouTube, TikTok, Instagram, Facebook) | ✅ |
| Stats popup — 4 tabs (Overview / Categories / History / Insights) | ✅ |
| Drag to reposition Clippy | ✅ |
| First-time onboarding message | ✅ |
| User feedback: 👍 / 👎 per category | ✅ |
| Intent engine (why you see what you see) | ✅ |

---

## Install

### Browser Extension (Chrome / Edge)

```bash
git clone https://github.com/YOUR_USERNAME/teshuva-algorithm
cd teshuva-algorithm
npm install
npm run build
```

1. Open `chrome://extensions` → enable **Developer mode**
2. Click **Load unpacked** → select the `extension/` folder
3. Visit Twitter, YouTube, Instagram — Clippy appears in the bottom-right corner

### Desktop App (Windows)

```bash
npm start
```

Or double-click `הפעל קליפי.bat` on your desktop.

---

## How It Works

```
You scroll Twitter / YouTube / Instagram
        ↓
feed-observer.js detects visible post text
        ↓
mascot-controller.onPostSeen(text)
        ↓
brain.observe(text)  →  categoryId
brain.intent(categoryId)  →  { type, percentage, heText }
        ↓
Should ask user? (after 5 posts in same category)
  YES → Clippy asks "מעניין אותך ספורט? + / -"
  NO  → Clippy explains "אתה רואה ספורט כי 38% מהפיד שלך..."
        ↓
Stats saved to chrome.storage under key "teshuva_state"
        ↓
Popup reads stats via background.js message protocol
```

---

## Using the Brain API

```js
import { createBrain }         from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()

// Classify and record a post
const categoryId = brain.observe("Netanyahu said today in the Knesset...")
// → "politics"

// Short explanation
brain.explain("politics")
// → "אתה רואה פוליטיקה כי 43% מהתוכן שלך הוא בנושא הזה."

// Deep intent
brain.intent("politics")
// → { type: "dominant", percentage: 43, heText: "פוליטיקה שולטת ב-43% מהפיד שלך..." }

// User feedback
brain.positive("politics")   // increases weight
brain.negative("politics")   // decreases weight

// Stats
brain.getStats()
// → { session, allTime, weights, total, categories, ids }
```

### Storage Adapters

```js
// Chrome extension
import { createChromeAdapter }   from './brain/adapters/chrome-adapter.js'

// Electron desktop
import { createElectronAdapter } from './brain/adapters/electron-adapter.js'
```

---

## 🗺️ Roadmap

### v0.2.0 — Smarter Brain
- Intent-driven explanations (dominant / recurring / first-time / explicit)
- Animated mood responses (greet / think / excited / confused)
- Improved onboarding flow

### v0.3.0 — Algorithm Reverse Engineering
- Detect **promoted content** vs organic
- Track **virality patterns**
- Identify suppressed posts

### v0.4.0 — Community
- Anonymized dataset export
- Community dashboard: collective algorithm patterns
- API for researchers

### v1.0.0 — Product
- Chrome Web Store listing
- More mascot personalities (Merlin, Bonzi Buddy, custom Hebrew character)
- Multi-language support (Arabic, French, Spanish)
- Local LLM classifier (replace keyword matching)

---

## Contributing

PRs welcome. Issues welcome. Wild ideas especially welcome.

If you build something with this — tell us. Open an issue, share a screenshot, write a blog post.

This project grows when people see it and think: *"I could add ___."*

---

## License

MIT — do whatever you want with this, just give credit.

---

*Built with ❤️ and a healthy distrust of recommendation engines.*
