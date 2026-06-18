# Changelog

All notable changes to this project will be documented in this file.

---

## v10.0.0 — Personal OS Layer

### Added
- **os/** — OS Layer: window-manager, file-system, notifications, control-center, launcher
- **os/widgets/** — 4 widgets: clock, stats, insights, shortcuts
- **os/home-screen.html + home-screen.js** — Full home screen with taskbar
- **os/theme.css** — Dark/light theme system
- **apps/** — 4 built-in apps: notes, tasks, insights, settings
- **OS-DOCS.md** — Full OS architecture documentation

---

## v9.0.0 — Personal AI Assistant

### Added
- **assistant/** — tasks.js, scheduler.js, skill-engine.js
- **assistant/skills/** — skill-weather.js (open-meteo), skill-news.js (RSS), skill-calendar.js

---

## v8.0.0 — Full Marketplace

### Added
- **marketplace/server.js** — Express server + developer auth
- **marketplace/publisher-dashboard.html** — Developer dashboard UI
- **marketplace/review-system.js** — Ratings, comments, reports
- **marketplace/payments.js** — 70/30 revenue split, monthly reports

---

## v6.0.0 — Automation Engine

### Added
- **automation/rules.json** — Declarative trigger/action rules
- **automation/engine.js** — Rule evaluator with cooldowns
- **automation/examples.md** — 4 example rules with explanation

---

## v5.0.0 — Full AI Agent

### Added
- **agent/dialogue.js** — Conversational dialogue with intent detection, context window
- **agent/memory.js** — Long-term fact memory with importance decay
- **agent/policy.md** — Agent behavior rules (what's allowed/forbidden)
- **agent/actions.js** — Typed action API for the agent

### Changed
- `mascot-controller.js` — accepts `options.dialogue` and `options.memory`; adds `onUserText()` method

---

## v4.0.0 — Full Commercial Release

### Added
- **enterprise/** — לוח ניהול ארגוני: admin-dashboard, policies, permissions, audit-log
- **marketplace/** — Marketplace מלא: api.js, manifest-schema, publisher-guide
- **RBAC**: Role-based access control (viewer/editor/admin/super-admin)
- **GDPR Compliance**: right to access, erasure, portability
- **Content Policies**: monitor/alert/hide/block modes
- **Audit Log**: immutable 2-year retention, CSV export

---

## v2.0.0 — AI + Profiles + Plugins + Cloud Sync

### Added
- **ai/** — AI layer: embedding.js, similarity.js, context.js, recommendations.js, learning-loop.md
- **profiles/** — User profiles engine: profile-engine.js, profile-schema.json
- **plugins/** — Plugin system: plugin-engine.js, sandbox API, example plugins
- **cloud/** — Cloud sync (Pro): sync-engine.js, E2E encryption, merge strategies
- **analytics/** — Local analytics: collector.js, events.md, dashboard.md
- **payments/** — Payment flow: paywall.js, license.json, Stripe flow

---

## v1.0.0 — Full Product Release

### Added
- **premium/** — מערכת פרימיום מלאה: features, pricing, upgrade-flow, locks.json
- **skins/** — Marketplace סקינים: schema.json, default/, example-skin/ + מדריך יצירה
- **API-DOCS.md** — תיעוד API מלא עם flow diagrams
- **brain/insights.js** — `buildWeeklyInsights()`, `summarizeBehavior()`, `detectPatterns()`
- **mascot/emotions.js** — Emotion Engine: `computeEmotion()`, `expressEmotion()`
- **CONTRIBUTING.md** — מדריך תרומה: קטגוריות, דמויות, PR, כללי קוד
- **branding/logo-description.md** — מפרט לוגו מלא (צבעים, גדלים, גרסאות)
- **DEMO-SCRIPT.md** — תסריט סרטון דמו 90 שניות
- **docs/** — GitHub Pages מלא (10 קבצים)
- **landing-page.html + landing-style.css** — דף נחיתה שיווקי

### Fixed
- **desktop/renderer-entry.js** — הסרת `e.preventDefault()` שחסם אירוע click ב-Electron

---

## v0.3.0 — GitHub Release + Docs

### Added
- `docs/` — full GitHub Pages site (Jekyll/minima): index, install, extension, desktop, brain, mascot, roadmap, changelog, style.css
- `landing-page.html` + `landing-style.css` — full Hebrew marketing landing page with hero, features, install steps, categories
- `docs/mascot.md` — IMascot interface reference, mood mapping, how to add a custom mascot
- `docs/roadmap.md` — v0.4.0 (UX), v0.5.0 (AI), v1.0.0 (Product) roadmap
- `docs/changelog.md` — mirrored changelog for GitHub Pages

### Changed
- `package.json` version bumped to 0.3.0
- `docs/_config.yml` — added custom CSS reference

---

## v0.2.0 — Architecture v2 + UX

### Added
- `tests/manual-test-plan.md` — 10 test scenarios covering all layers A–J
- `USAGE-GUIDE.md` — full developer and user documentation
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
  - `greeting()` → `greet` mood animation
  - `explain()` / `onWhyClick()` → `think` mood animation (uses `brain.intent().heText` for richer text)
  - `onPositive()` → `excited` mood animation
  - `onNegative()` → `confused` mood animation
  - Idle loop: `playMood('idle')` every 15 seconds when Clippy is quiet
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
