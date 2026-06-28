# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build all compiled bundles (required after editing any source JS)
npm run build

# Build only the desktop renderer
npm run build:desktop

# Run tests
npm test

# Run a single test file
node --experimental-vm-modules node_modules/.bin/jest tests/brain.test.js

# Start Electron desktop app
npm start

# Package Windows installer
npm run dist
```

> **Important:** `extension/content/bundle.js`, `extension/popup/popup.js`, `extension/background.js`, and `desktop/renderer.js` are **esbuild outputs** — never edit them directly. Edit the corresponding `*-entry.js` source files and rebuild.

## Architecture

The project has four independently deployable surfaces that share a common brain:

```
brain/          ← shared intelligence (pure JS, no DOM)
mascot/         ← SVG Clippy figure and controller
extension/      ← Chrome MV3 content script + popup + background
desktop/        ← Electron always-on-top transparent window
web/            ← Netlify landing page (static HTML, no build step)
shared/         ← constants (MSG types, storage keys, timing)
tests/          ← Jest ESM tests for brain
netlify/        ← Netlify serverless functions
```

### Brain (`brain/`)

**`brain/brain-api.js` is the only file external code should import.** Internal modules (`classifier.js`, `state.js`, `signals.js`, `explanations.js`, `intent.js`) are private.

```js
const brain = createBrain(storageAdapter)
await brain.load()
const catId = brain.observe(text)   // classify + record
brain.positive(catId)               // user liked → weight +
brain.negative(catId)               // user disliked → weight −
brain.recordDismiss(catId)          // post was removed
brain.getStats()                    // all data for popup
brain.signals(catId)                // 3 numeric signals for post badge
```

Storage is injected: `chrome-adapter` uses `chrome.storage.local`; `electron-adapter` uses an in-memory store (desktop reads/writes via IPC).

9 categories in `brain/categories.js`: `politics`, `sports`, `entertainment`, `tech`, `news`, `health`, `economy`, `religion`, `science`.

### Chrome Extension (`extension/`)

Entry points bundled by esbuild:

| Source | Output | Context |
|--------|--------|---------|
| `content/bundle-entry.js` | `content/bundle.js` | injected into every page |
| `popup/popup-entry.js` | `popup/popup.js` | extension popup |
| `background-entry.js` | `background.js` | service worker |

**Content script wiring** (bundle-entry.js):
1. `createSVGMascot()` — renders the SVG Clippy (CSP-safe, no eval)
2. `createBrain(createChromeAdapter())` — loads persisted weights
3. `createMascotController(mascot, brain)` — orchestrates events
4. `startFeedObserver(selector, cb)` — MutationObserver for new posts
5. `startInnerTubeIntercept(cb)` — intercepts YouTube InnerTube API for titles pre-render

**Adding a new platform:**
1. Add CSS selector to `content/site-adapters.js`
2. Add `host_permissions` + `content_scripts.matches` in `manifest.json`
3. Add DOM strategy to `content/action-engine.js` (for the "Not interested" click)
4. Run `npm run build`

> LinkedIn, Reddit, Threads are in the manifest and site-adapters but **not yet in action-engine.js** — posts are classified but "Not interested" won't be clicked on those platforms.

### Desktop (`desktop/`)

Electron window: 340×340, transparent, always-on-top, bottom-right corner. Mouse events are forwarded through the window unless the cursor is over Clippy (IPC: `mouse-enter-clippy` / `mouse-leave-clippy`). Uses `clippyjs` npm package (not the SVG mascot used in the extension).

### Landing Page (`web/`)

Static `web/index.html` — no build step, deployed to Netlify via `publish = "web"` in `netlify.toml`. Supports Hebrew/English/Russian (i18n via `setLanguage()`), dark/light theme, and motion toggle. Contains an interactive text analyzer (9 categories), live demo, animated story player, and a Netlify Forms waitlist.

**Deployment:** Netlify may be connected to GitHub (auto-deploy) or deployed manually. The live site at `teshuva-algorithm.netlify.app` reflects whichever was last deployed. After pushing `web/index.html` to `master`, verify the live site matches.

### Shared Constants (`shared/constants.js`)

Defines `STORAGE_KEY`, `SETTINGS_KEY`, all `MSG.*` types for content↔background messages, and cooldown values. Import from here instead of hardcoding.

## Known Gaps

- `action-engine.js` has no adapter for LinkedIn, Reddit, or Threads
- No real linting (`"lint": "echo TODO"`)
- `package.json` still has `"url": "https://github.com/YOUR_USERNAME/teshuva-algorithm"` — should be `DavidPatlas-AI`
