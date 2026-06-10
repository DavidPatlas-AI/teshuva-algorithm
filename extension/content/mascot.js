// Mascot SVG and CSS embedded for content script (no external file loading)

const MASCOT_SVG = `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="40" cy="10" rx="18" ry="6" fill="none" stroke="#FCD34D" stroke-width="3.5" stroke-dasharray="4 2"/>
  <line x1="40" y1="16" x2="40" y2="22" stroke="#6D28D9" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="40" cy="14" r="3.5" fill="#FCD34D"/>
  <rect x="12" y="22" width="56" height="52" rx="16" fill="#7C3AED"/>
  <rect x="14" y="24" width="52" height="48" rx="14" fill="#8B5CF6"/>
  <circle cx="29" cy="38" r="10" fill="white"/>
  <circle cx="51" cy="38" r="10" fill="white"/>
  <circle cx="30" cy="39" r="6" fill="#1E1B4B"/>
  <circle cx="52" cy="39" r="6" fill="#1E1B4B"/>
  <circle cx="31.5" cy="36.5" r="2.2" fill="white"/>
  <circle cx="53.5" cy="36.5" r="2.2" fill="white"/>
  <ellipse cx="20" cy="46" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.6"/>
  <ellipse cx="60" cy="46" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.6"/>
  <path d="M 27 52 Q 40 62 53 52" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 40 66 C 40 63.5,36 61,36 64 C 36 66.5,40 69.5,40 69.5 C 40 69.5,44 66.5,44 64 C 44 61,40 63.5,40 66 Z" fill="#FCA5A5"/>
</svg>`;

const MASCOT_CSS = `
#teshuva-widget{position:fixed;bottom:24px;right:24px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:8px;font-family:'Segoe UI',Arial,sans-serif;direction:rtl}
#teshuva-mascot-wrap{width:72px;height:82px;cursor:pointer;animation:teshuva-float 3s ease-in-out infinite;filter:drop-shadow(0 4px 12px rgba(124,58,237,.4));transition:transform .15s ease;user-select:none}
#teshuva-mascot-wrap:hover,#teshuva-mascot-wrap:active{animation-play-state:paused;transform:scale(1.08)}
#teshuva-mascot-wrap.wiggle{animation:teshuva-wiggle .4s ease}
#teshuva-bubble{background:#fff;border:2.5px solid #8B5CF6;border-radius:16px 16px 4px 16px;padding:10px 14px;max-width:220px;font-size:13px;line-height:1.5;color:#1F2937;box-shadow:0 4px 20px rgba(0,0,0,.12);animation:teshuva-slide-in .25s ease;position:relative}
#teshuva-bubble .category-tag{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;color:#fff;margin-bottom:5px}
#teshuva-bubble .close-btn{position:absolute;top:6px;left:8px;background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:14px;padding:0;line-height:1}
#teshuva-bubble .close-btn:hover{color:#4B5563}
.hidden{display:none!important}
#teshuva-stats{background:#fff;border:2px solid #E9D5FF;border-radius:14px;padding:12px 14px;width:220px;box-shadow:0 4px 20px rgba(0,0,0,.1);animation:teshuva-slide-in .2s ease}
#teshuva-stats h3{margin:0 0 10px 0;font-size:13px;font-weight:700;color:#7C3AED}
.teshuva-bar-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:12px}
.teshuva-bar-label{width:72px;color:#374151;flex-shrink:0}
.teshuva-bar-track{flex:1;background:#F3F4F6;border-radius:99px;height:7px;overflow:hidden}
.teshuva-bar-fill{height:100%;border-radius:99px;transition:width .5s ease}
@keyframes teshuva-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes teshuva-wiggle{0%{transform:rotate(0)}25%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}75%{transform:rotate(-6deg)}100%{transform:rotate(0)}}
@keyframes teshuva-slide-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;

class TeshuvaMascot {
  constructor(brain, prefs) {
    this.brain   = brain;
    this.prefs   = prefs;
    this.widget  = null;
    this.bubble  = null;
    this.stats   = null;
    this.bubbleTimer = null;
    this.mounted = false;
  }

  mount() {
    if (this.mounted || !this.prefs.mascot.visible) return;

    const style = document.createElement("style");
    style.textContent = MASCOT_CSS;
    document.head.appendChild(style);

    this.widget = document.createElement("div");
    this.widget.id = "teshuva-widget";
    this.widget.innerHTML = `
      <div id="teshuva-stats" class="hidden"></div>
      <div id="teshuva-bubble" class="hidden"></div>
      <div id="teshuva-mascot-wrap">${MASCOT_SVG}</div>`;
    document.body.appendChild(this.widget);

    this.bubble = this.widget.querySelector("#teshuva-bubble");
    this.stats  = this.widget.querySelector("#teshuva-stats");
    const wrap  = this.widget.querySelector("#teshuva-mascot-wrap");

    wrap.addEventListener("click", () => this._onMascotClick());
    this.mounted = true;

    setTimeout(() => this.say("שלום! אני כאן כדי להסביר למה אתה רואה מה שאתה רואה 👁️", null, 4000), 1200);
  }

  say(text, catId, duration = 5000) {
    if (!this.bubble) return;
    clearTimeout(this.bubbleTimer);

    const tag    = catId ? this.prefs.categories[catId] : null;
    const tagHtml = tag
      ? `<span class="category-tag" style="background:${tag.color}">${tag.heLabel}</span><br>`
      : "";

    this.bubble.innerHTML = `<button class="close-btn" id="teshuva-close">✕</button>${tagHtml}${text}`;
    this.bubble.classList.remove("hidden");

    this.bubble.querySelector("#teshuva-close")
      ?.addEventListener("click", e => { e.stopPropagation(); this.bubble.classList.add("hidden"); });

    if (duration > 0) {
      this.bubbleTimer = setTimeout(() => this.bubble.classList.add("hidden"), duration);
    }
  }

  onContentDetected(catId) {
    this.say(this.brain.explain(catId), catId, 7000);
    this._wiggle();
    this._refreshStats();
  }

  _refreshStats() {
    if (!this.stats) return;
    const top = this.brain.topCategories(5);
    if (!top.length) { this.stats.classList.add("hidden"); return; }
    const max = top[0].count || 1;
    this.stats.innerHTML = `<h3>מה ראית עד עכשיו?</h3>` +
      top.map(({ label, count, color }) => `
        <div class="teshuva-bar-row">
          <span class="teshuva-bar-label">${label}</span>
          <div class="teshuva-bar-track">
            <div class="teshuva-bar-fill" style="width:${Math.round(count/max*100)}%;background:${color}"></div>
          </div>
          <span style="font-size:11px;color:#6B7280">${count}</span>
        </div>`).join("");
  }

  _onMascotClick() {
    this._wiggle();
    this.stats.classList.toggle("hidden");
    if (!this.stats.classList.contains("hidden")) this._refreshStats();
  }

  _wiggle() {
    const wrap = this.widget?.querySelector("#teshuva-mascot-wrap");
    if (!wrap) return;
    wrap.classList.remove("wiggle");
    void wrap.offsetWidth;
    wrap.classList.add("wiggle");
    wrap.addEventListener("animationend", () => wrap.classList.remove("wiggle"), { once: true });
  }
}
