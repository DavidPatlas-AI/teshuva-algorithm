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

**Phase 3 (2026-07-13/14) — production hardening.** Icons turned out to already be a real custom asset (not a placeholder, nothing to do there). Two real gaps closed:
- **Signing.** `mobile/android/app/build.gradle`'s `release` build type signed with the *debug* keystore before this — real Play Store submissions need a real key. Generated `mobile/android/app/release.keystore` (PKCS12, 2048-bit RSA, valid to 2053) via `keytool`, credentials in `mobile/android/keystore.properties` (gitignored, **not backed up anywhere except locally** — the user needs to back this up to a password manager; losing it means this app can never be updated on Play under the same listing again). `build.gradle` loads it conditionally — falls back to debug signing if the file is absent, so a fresh clone without the properties file still builds. Verified with `apksigner verify --print-certs app-release.apk` that the release APK's certificate fingerprint actually matches the new keystore, not the debug one.
- **The "floating bubble" was never actually floating.** Two separate bugs, both real, both fixed:
  1. `FloatingService.java`'s `SYSTEM_ALERT_WINDOW` overlay held only an **invisible transparent `View`** — a drag/tap target with nothing drawn. The real animated Clippy (`mobile/src/mascot/Clippy.js`, Reanimated+SVG, eye-tracking/mood/blink) only ever rendered inside the app's own React Native view tree (`FloatingBubble.js`), which doesn't span into a separate OS-level overlay window. Fixed by adding `mobile/android/app/src/main/res/drawable/clippy_overlay.xml` (a native vector drawable — Clippy's idle body translated from the SVG path data, static pose, no eye-tracking) as the overlay's `ImageView`, animated with a native `ObjectAnimator` (`translationY`, 1400ms each way, matching the JS bob timing) started in `onCreate()`/cancelled in `onDestroy()`. Deliberately did **not** try to port the full Reanimated mood/eye-tracking system natively — disproportionate effort for a bubble glimpsed between apps; the full interactive Clippy stays exclusive to opening the app (which the bubble already does on tap).
  2. Even with that fixed, nothing showed up on first test — `mobile/src/services/FloatingService.js`'s `start()` (the JS-side wrapper) only ever checked/requested the `SYSTEM_ALERT_WINDOW` permission, it **never actually called** `NativeModules.OverlayPermission.startFloatingService()`. So the native service had never been launched at all, in any prior session — this was a pre-existing gap, not something introduced by the Phase 1/2 work. Fixed by calling `startFloatingService()` after permission is confirmed granted (and `stopFloatingService()` in `stop()`).
  - Verified on the `Clippy_Test` AVD: granted `SYSTEM_ALERT_WINDOW` via `adb shell appops set <pkg> SYSTEM_ALERT_WINDOW allow`, confirmed `FloatingService` actually running via `adb shell dumpsys activity services`, screenshotted the home screen with a visibly bobbing purple Clippy floating over it (compared cropped frames ~0.7s apart to confirm real vertical motion, not a static image), confirmed tapping it reopens the app to the last screen.

**Phase 4 (2026-07-14) — real feed monitoring in Instagram/TikTok/Twitter, sideload-only, not on Play Store.** This is what the user actually meant by "make it do what I wanted" — the mobile app previously only classified text pasted in manually; this makes it watch the real feed like the Chrome extension does on desktop.

