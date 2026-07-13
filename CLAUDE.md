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
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/brain.test.js

# Lint (ESLint 9 flat config)
npm run lint

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
mobile/         ← React Native app (Android + iOS) — see Mobile section below
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

LinkedIn, Reddit, and Threads are fully wired: site-adapters + manifest + action-engine.

### Desktop (`desktop/`)

Electron window: 340×340, transparent, always-on-top, bottom-right corner. Mouse events are forwarded through the window unless the cursor is over Clippy (IPC: `mouse-enter-clippy` / `mouse-leave-clippy`). Uses `clippyjs` npm package (not the SVG mascot used in the extension).

### Landing Page (`web/`)

Static `web/index.html` — no build step, deployed to Netlify via `publish = "web"` in `netlify.toml`. Supports Hebrew/English/Russian (i18n via `setLanguage()`), dark/light theme, and motion toggle. Contains an interactive text analyzer (9 categories), live demo, animated story player, and a Netlify Forms waitlist.

**Deployment:** Netlify may be connected to GitHub (auto-deploy) or deployed manually. The live site at `teshuva-algorithm.netlify.app` reflects whichever was last deployed. After pushing `web/index.html` to `master`, verify the live site matches.

### Mobile (`mobile/`)

React Native 0.81.6 (bare CLI, not Expo) app for Android + iOS. Full setup/build details are in `mobile/README.md` — read it before touching this surface. Critical facts not obvious from the code:

- **The whole repo must live at an ASCII-only path.** It used to live under `Desktop\פרויקטים\האלגוריתום שחזר בתשובה` — Android's NDK/CMake/Ninja toolchain cannot compile native C++ code (needed by `react-native-reanimated`) when the path contains Hebrew characters; it fails with a Windows-specific `chdir ... Invalid argument` error that looks unrelated. That's why the project now lives at `Desktop\teshuva-algorithm`. Don't move it back to a non-ASCII path.
- Android toolchain lives outside the repo: SDK at `C:\Users\DAVID\Android\Sdk`, JDK 17 at `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot`, AVD named `Clippy_Test`.
- `mobile/android/gradlew.bat` fails with "Could not find or load main class" when run via `cmd.exe`/PowerShell on some setups — invoke the wrapper jar directly instead: `java -cp gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain <task>` from Git Bash.
- **Brain integration is wired (2026-07-13).** `mobile/src/services/BrainService.js` imports `brain/brain-api.js` and `brain/adapters/react-native-adapter.js` (AsyncStorage-backed) directly — no server, no stub. See "Phase 2" below for the mechanics.

**RESOLVED 2026-07-13 — the `UnsatisfiedLinkError: libhermes_executor.so not found` launch crash is fixed.** Root cause confirmed as an upstream RN 0.76.5 old-architecture+Hermes packaging bug (see git history for the full investigation that ruled out cache/JSC/New Architecture as fixes). Fix was upgrading the whole `mobile/` app from RN 0.76.5 → **0.81.6** — the last version that still supports Legacy Architecture (0.82 removes the old-arch opt-out entirely, which would have forced a Turbo Modules migration for `OverlayPermissionModule`/`FloatingService`). `newArchEnabled` stays `false` on purpose. Mechanics of the upgrade:
- Generated a reference scaffold via `npx @react-native-community/cli@18 init RefScaffold --version 0.81.6` in a scratch dir and diffed it against `mobile/android/` to update `build.gradle` (×2), `gradle.properties`, `gradle-wrapper.properties` (Gradle 8.14.3, NDK 27.1.12297006, compileSdk/targetSdk 36) — same method to use for any future RN bump.
- `MainApplication.java`/`MainActivity.java` were **converted to Kotlin** (`.kt`) to match the new template's `ReactHost`/`loadReactNative()` bootstrap API exactly, rather than hand-translating it back to Java — lower risk of subtle bridge/bridgeless mismatches. The old `.java` versions are preserved under `mobile/_לסקירה/android-java-pre-rn0.81/` (not deleted). Custom native modules (`OverlayPermissionModule`, `OverlayPermissionPackage`, `FloatingService`) needed **no changes** — old-arch bridge APIs (`ReactContextBaseJavaModule`, `ReactPackage`) are untouched between 0.76 and 0.81.
- `react-native-screens` has a real peer-dependency floor that jumps around between patch releases (`4.25.0+` requires `react-native>=0.82.0`, `4.26.0+` requires `>=0.84.0`) — pinned to `4.24.0` for 0.81.6 compat. Always check `npm view <pkg>@<version> peerDependencies` before bumping RN ecosystem libs, don't just take "latest".
- `react-native-reanimated` deliberately stayed on the **3.x line** (`3.19.5`), not 4.x — Reanimated 4 requires the New Architecture.
- `metro.config.js` had a `resolver.sourceExts` override that *replaced* (rather than extended) the default extension list, silently dropping `ts`/`tsx` — broke resolving `react-native-gesture-handler`'s TS entrypoint after the bump. Fixed to spread `getDefaultConfig(__dirname).resolver.sourceExts` first.
- `@react-navigation/native` 6→7 is a breaking major: `NavigationContainer`'s `theme` prop now requires a `fonts` key or internals like `HeaderTitle` throw `Cannot read property 'medium' of undefined`. Fix in `mobile/src/App.js`: build `NAV_THEME` by spreading `DarkTheme` (from `@react-navigation/native`) instead of a bare custom object.
- Verified end-to-end on the `Clippy_Test` AVD: `assembleDebug` → install → launch → Metro bundle → full Hebrew UI renders (Insights screen, stats tiles, weekly breakdown chart, Clippy mascot + speech bubble) with **no native crash**. The custom overlay-permission dialog (`OverlayPermissionModule`) still fires correctly post-upgrade.

