# Changelog

All notable changes to this project will be documented in this file.

---

## v0.2.0 — Architecture v2 + UX *(in progress)*

### Added
- `shared/constants.js` — single source of truth for `STORAGE_KEY`, `MSG` types, `EVENTS`, all timeouts
- `shared/event-bus.js` — lightweight `createEventBus()` pub/sub for decoupled layer communication
- `extension/api.js` — message protocol (`sendMsg`, `api.getStats/resetStats/positive/negative`)
- `brain/intent.js` — deep "why" engine: `INTENT_TYPE` (dominant / recurring / first-time / test / explicit) + `buildIntent()`
- `mascot/animations.js` — mood → Clippy animation mapping (`pickMood`, `playMood`)
- `brain/brain-api.js` — new `intent(categoryId)` method
- `extension/background-entry.js` — background service worker source with data migration from old flat storage keys
- `extension/popup/popup-entry.js` — popup source that imports `CATEGORIES` from `brain/categories.js` (no more local copy)

### Changed
- Storage key unified: all layers now use `STORAGE_KEY = 'teshuva_state'` — background migrates old `allTime` flat key automatically
- `brain/state.js` imports `STORAGE_KEY` from `shared/constants.js`
- `brain/questions.js` converted to `createQuestions()` factory — zero module-level state
- `mascot/mascot-controller.js` is now the **single entry point** for all brain ↔ mascot logic
- `extension/content/bundle-entry.js` reduced to 50 lines — delegates entirely to `mascot-controller`
- `popup.js` reads stats via `api.getStats()` through `background.js` — no direct storage access
- `desktop/main.js` — added missing `ipcMain.on('start-drag')` handler
- Build script now bundles 4 targets: content, desktop renderer, background, popup

### Fixed
- `desktop/renderer-entry.js` — replaced broken `.closest('.clippy-container')` with `agent._el` (clippyjs creates no class)
- Popup time-labels — 24 flex divs instead of broken `grid-column` in flex container
- Race condition in `observe()` — writes in-memory object directly, no read-modify-write

---

## v0.1.0 — Initial MVP

### Added
- Browser extension (Manifest V3) — runs on Twitter/X, Facebook, Instagram, YouTube, TikTok
- Content script with Clippy mascot (clippyjs) in bottom-right corner
- Keyword-based category classifier — 9 categories, Hebrew + English keywords
- `brain/categories.js` — single source of truth for all categories
- `brain/classifier.js` — `scoreText()` + `classify()`
- `brain/state.js` — persistent allTime + weights via storage adapter pattern
- `brain/explanations.js` — time-aware greeting + category explanations + weekly insights
- `brain/questions.js` — asks user after 5 posts in same category
- `brain/brain-api.js` — public facade
- `brain/adapters/` — `chrome-adapter.js` + `electron-adapter.js`
- `mascot/IMascot.js` — interface contract
- `mascot/ClippyMascot.js` — Clippy implementation
- `mascot/mascot-controller.js` — brain ↔ mascot bridge
- `extension/content/feed-observer.js` — MutationObserver + scroll listener
- `extension/content/site-adapters.js` — per-site CSS selectors
- `extension/popup/` — 4-tab popup: Overview / Categories / History / Insights
- Browsing history analysis — 7-day window, domain counts, hourly patterns, social site stats
- Desktop Electron app — transparent frameless always-on-top Clippy
- System tray icon with show/hide/quit menu
- First-time onboarding message
- `npm run build` — esbuild bundler (1.9MB content script, 10KB background, 19KB popup)
