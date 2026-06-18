# 📎 האלגוריתם שחזר בתשובה
### *The Algorithm That Repented*

> **What if the algorithm stopped hiding and started explaining itself?**

Every day, social media algorithms decide what you see — and they never tell you why.

This project is a small act of rebellion: a browser extension + desktop agent (Clippy, naturally) that sits with you while you browse, watches what the algorithm shows you, and **tells you the truth**.

*"You're seeing this because you clicked on politics 43% of the time this week."*

The algorithm repents. It confesses. It explains.

---

## What Actually Works Right Now

| Feature | Status |
|---------|--------|
| Clippy mascot on desktop (Windows) | ✅ Working |
| Drag to reposition Clippy | ✅ Working |
| Hebrew greetings by time of day | ✅ Working |
| System tray (show/hide/quit) | ✅ Working |
| Content category classifier (brain) | ✅ Working |
| Intent engine — "why you see what you see" | ✅ Working |
| User feedback: 👍 / 👎 per category | ✅ Working |
| Chrome extension (installable) | ✅ Working |
| Live feed analysis (Twitter, YouTube, Instagram, Facebook, TikTok) | ✅ Working |
| Stats popup — Overview / Categories / History / Insights | ✅ Working |
| First-time onboarding message | ✅ Working |
| Clippy connected to real feed analysis on desktop | 🚧 In progress |
| AI agent with memory and dialogue | 🚧 In progress |
| Skin marketplace | 🚧 In progress |
| Automation rules engine | 🚧 In progress |
| Cloud sync | 🚧 In progress |

---

## Project Structure

```
teshuva-algorithm/
├── brain/              — Content classification + intent engine
│   ├── brain-api.js   — Public API (the only file you import)
│   ├── classifier.js  — Keyword → category (9 categories, Hebrew + English)
│   ├── state.js       — Persistent stats via storage adapter
│   ├── explanations.js — Hebrew explanation strings
│   ├── questions.js   — Should Clippy ask? / what to ask
│   ├── intent.js      — Deep "why": dominant / recurring / first-time
│   ├── categories.js  — Single source of truth for all categories
│   └── adapters/      — chrome-adapter, electron-adapter
│
├── mascot/             — Clippy animation layer
│   ├── IMascot.js         — Interface contract (any mascot can replace Clippy)
│   ├── ClippyMascot.js    — clippyjs wrapper
│   ├── animations.js      — Mood → animation name mapping
│   ├── emotions.js        — Brain state → emotional mood
│   └── mascot-controller.js — Brain ↔ mascot bridge
│
├── extension/          — Chrome / Edge browser extension
│   ├── manifest.json      — MV3
│   ├── background-entry.js — Service worker source
│   ├── api.js             — Message protocol
│   ├── content/           — Feed observer + site adapters
│   └── popup/             — Stats popup UI
│
├── desktop/            — Electron desktop app (קליפי)
│   ├── main.js        — Transparent window, system tray
│   ├── preload.js     — IPC bridge
│   └── renderer-entry.js — Clippy UI logic
│
├── shared/             — Shared between all layers
│   ├── constants.js   — Keys, timeouts, event names
│   └── event-bus.js   — Lightweight pub/sub
│
├── ai/                 — Local vector embeddings + recommendations
├── agent/              — Conversational agent with memory
├── analytics/          — Local-only event collection
├── apps/               — Mini-apps: notes, tasks, insights, settings
├── assistant/          — Scheduler + skills (weather, news, calendar)
├── automation/         — Declarative trigger/action rules engine
├── cloud/              — State export/import for sync
├── enterprise/         — Audit log, permissions (future)
├── marketplace/        — Skin + plugin marketplace (future)
├── os/                 — Desktop OS layer: windows, widgets, launcher
├── payments/           — License gating (future)
├── plugins/            — Plugin engine + sandbox
├── premium/            — Feature flags per tier
├── profiles/           — User profile engine
└── skins/              — Skin format + default skin
```

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
3. Visit Twitter / X, YouTube, Instagram — Clippy appears bottom-right

### Desktop App (Windows)

Double-click **הפעל קליפי.bat** on your desktop, or:

```bash
npm start
```

Clippy appears in the bottom-right corner of your screen. Click him to hear what he has to say. Drag him anywhere.

---

## How the Brain Works

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
  YES → Clippy asks: "מעניין אותך ספורט? 👍 / 👎"
  NO  → Clippy explains: "אתה רואה ספורט כי 38% מהפיד שלך..."
        ↓
Stats saved to chrome.storage under key "teshuva_state"
        ↓
Popup reads stats via message protocol (api.js)
```

---

## Brain API

```js
import { createBrain }         from './brain/brain-api.js'
import { createChromeAdapter } from './brain/adapters/chrome-adapter.js'

const brain = createBrain(createChromeAdapter())
await brain.load()

brain.observe("Netanyahu said today in the Knesset...")  // → "politics"
brain.explain("politics")   // → "אתה רואה פוליטיקה כי 43% מהתוכן שלך..."
brain.intent("politics")    // → { type: "dominant", percentage: 43, heText: "..." }
brain.positive("politics")  // user liked → increase weight
brain.negative("politics")  // user disliked → decrease weight
brain.getStats()             // → { session, allTime, weights, total }
```

---

## Content Categories

| ID | Hebrew | Examples |
|----|--------|---------|
| `politics` | פוליטיקה | כנסת, ממשלה, בחירות |
| `sports` | ספורט | כדורגל, ליגה, מונדיאל |
| `entertainment` | בידור | סרטים, מוזיקה, ריאליטי |
| `technology` | טכנולוגיה | AI, סטארטאפ, אייפון |
| `news` | חדשות | פיצוץ, תאונה, שריפה |
| `health` | בריאות | תזונה, ספורט, מחלה |
| `economy` | כלכלה | בורסה, אינפלציה, שכר |
| `science` | מדע | מחקר, חלל, אקלים |
| `religion` | דת ומסורת | שבת, הלכה, תפילה |

---

## Roadmap

### v0.3.0 — Connect the dots
- Wire Clippy desktop to the live brain (extension ↔ desktop)
- Promoted content detection
- Weekly digest report

### v0.4.0 — Community
- Anonymized dataset export
- Community dashboard: collective algorithm patterns

### v1.0.0 — Product
- Chrome Web Store listing
- More mascots (Merlin, Bonzi Buddy, custom Hebrew character)
- Local LLM classifier (replace keyword matching)

---

## Contributing

PRs welcome. Issues welcome. Wild ideas especially welcome.

If you build something with this — tell us. Open an issue, share a screenshot, write a blog post.

---

## License

MIT — do whatever you want with this, just give credit.

---

*Built with ❤️ and a healthy distrust of recommendation engines.*
