/**
 * BrainService — singleton that holds the brain state and
 * provides a simple pub/sub for components to react to changes.
 */
import * as brainApi from '../api/brain';

class BrainService {
  constructor() {
    this._stats      = null;
    this._mood       = null;
    this._listeners  = new Set();
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(event, payload) {
    this._listeners.forEach(fn => fn({event, payload}));
  }

  async loadStats() {
    try {
      this._stats = await brainApi.getStats();
      this._emit('stats', this._stats);
    } catch (_) { /* offline – use cached */ }
    return this._stats;
  }

  async loadMood() {
    try {
      this._mood = await brainApi.getMood();
      this._emit('mood', this._mood);
    } catch (_) { /* offline */ }
    return this._mood;
  }

  async explain(content) {
    const result = await brainApi.explain(content);
    this._emit('explain', result);
    return result;
  }

  async positive(category) {
    const result = await brainApi.sendFeedback(category, true);
    this._emit('feedback', {category, positive: true, result});
    return result;
  }

  async negative(category) {
    const result = await brainApi.sendFeedback(category, false);
    this._emit('feedback', {category, positive: false, result});
    return result;
  }

  getStats() { return this._stats; }
  getMood()  { return this._mood;  }
}

export const brainService = new BrainService();
