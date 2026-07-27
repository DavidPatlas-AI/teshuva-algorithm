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

React Native 0.81.6 (bare CLI, not Expo), Android + iOS. Full setup/build details in `mobile/README.md` — read it before touching this surface. Legacy Architecture on purpose (`newArchEnabled=false`) — 0.82+ removes the old-arch opt-out entirely, which would force a Turbo Modules migration for the custom native modules below.

**Environment gotchas:**
- **Repo must live at an ASCII-only path.** Android's NDK/CMake/Ninja can't compile native C++ (`react-native-reanimated`) when the path contains Hebrew characters — fails with a Windows-specific `chdir ... Invalid argument` error that looks unrelated. Don't move the repo back to a non-ASCII path.
- Android toolchain lives outside the repo: SDK at `C:\Users\DAVID\Android\Sdk`, JDK 17 at `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot`, AVD `Clippy_Test` (plain Google APIs image, no Play Store — Instagram/TikTok/Twitter can't be installed/logged into on it).
- `mobile/android/gradlew.bat` fails with "Could not find or load main class" via `cmd.exe`/PowerShell — invoke the wrapper jar directly from Git Bash instead: `java -cp gradle/wrapper/gradle-wrapper.jar org.gradle.wrapper.GradleWrapperMain <task>`.
- `mobile/metro.config.js` adds `watchFolders` for `brain/` and `shared/` (they live outside `mobile/`'s Metro root) plus `resolver.nodeModulesPaths: [mobile/node_modules]`, since Metro resolves bare imports by walking up from the *importing file's own directory* — files under `brain/` would otherwise miss `mobile/node_modules`. Never widen `watchFolders` to the whole repo root — there's a stray 4.2GB old `node_modules` copy under `_לסקירה/`.
- Android auto-disables any `AccessibilityService` on every app reinstall/update (real OS security behavior, not a bug) — re-enable via `adb shell settings put secure enabled_accessibility_services <pkg>/<service>` after each `adb install -r`.

**Architecture — brain runs on-device, no server anywhere:**
- `mobile/src/services/BrainService.js` imports `brain/brain-api.js` directly, backed by `brain/adapters/react-native-adapter.js` (AsyncStorage). `App.js` gates screen mounting on `brainService.init()` resolving first — screens call `brain.observe()`/`getStats()` synchronously, and racing that against AsyncStorage's `load()` can silently clobber a fresh increment (`load()`'s `Object.assign(allTime, saved.allTime)` overwrites in-memory state).
- Real feed activity (Instagram/TikTok/Twitter) is tracked separately: `FeedWatcherService.kt` (an `AccessibilityService`) reads on-screen text, classifies it with `ClippyClassifier.kt` — a **hand-ported, standalone Kotlin copy** of `brain/categories.js` + `classifier.js`'s scoring (same categories/weights/threshold, kept independent of the RN/JS runtime since a background service must work even when Android has killed the app's JS context). **If `brain/categories.js` changes, update `ClippyClassifier.kt` by hand** — no shared source at build time. Counts land in `SharedPreferences` (`clippy_feed_watcher`), deliberately not touching AsyncStorage's internal format from native code. `BrainService.js`'s `getHomeStats()`/`getWeeklyInsights()` (both **async**) merge this native source with the AsyncStorage-based stats via `OverlayPermissionModule.getFeedWatcherStats()`.
- `FeedWatcherService` is **app-agnostic by design** (reads all visible text + a generic swipe-up gesture), not per-app CSS-selector-style targeting like `extension/content/site-adapters.js` — native view hierarchies aren't inspectable/stable the way web DOM is. Real trade-off: a swipe only visually skips content, it does not send a "Not Interested" signal to the platform's algorithm the way the extension's click does.
- **Sideload-only, not submitted to Play Store.** Google Play's Accessibility API policy prohibits "autonomous" use by non-accessibility apps, with a narrow carve-out for "deterministic, rule-based automation... a static, human-defined script" (verified against the actual Play Console help page). קליפי's classifier is arguably that (fixed keyword/weight dictionary, not judgment-based), but a reviewer could disagree, and the risk is developer-account-level, not just this app. Confirmed with the user — don't submit `mobile/` builds with `FeedWatcherService` enabled to Play.
- `mobile/android/app/release.keystore` + `mobile/android/keystore.properties` (both gitignored, **never committed**) hold real production signing credentials — `keystore.properties` only exists locally and must be backed up to a password manager separately; losing it means this app can never be updated on Play under the same listing. `app/build.gradle` loads it conditionally and falls back to debug signing if absent.
- `FloatingService.java`'s `SYSTEM_ALERT_WINDOW` overlay shows a real animated Clippy (`res/drawable/clippy_overlay.xml`, a native vector drawable + `ObjectAnimator` bob loop) while the app is backgrounded — deliberately a static pose, not the full Reanimated eye-tracking/mood system (`mobile/src/mascot/Clippy.js`), which stays exclusive to the in-app experience. `mobile/src/services/FloatingService.js`'s `start()`/`stop()` must actually call the native `startFloatingService()`/`stopFloatingService()` bridge methods — it's easy to wire only the permission check and forget the actual service start call, which was a real (fixed) bug here for a long time.
- `mobile/src/components/FloatingBubble.js`: the speech bubble is intentionally `position: 'absolute'` off Clippy's edge, not a flex sibling in the same row. It used to share a flex row with Clippy inside the absolutely-positioned root container, which silently grew the container's auto-computed width by the bubble's width and pushed the whole assembly off the right edge of the screen whenever docked right (the default side) — a real, easy-to-reintroduce layout bug if this gets refactored.
- `brain/explanations.js`'s `weeklyInsights()` returns strings with `<b>...</b>` markers — `mobile/src/components/RichText.js` splits on the tags to render real nested bold `<Text>`, since RN can't render raw HTML.
- The Clippy mascot (`mobile/src/mascot/Clippy.js` and its native counterpart `res/drawable/clippy_overlay.xml`) is an actual paperclip (a bent-wire loop path, same shape language as the app icon `ic_launcher_foreground.xml`), in the app's orange brand color `#ff9a1f` — it used to be a purple rounded-rectangle "blob" that didn't read as Clippy at all and didn't match the icon's color. Keep both files in sync if the mascot shape/color changes again — one is animated SVG (JS/Reanimated), the other a static native vector drawable.

### Shared Constants (`shared/constants.js`)

Defines `STORAGE_KEY`, `SETTINGS_KEY`, all `MSG.*` types for content↔background messages, and cooldown values. Import from here instead of hardcoding.

## Known Gaps

- LinkedIn/Reddit/Threads action-engine selectors are best-effort — they need real-browser testing with a logged-in account to verify menu button discovery works on current DOM (Reddit also blocks automated/headless browsers, so it can't be verified via Playwright either)
- `desktop/renderer.js` bundle is 1.9 MB (includes clippyjs assets) — normal, but slow to rebuild
- `web/index.html` has a `SoftwareApplication` JSON-LD block with a hardcoded `aggregateRating` (4.8, 47 ratings) and a MIT-license `Offer` — there is no Chrome Web Store listing or review source backing that number; treat it as placeholder copy, not real data, before touching SEO/schema on the landing page
