package com.teshuva

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Path
import android.util.DisplayMetrics
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

/**
 * Reads visible text from whatever app is in the foreground (Instagram/TikTok/
 * Twitter etc. — see accessibility_service_config.xml for the target package
 * list), classifies it with ClippyClassifier (same categories/weights as
 * brain/categories.js), and swipes past content that scores as unwanted.
 *
 * Deliberately app-agnostic (generic text scan + generic swipe), not per-app
 * selectors like the Chrome extension — native view hierarchies aren't
 * inspectable/stable the way web DOM is. See CLAUDE.md "Phase 4" for why.
 *
 * Sideload-only. Not for Play Store distribution (see CLAUDE.md).
 */
class FeedWatcherService : AccessibilityService() {

    companion object {
        private const val TAG = "FeedWatcherService"
        private const val PREFS_NAME = "clippy_feed_watcher"
        private const val THROTTLE_MS = 800L
        private const val MAX_TEXT_CHARS = 4000
    }

    private lateinit var prefs: SharedPreferences
    private var lastProcessedAt = 0L
    private var lastTextHash = 0

    override fun onServiceConnected() {
        super.onServiceConnected()
        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        Log.i(TAG, "FeedWatcherService connected")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        val now = System.currentTimeMillis()
        if (now - lastProcessedAt < THROTTLE_MS) return

        val root = rootInActiveWindow ?: return
        val text = StringBuilder()
        collectText(root, text, depth = 0)
        root.recycle()

        if (text.isEmpty()) return
        val textHash = text.toString().hashCode()
        if (textHash == lastTextHash) return // nothing actually changed since last pass

        lastProcessedAt = now
        lastTextHash = textHash

        val result = ClippyClassifier.classify(text.toString())
        if (result.categoryId == null) return

        recordSeen(result.categoryId)
        Log.i(TAG, "classified as ${result.categoryId} (score=${result.score}) — swiping past")
        recordDismissed(result.categoryId)
        swipePast()
    }

    override fun onInterrupt() {
        Log.w(TAG, "FeedWatcherService interrupted")
    }

    // ── screen text extraction ──────────────────────────────────────
    // Walks the visible node tree collecting text/contentDescription,
    // capped so a pathological deep tree can't block the main thread.

    private fun collectText(node: AccessibilityNodeInfo, out: StringBuilder, depth: Int) {
        if (depth > 40 || out.length > MAX_TEXT_CHARS) return
        node.text?.let { if (it.isNotBlank()) out.append(it).append(' ') }
        node.contentDescription?.let { if (it.isNotBlank()) out.append(it).append(' ') }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            collectText(child, out, depth + 1)
            child.recycle()
        }
    }

    // ── dismiss action ───────────────────────────────────────────────
    // Generic swipe-up (scroll past). No per-app "Not Interested" click —
    // see plan/CLAUDE.md for why that's a deliberate, smaller promise than
    // the Chrome extension's equivalent action.

    private fun swipePast() {
        val metrics: DisplayMetrics = resources.displayMetrics
        val centerX = metrics.widthPixels / 2f
        val startY = metrics.heightPixels * 0.75f
        val endY = metrics.heightPixels * 0.25f

        val path = Path().apply {
            moveTo(centerX, startY)
            lineTo(centerX, endY)
        }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(path, 0, 260))
            .build()
        dispatchGesture(gesture, null, null)
    }

    // ── stats (SharedPreferences — separate from brain-api.js's AsyncStorage
    // state; BrainService.js merges both for display, see getFeedWatcherStats) ──

    private fun recordSeen(categoryId: String) {
        val key = "seen_$categoryId"
        prefs.edit().putInt(key, prefs.getInt(key, 0) + 1).apply()
    }

    private fun recordDismissed(categoryId: String) {
        val key = "dismissed_$categoryId"
        prefs.edit().putInt(key, prefs.getInt(key, 0) + 1).apply()
    }
}