**Phase 2 (2026-07-13) — real `brain/` wired in, no more fake stub data.** The old `brain-server-stub.js`/`src/api/brain.js` returned entirely fabricated numbers, including two with no real backing at all: an "algorithm mood" (no such concept exists in `brain/`) and a "91% accuracy" stat (the classifier has no ground truth to measure accuracy against). Both were replaced with real data rather than kept as placeholder — consistent with the earlier removal of the fabricated landing-page `aggregateRating`/testimonials.
- `brain/adapters/react-native-adapter.js` (new) wraps `@react-native-async-storage/async-storage`, mirroring `electron-adapter.js`.
- `brain/` and `shared/` sit outside `mobile/`'s Metro project root. `mobile/metro.config.js` adds targeted `watchFolders` for just those two directories (not the whole repo root — there's a stray 4.2GB old `node_modules` copy under `_לסקירה/` that must never be watched) plus `resolver.nodeModulesPaths: [mobile/node_modules]`, since Metro otherwise resolves bare imports (e.g. `@react-native-async-storage/async-storage`) by walking up from the *importing file's own directory* — which for files under `brain/` misses `mobile/node_modules` entirely.
- `App.js` gates rendering on `brainService.init()` resolving before mounting any screen. This isn't optional: screens call `brain.observe()`/`getStats()` synchronously, and if that races the AsyncStorage `load()`, `load()`'s `Object.assign(allTime, saved.allTime)` can silently clobber an in-memory increment that happened just before it finished — a real data-loss bug, not just a cosmetic flash of zeros.
- "Mood" card → real `brain.greeting()` (time-of-day Hebrew greeting). "Accuracy" stat → real dismissal rate (`dismissedTotal/totalSeen`). Empty state ("not enough data yet") shown honestly instead of any placeholder numbers.
- `brain/explanations.js`'s `weeklyInsights()` returns strings with `<b>...</b>` markers — React Native can't render raw HTML, so `mobile/src/components/RichText.js` splits on the tags and renders real nested bold `<Text>`.
- Removed `mobile/src/components/ConnectionBanner.js` (health-checked the now-nonexistent server) and the `brain_api` key from `config.json` — both moved to `mobile/_לסקירה/pre-phase2-network-stub/`, not deleted.
- **Gotcha:** removing the `INTERNET` permission and `usesCleartextTraffic="true"` from the manifest (since the app itself makes zero network calls now) broke the Metro dev bridge entirely — React Native's own debug bundle/WebSocket connection to `10.0.2.2:8081` needs both, independent of whatever the app's own code does. Both are back in the manifest; don't remove them again without setting up a separate release-only manifest override.

### Shared Constants (`shared/constants.js`)

Defines `STORAGE_KEY`, `SETTINGS_KEY`, all `MSG.*` types for content↔background messages, and cooldown values. Import from here instead of hardcoding.

## Known Gaps

- LinkedIn/Reddit/Threads action-engine selectors are best-effort — they need real-browser testing with a logged-in account to verify menu button discovery works on current DOM (Reddit also blocks automated/headless browsers, so it can't be verified via Playwright either)
- `desktop/renderer.js` bundle is 1.9 MB (includes clippyjs assets) — normal, but slow to rebuild
- `web/index.html` has a `SoftwareApplication` JSON-LD block with a hardcoded `aggregateRating` (4.8, 47 ratings) and a MIT-license `Offer` — there is no Chrome Web Store listing or review source backing that number; treat it as placeholder copy, not real data, before touching SEO/schema on the landing page
