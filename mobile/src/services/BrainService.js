/**
 * BrainService — wraps the real brain/brain-api.js running fully on-device
 * (AsyncStorage, no server) and exposes UI-friendly derived shapes, plus a
 * simple pub/sub for components to react to changes.
 */
import {createBrain} from '../../../brain/brain-api.js';
import {createReactNativeAdapter} from '../../../brain/adapters/react-native-adapter.js';

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

  getHomeStats() {
    const stats = this._brain.getStats();
    const totalSeen = Object.values(stats.allTime).reduce((sum, n) => sum + n, 0);
    const dismissedTotal = stats.dismissedTotal;
    const dismissalRatePct = totalSeen > 0 ? Math.round((dismissedTotal / totalSeen) * 100) : 0;

    const breakdown = stats.ids
      .map(id => ({
        id,
        label: stats.categories[id].heLabel,
        color: stats.categories[id].color,
        count: stats.allTime[id] ?? 0,
        pct: totalSeen > 0 ? Math.round(((stats.allTime[id] ?? 0) / totalSeen) * 100) : 0,
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return {totalSeen, dismissedTotal, dismissalRatePct, breakdown};
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

  getWeeklyInsights() {
    const stats = this._brain.getStats();
    return this._brain.weeklyInsights(stats.allTime, {});
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