- **Why not on Play Store:** researched Google Play's actual Accessibility API policy (fetched the real Play Console help page, not just secondary sources). Direct quote: *"Any use of the Accessibility API that enables an app to autonomously initiate, plan, and execute actions or decisions is strictly prohibited"* for non-accessibility-tool apps, with a narrow carve-out: *"This does not prohibit deterministic, rule-based automation, where behavior follows a static, human-defined script."* קליפי's classifier (a fixed keyword/weight dictionary, `score >= threshold`) arguably qualifies for that carve-out — it's not an AI making judgment calls — but a human reviewer could read it differently, and the downside isn't just this app getting rejected, it's **developer-account-level** enforcement risk against every other app under the same account. User's call, made explicitly after seeing this: build it, sideload-only, don't submit to Play.
- **Why generic text-scanning instead of per-app selectors:** the Chrome extension (`extension/content/site-adapters.js`, `action-engine.js`) uses per-site CSS selectors + per-site "find the ⋮ menu → click Not Interested" sequences — viable because web DOM is inspectable/standardized. Native app view hierarchies aren't (no "view source," undocumented resource-ids that shift across app updates, and there's no way to inspect Instagram's actual current tree from this dev environment anyway — no Play Store on the test AVD, and these apps actively fight emulators/bot detection). Chose instead: read *all* visible text on screen regardless of which app (`AccessibilityNodeInfo` tree walk, both `.text` and `.contentDescription`), classify the aggregate, and if unwanted, fire a generic swipe-up gesture (`dispatchGesture`) to scroll past it. App-agnostic, zero per-app maintenance — but **honestly a smaller promise than the Chrome extension**: a swipe just visually skips content, it does not send a "Not Interested" signal to the platform's own algorithm the way a real click does. Documented as a real trade-off, not glossed over.
- **`mobile/android/app/src/main/java/com/teshuva/ClippyClassifier.kt`** — a hand-ported, standalone Kotlin copy of `brain/categories.js` + `brain/classifier.js`'s scoring algorithm (same 9 categories, same term/weight lists, same `score >= 2` threshold). Deliberately not wired to the RN/JS runtime — `FeedWatcherService` must keep working even when Android has killed the app's JS context, which happens routinely for a background service the user hasn't opened the app for in a while. **This is now a second copy of the category data — if `brain/categories.js` changes, this file needs the same edit by hand**, there's no shared source at build time.
- **`FeedWatcherService.kt`** (new `AccessibilityService`) + `res/xml/accessibility_service_config.xml` (target packages: `com.instagram.android`, `com.zhiliaoapp.musically` (TikTok), `com.twitter.android`; `canRetrieveWindowContent`, `canPerformGestures`). Throttled to one pass per 800ms and skips reprocessing if the visible text hash hasn't changed, to avoid hammering the main thread on every minor `AccessibilityEvent`. Counts land in a dedicated `SharedPreferences` file (`clippy_feed_watcher`) — deliberately **not** touching AsyncStorage's internal storage format from native code (fragile, undocumented across library versions). `mobile/src/services/BrainService.js`'s `getHomeStats()`/`getWeeklyInsights()` now merge this native source with the existing `brain-api.js` AsyncStorage stats via a new bridge method (`OverlayPermissionModule.getFeedWatcherStats()`), so both — real feed activity and manual in-app "explain text" testing — show up combined in one picture. This made `getHomeStats()`/`getWeeklyInsights()` **async** (they weren't before); `HomeScreen.js`/`InsightsScreen.js` updated to `await` them.
- **`SettingsScreen.js`** — new "ניטור פיד" section: honest status row (Android won't let an app grant its own `AccessibilityService` — the user has to flip it on in system Settings, re-checked via `useFocusEffect` when the screen regains focus after the user comes back), a button deep-linking to `Settings.ACTION_ACCESSIBILITY_SETTINGS`, and copy stating plainly that this is sideload-only and not on Play Store.
- **Gotcha confirmed during testing:** Android auto-disables `AccessibilityService`s on every app reinstall/update (a real OS security measure, not a bug) — expect "לא פעיל" after every `adb install -r` until re-enabled via `adb shell settings put secure enabled_accessibility_services <pkg>/<service>` (or manually in Settings on a real device).
- **Verified within this environment's real limits:** `Clippy_Test` has no Play Store, so Instagram/TikTok/Twitter can't be installed/logged into here, and these apps fight emulators anyway. Proved the *mechanism* instead: temporarily widened `packageNames` to include `com.android.chrome` (reverted before committing), enabled the service via adb, opened a real Chrome page, and confirmed via logcat + `run-as ... cat shared_prefs/clippy_feed_watcher.xml` that it read the real accessibility tree, classified real content correctly (matched "Google" in Chrome's own menu content-description → `technology`, score 4), persisted native counts (`seen_technology=5`, `dismissed_technology=5`), and that those merged correctly into the Home screen's combined stats (9 seen = 4 prior manual + 5 native; 56% dismissal rate; breakdown showing both technology 56% and sports 44%). **Real behavior against actual Instagram/TikTok/Twitter still needs the user's own physical device** after sideloading — that's the honest scope of what could be verified here.

### Shared Constants (`shared/constants.js`)

Defines `STORAGE_KEY`, `SETTINGS_KEY`, all `MSG.*` types for content↔background messages, and cooldown values. Import from here instead of hardcoding.

## Known Gaps

- LinkedIn/Reddit/Threads action-engine selectors are best-effort — they need real-browser testing with a logged-in account to verify menu button discovery works on current DOM (Reddit also blocks automated/headless browsers, so it can't be verified via Playwright either)
- `desktop/renderer.js` bundle is 1.9 MB (includes clippyjs assets) — normal, but slow to rebuild
- `web/index.html` has a `SoftwareApplication` JSON-LD block with a hardcoded `aggregateRating` (4.8, 47 ratings) and a MIT-license `Offer` — there is no Chrome Web Store listing or review source backing that number; treat it as placeholder copy, not real data, before touching SEO/schema on the landing page
