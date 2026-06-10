// Mascot controller — manages the floating character and speech bubble

class TeshuvaMascot {
  constructor(brain, prefs) {
    this.brain    = brain;
    this.prefs    = prefs;
    this.widget   = null;
    this.bubble   = null;
    this.stats    = null;
    this.bubbleTimer = null;
    this.mounted  = false;
  }

  mount() {
    if (this.mounted || !this.prefs.mascot.visible) return;

    const style = document.createElement("style");
    style.textContent = MASCOT_CSS;
    document.head.appendChild(style);

    this.widget = document.createElement("div");
    this.widget.id = "teshuva-widget";
    this.widget.innerHTML = this._html();
    document.body.appendChild(this.widget);

    this.bubble = this.widget.querySelector("#teshuva-bubble");
    this.stats  = this.widget.querySelector("#teshuva-stats");
    const wrap  = this.widget.querySelector("#teshuva-mascot-wrap");

    wrap.addEventListener("click", () => this._onMascotClick());
    this.mounted = true;

    setTimeout(() => this.say("שלום! אני כאן אם תרצה להבין למה אתה רואה מה שאתה רואה 👁️", null, 4000), 1200);
  }

  say(text, catId, duration = 5000) {
    if (!this.bubble) return;
    clearTimeout(this.bubbleTimer);

    const tag = catId ? this.prefs.categories[catId] : null;
    const tagHtml = tag
      ? `<span class="category-tag" style="background:${tag.color}">${tag.heLabel}</span><br>`
      : "";

    this.bubble.innerHTML = `
      <button class="close-btn" id="teshuva-close">✕</button>
      ${tagHtml}${text}`;

    this.bubble.classList.remove("hidden");

    const closeBtn = this.bubble.querySelector("#teshuva-close");
    if (closeBtn) closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      this.bubble.classList.add("hidden");
    });

    if (duration > 0) {
      this.bubbleTimer = setTimeout(() => this.bubble.classList.add("hidden"), duration);
    }
  }

  onContentDetected(catId, text) {
    const explanation = this.brain.explain(catId);
    this.say(explanation, catId, 6000);
    this._wiggle();
    this._refreshStats();
  }

  _refreshStats() {
    if (!this.stats) return;
    const top = this.brain.topCategories(5);
    const max = top[0]?.count || 1;

    if (top.length === 0) { this.stats.classList.add("hidden"); return; }

    const rows = top.map(({ label, count, color }) => `
      <div class="teshuva-bar-row">
        <span class="teshuva-bar-label">${label}</span>
        <div class="teshuva-bar-track">
          <div class="teshuva-bar-fill" style="width:${Math.round(count/max*100)}%;background:${color}"></div>
        </div>
        <span style="font-size:11px;color:#6B7280">${count}</span>
      </div>`).join("");

    this.stats.innerHTML = `<h3>מה ראית היום?</h3>${rows}`;
  }

  _onMascotClick() {
    this._wiggle();
    if (this.stats.classList.contains("hidden")) {
      this._refreshStats();
      this.stats.classList.remove("hidden");
    } else {
      this.stats.classList.add("hidden");
    }
  }

  _wiggle() {
    const wrap = this.widget?.querySelector("#teshuva-mascot-wrap");
    if (!wrap) return;
    wrap.classList.remove("wiggle");
    void wrap.offsetWidth;
    wrap.classList.add("wiggle");
    wrap.addEventListener("animationend", () => wrap.classList.remove("wiggle"), { once: true });
  }

  _html() {
    return `
      <div id="teshuva-stats" class="hidden"></div>
      <div id="teshuva-bubble" class="hidden"></div>
      <div id="teshuva-mascot-wrap">${MASCOT_SVG}</div>`;
  }
}
