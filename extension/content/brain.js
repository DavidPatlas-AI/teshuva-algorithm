// The Teshuva Brain — learns what you see and explains why

class TeshuvaBrain {
  constructor(prefs) {
    this.prefs = prefs;
    this.session = {};   // counts this tab session
    this.allTime = {};   // loaded from storage
    this.weights = {};   // interest weights per category

    for (const cat of Object.keys(prefs.categories)) {
      this.session[cat]  = 0;
      this.allTime[cat]  = 0;
      this.weights[cat]  = prefs.categories[cat].weight;
    }
  }

  // --- classification ---

  classify(text) {
    if (!text || text.trim().length < 10) return "uncategorized";
    const lower = text.toLowerCase();
    const scores = {};

    for (const [catId, cat] of Object.entries(CATEGORIES)) {
      scores[catId] = 0;
      for (const kw of [...(cat.keywords.he || []), ...(cat.keywords.en || [])]) {
        if (lower.includes(kw.toLowerCase())) scores[catId]++;
      }
    }

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return (best && best[1] > 0) ? best[0] : "uncategorized";
  }

  // --- observation ---

  observe(text) {
    const cat = this.classify(text);
    this.session[cat] = (this.session[cat] || 0) + 1;
    this.allTime[cat] = (this.allTime[cat] || 0) + 1;
    this._save();
    return cat;
  }

  positiveSignal(cat) {
    if (!this.weights[cat]) return;
    this.weights[cat] = Math.min(3.0, this.weights[cat] + 0.15);
    this._save();
  }

  negativeSignal(cat) {
    if (!this.weights[cat]) return;
    this.weights[cat] = Math.max(0.1, this.weights[cat] - 0.08);
    this._save();
  }

  // --- explanation ---

  explain(cat) {
    const label = this.prefs.categories[cat]?.heLabel || cat;
    const total = Object.values(this.allTime).reduce((a, b) => a + b, 0) || 1;
    const pct   = Math.round((this.allTime[cat] || 0) / total * 100);
    const w     = this.weights[cat] || 1.0;

    if (pct === 0) {
      return `זו פעם הראשונה שאתה רואה ${label}. האלגוריתם מנסה!`;
    }
    if (w > 1.8) {
      return `אתה רואה ${label} כי אתה מתעניין בזה מאוד — ${pct}% מהתוכן שלך.`;
    }
    if (w < 0.4) {
      return `האלגוריתם עדיין מציג לך ${label} (${pct}%), אפילו שנראה שזה פחות מעניין אותך.`;
    }
    return `${label} מהווה כ-${pct}% מהתוכן שאתה רואה. האלגוריתם למד שזה בסדר עבורך.`;
  }

  topCategories(n = 3) {
    return Object.entries(this.allTime)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([cat, count]) => ({
        cat,
        count,
        label: this.prefs.categories[cat]?.heLabel || cat,
        color: this.prefs.categories[cat]?.color || "#9CA3AF"
      }));
  }

  // --- persistence ---

  async load() {
    return new Promise(resolve => {
      chrome.storage.local.get(["allTime", "weights"], data => {
        if (data.allTime) Object.assign(this.allTime, data.allTime);
        if (data.weights) Object.assign(this.weights, data.weights);
        resolve();
      });
    });
  }

  _save() {
    chrome.storage.local.set({ allTime: this.allTime, weights: this.weights });
  }
}
