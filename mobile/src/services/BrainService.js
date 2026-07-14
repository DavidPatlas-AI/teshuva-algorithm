/**
 * BrainService — wraps the real brain/brain-api.js running fully on-device
 * (AsyncStorage, no server) and exposes UI-friendly derived shapes, plus a
 * simple pub/sub for components to react to changes.
 */
import {NativeModules, Platform} from 'react-native';
import {createBrain} from '../../../brain/brain-api.js';
import {createReactNativeAdapter} from '../../../brain/adapters/react-native-adapter.js';

// Real feed activity (Instagram/TikTok/Twitter, via FeedWatcherService — an
// Android AccessibilityService, sideload-only, see CLAUDE.md) is tracked
// natively in SharedPreferences, separate from brain-api.js's AsyncStorage
// state (which only reflects manual "explain text" testing in-app). Merged
// together in getHomeStats() so the UI shows the fuller picture.
async function getNativeFeedStats() {
  if (Platform.OS !== 'android' || !NativeModules.OverlayPermission) {
    return {seen: {}, dismissed: {}};
  }
  try {
    return await NativeModules.OverlayPermission.getFeedWatcherStats();
  } catch (_) {
    return {seen: {}, dismissed: {}};
  }
}

class BrainService {
  constructor() {
    this._brain     = createBrain(createReactNativeAdapter());
    this._loaded    = false;
    this._listeners = new Set();
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(event, payload) {
    this._listeners.forEach(fn => fn({event, payload}));
  }

  async init() {
    if (this._loaded) return;
    await this._brain.load();
    this._loaded = true;
  }

  getGreeting() {
    return this._brain.greeting();
  }

  async _getCombinedAllTime() {
    const stats = this._brain.getStats();
    const native = await getNativeFeedStats();

    const allTimeCombined = {};
    for (const id of stats.ids) {
      allTimeCombined[id] = (stats.allTime[id] ?? 0) + (native.seen?.[id] ?? 0);
    }
    const nativeDismissed = Object.values(native.dismissed ?? {}).reduce((sum, n) => sum + n, 0);
    return {stats, allTimeCombined, nativeDismissed};
  }

  async getHomeStats() {
    const {stats, allTimeCombined, nativeDismissed} = await this._getCombinedAllTime();

    const totalSeen = Object.values(allTimeCombined).reduce((sum, n) => sum + n, 0);
    const dismissedTotal = stats.dismissedTotal + nativeDismissed;
    const dismissalRatePct = totalSeen > 0 ? Math.round((dismissedTotal / totalSeen) * 100) : 0;

    const breakdown = stats.ids
      .map(id => ({
        id,
        label: stats.categories[id].heLabel,
        color: stats.categories[id].color,
        count: allTimeCombined[id],
        pct: totalSeen > 0 ? Math.round((allTimeCombined[id] / totalSeen) * 100) : 0,
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return {totalSeen, dismissedTotal, dismissalRatePct, breakdown};
  }

  async isFeedWatcherEnabled() {
    if (Platform.OS !== 'android' || !NativeModules.OverlayPermission) return false;
    try {
      return await NativeModules.OverlayPermission.isFeedWatcherEnabled();
    } catch (_) {
      return false;
    }
  }

  openAccessibilitySettings() {
    if (Platform.OS === 'android' && NativeModules.OverlayPermission) {
      NativeModules.OverlayPermission.openAccessibilitySettings();
    }
  }

  explainText(text) {
    const categoryId = this._brain.observe(text);
    const result = {
      categoryId,
      label: categoryId === 'uncategorized' ? null : this._brain.getStats().categories[categoryId]?.heLabel,
      explanation: categoryId === 'uncategorized' ? null : this._brain.explain(categoryId),
      signals: categoryId === 'uncategorized' ? [] : this._brain.signals(categoryId),
    };
    this._emit('explain', result);
    return result;
  }

  async getWeeklyInsights() {
    const {allTimeCombined} = await this._getCombinedAllTime();
    return this._brain.weeklyInsights(allTimeCombined, {});
  }

  positive(categoryId) {
    if (!categoryId) return;
    this._brain.positive(categoryId);
    this._emit('feedback', {categoryId, positive: true});
  }

  negative(categoryId) {
    if (!categoryId) return;
    this._brain.negative(categoryId);
    this._emit('feedback', {categoryId, positive: false});
  }

  async reset() {
    await this._brain.reset();
    this._emit('reset', null);
  }
}

export const brainService = new BrainService();
