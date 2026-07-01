(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // mascot/svg-mascot.js
  function injectCSS() {
    if (document.getElementById(CSS_ID)) return;
    const s = document.createElement("style");
    s.id = CSS_ID;
    s.textContent = MASCOT_CSS;
    document.head.appendChild(s);
  }
  function createSVGMascot() {
    let el = null;
    let bubbleEl = null;
    let bubbleTimer = null;
    let animTimer = null;
    const clickCbs = [];
    function mount() {
      injectCSS();
      el = document.createElement("div");
      el.id = WRAPPER_ID;
      el.innerHTML = `<div class="tshuva-bubble" id="tshuva-bubble" style="display:none"></div>${SVG_MARKUP}`;
      document.body.appendChild(el);
      bubbleEl = el.querySelector("#tshuva-bubble");
      el.classList.add("anim-idle");
    }
    return {
      get _el() {
        return el;
      },
      init() {
        mount();
      },
      say(text) {
        if (!bubbleEl) return;
        bubbleEl.textContent = text;
        bubbleEl.style.display = "block";
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => {
          if (bubbleEl) bubbleEl.style.display = "none";
        }, 6e3);
      },
      animate(name) {
        if (!el) return;
        const mood = ANIM_MAP[name] ?? "idle";
        const cls = `anim-${mood}`;
        el.classList.remove("anim-greet", "anim-think", "anim-excited", "anim-confused", "anim-idle");
        el.classList.add(cls);
        clearTimeout(animTimer);
        if (mood !== "idle") {
          animTimer = setTimeout(() => {
            el?.classList.remove(cls);
            el?.classList.add("anim-idle");
          }, 1500);
        }
      },
      show() {
        if (el) el.style.display = "flex";
      },
      hide() {
        if (el) el.style.display = "none";
      },
      onClick(cb) {
        clickCbs.push(cb);
        el?.addEventListener("click", cb);
      }
    };
  }
  var WRAPPER_ID, CSS_ID, SVG_MARKUP, MASCOT_CSS, ANIM_MAP;
  var init_svg_mascot = __esm({
    "mascot/svg-mascot.js"() {
      WRAPPER_ID = "tshuva-mascot-wrapper";
      CSS_ID = "tshuva-mascot-css";
      SVG_MARKUP = `
<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" width="80" height="113" class="tshuva-svg">
  <defs><linearGradient id="tshuvaClipMetal" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fbfdff"/>
    <stop offset=".35" stop-color="#c6d0db"/>
    <stop offset=".7" stop-color="#8c97a6"/>
    <stop offset="1" stop-color="#5d6776"/>
  </linearGradient></defs>
  <g transform="rotate(-6 60 95)">
    <rect x="28" y="54" width="64" height="102" rx="32" fill="none" stroke="url(#tshuvaClipMetal)" stroke-width="12"/>
    <rect x="44" y="30" width="32" height="104" rx="16" fill="none" stroke="url(#tshuvaClipMetal)" stroke-width="12"/>
    <path d="M33 72 Q30 104 37 134" stroke="rgba(255,255,255,.55)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M39 41 Q50 33 61 40" stroke="url(#tshuvaClipMetal)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <path d="M70 40 Q82 33 93 42" stroke="url(#tshuvaClipMetal)" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="51" cy="63" rx="14" ry="16.5" fill="#fff" stroke="#2a3340" stroke-width="2"/>
    <ellipse cx="79" cy="63" rx="14" ry="16.5" fill="#fff" stroke="#2a3340" stroke-width="2"/>
    <g class="tshuva-eyes">
      <circle class="tshuva-pupil-l" cx="53" cy="66" r="6.6" fill="#11161f"/>
      <circle class="tshuva-pupil-r" cx="81" cy="66" r="6.6" fill="#11161f"/>
      <circle cx="50.4" cy="62.6" r="2.1" fill="#fff"/>
      <circle cx="78.4" cy="62.6" r="2.1" fill="#fff"/>
    </g>
  </g>
</svg>`;
      MASCOT_CSS = `
#${WRAPPER_ID} {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  top: auto !important;
  left: auto !important;
  z-index: 2147483647 !important;
  cursor: pointer !important;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  font-family: 'Segoe UI', Arial, sans-serif;
}
#${WRAPPER_ID} .tshuva-svg {
  filter: drop-shadow(0 4px 12px rgba(0,0,0,.45));
  transition: transform .15s ease;
  display: block;
}
#${WRAPPER_ID}:hover .tshuva-svg {
  transform: scale(1.07);
}
#${WRAPPER_ID} .tshuva-eyes {
  animation: tshuva-look 5s ease-in-out infinite;
}
@keyframes tshuva-look {
  0%, 100% { transform: translate(0,0); }
  30%      { transform: translate(-3px,2px); }
  60%      { transform: translate(3px,1px); }
}
#${WRAPPER_ID} .tshuva-bubble {
  max-width: 240px;
  background: #1e1b4b;
  border: 1.5px solid #7C3AED;
  border-radius: 14px 14px 4px 14px;
  padding: 9px 13px;
  font-size: 13px;
  line-height: 1.55;
  color: #e9d5ff;
  direction: rtl;
  text-align: right;
  box-shadow: 0 4px 16px rgba(0,0,0,.45);
  animation: tshuva-bubble-in .2s ease;
  position: relative;
}
#${WRAPPER_ID} .tshuva-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 12px;
  border: 8px solid transparent;
  border-top-color: #7C3AED;
  border-bottom: none;
}
@keyframes tshuva-bubble-in {
  from { opacity: 0; transform: translateY(6px) scale(.95); }
  to   { opacity: 1; transform: translateY(0)  scale(1);   }
}

/* \u2500\u2500 Mood animations \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
@keyframes tshuva-greet {
  0%,100% { transform: rotate(0deg);   }
  20%      { transform: rotate(-18deg); }
  40%      { transform: rotate(12deg);  }
  60%      { transform: rotate(-12deg); }
  80%      { transform: rotate(8deg);   }
}
@keyframes tshuva-think {
  0%,100% { transform: translateX(0) rotate(0);   }
  30%      { transform: translateX(-4px) rotate(-5deg); }
  60%      { transform: translateX(4px)  rotate(5deg);  }
}
@keyframes tshuva-excited {
  0%,100% { transform: scale(1) translateY(0);     }
  25%      { transform: scale(1.14) translateY(-8px); }
  50%      { transform: scale(.96) translateY(2px);  }
  75%      { transform: scale(1.08) translateY(-5px); }
}
@keyframes tshuva-confused {
  0%,100% { transform: rotate(0);     }
  25%      { transform: rotate(-10deg) translateX(-3px); }
  75%      { transform: rotate(10deg)  translateX(3px);  }
}
@keyframes tshuva-idle {
  0%,100% { transform: translateY(0);    }
  50%      { transform: translateY(-5px); }
}

#${WRAPPER_ID}.anim-greet    .tshuva-svg { animation: tshuva-greet   .6s ease; }
#${WRAPPER_ID}.anim-think    .tshuva-svg { animation: tshuva-think   .8s ease; }
#${WRAPPER_ID}.anim-excited  .tshuva-svg { animation: tshuva-excited .7s ease; }
#${WRAPPER_ID}.anim-confused .tshuva-svg { animation: tshuva-confused .7s ease; }
#${WRAPPER_ID}.anim-idle     .tshuva-svg { animation: tshuva-idle    2.2s ease infinite; }
`;
      ANIM_MAP = {
        Wave: "greet",
        Greeting: "greet",
        Thinking: "think",
        LookDown: "think",
        Congratulate: "excited",
        LookLeft: "confused",
        LookRight: "confused",
        IdleRopePile: "idle",
        IdleFingerTap: "idle"
      };
    }
  });

  // brain/categories.js
  function getCategory(id) {
    return CATEGORIES[id] ?? null;
  }
  var CATEGORIES, CATEGORY_IDS;
  var init_categories = __esm({
    "brain/categories.js"() {
      CATEGORIES = {
        politics: {
          heLabel: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4",
          color: "#EF4444",
          terms: [
            // חד-משמעיים
            { t: "\u05E0\u05EA\u05E0\u05D9\u05D4\u05D5", w: 3 },
            { t: "\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D1\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05DC\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D4\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05D1\u05D9\u05D1\u05D9", w: 3 },
            { t: "\u05D2\u05E0\u05E5", w: 3 },
            { t: "\u05DC\u05E4\u05D9\u05D3", w: 3 },
            { t: "\u05D2\u05DC\u05E0\u05D8", w: 3 },
            { t: "\u05D0\u05D5\u05E4\u05D5\u05D6\u05D9\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05E7\u05D5\u05D0\u05DC\u05D9\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05D4\u05DE\u05DE\u05E9\u05DC\u05D4", w: 3 },
            { t: "\u05D4\u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: '\u05D7"\u05DB', w: 3 },
            { t: "\u05D7\u05DB", w: 2 },
            // חזקים
            { t: "\u05D1\u05D7\u05D9\u05E8\u05D5\u05EA", w: 2 },
            { t: "\u05DC\u05D1\u05D7\u05D9\u05E8\u05D5\u05EA", w: 2 },
            { t: "\u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05DE\u05E4\u05DC\u05D2\u05D4", w: 2 },
            { t: "\u05E9\u05DC \u05D4\u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9\u05E7\u05D4", w: 2 },
            { t: "\u05E4\u05D5\u05DC\u05D9\u05D8\u05D9", w: 2 },
            { t: "\u05DE\u05D3\u05D9\u05E0\u05D9\u05D5\u05EA", w: 2 },
            { t: "\u05E9\u05E8 ", w: 2 },
            { t: "\u05D4\u05E9\u05E8", w: 2 },
            { t: "\u05E8\u05D0\u05E9 \u05DE\u05DE\u05E9\u05DC\u05D4", w: 2 },
            { t: "\u05E6\u05D1\u05D0", w: 1 },
            { t: "\u05D9\u05DE\u05D9\u05DF", w: 1 },
            { t: "\u05E9\u05DE\u05D0\u05DC", w: 1 },
            { t: "\u05D3\u05DE\u05D5\u05E7\u05E8\u05D8\u05D9\u05D4", w: 2 },
            // אנגלית
            { t: "election", w: 2 },
            { t: "government", w: 2 },
            { t: "congress", w: 2 },
            { t: "senate", w: 2 },
            { t: "president", w: 2 },
            { t: "minister", w: 2 },
            { t: "vote", w: 1 },
            { t: "policy", w: 1 },
            { t: "democrat", w: 2 },
            { t: "republican", w: 2 },
            { t: "parliament", w: 2 },
            { t: "prime minister", w: 3 },
            { t: "political", w: 2 },
            { t: "trump", w: 3 },
            { t: "biden", w: 3 },
            { t: "netanyahu", w: 3 }
          ]
        },
        sports: {
          heLabel: "\u05E1\u05E4\u05D5\u05E8\u05D8",
          color: "#3B82F6",
          terms: [
            { t: "\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05D1\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05DC\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05D2\u05DC\u05DF", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC", w: 3 },
            { t: "\u05D1\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC", w: 3 },
            { t: "\u05DB\u05D3\u05D5\u05E8\u05E1\u05DC\u05DF", w: 3 },
            { t: "\u05DE\u05DB\u05D1\u05D9", w: 3 },
            { t: "\u05D4\u05E4\u05D5\u05E2\u05DC", w: 3 },
            { t: "\u05D1\u05D9\u05EA\u05E8", w: 3 },
            { t: '\u05D1\u05D9\u05EA"\u05E8', w: 3 },
            { t: "\u05E0\u05D1\u05D7\u05E8\u05EA", w: 3 },
            { t: "\u05D4\u05E0\u05D1\u05D7\u05E8\u05EA", w: 3 },
            { t: "\u05DC\u05D9\u05D2\u05D4", w: 2 },
            { t: "\u05D1\u05DC\u05D9\u05D2\u05D4", w: 2 },
            { t: "\u05D0\u05DC\u05D9\u05E4\u05D5\u05EA", w: 2 },
            { t: "\u05D2\u05D5\u05DC", w: 2 },
            { t: "\u05E9\u05D7\u05E7\u05DF", w: 1 },
            { t: "\u05E7\u05D1\u05D5\u05E6\u05D4", w: 1 },
            { t: "\u05DE\u05D2\u05E8\u05E9", w: 2 },
            { t: "\u05E1\u05E4\u05D5\u05E8\u05D8", w: 2 },
            { t: "\u05EA\u05D7\u05E8\u05D5\u05EA", w: 1 },
            { t: "\u05DE\u05E9\u05D7\u05E7", w: 1 },
            { t: "\u05D2\u05DE\u05E8", w: 2 },
            { t: "\u05E4\u05DC\u05D9\u05D9\u05D0\u05D5\u05E3", w: 2 },
            { t: "\u05E4\u05D9\u05E0\u05D0\u05DC", w: 2 },
            { t: "\u05D3\u05E8\u05D1\u05D9", w: 2 },
            { t: "\u05D9\u05D5\u05E8\u05D5\u05E4\u05D4", w: 2 },
            { t: "\u05E6\u05DE\u05E8\u05EA", w: 1 },
            { t: "\u05D0\u05E6\u05DF", w: 2 },
            { t: "\u05E9\u05D7\u05D9\u05D9\u05D4", w: 2 },
            { t: "football", w: 2 },
            { t: "basketball", w: 2 },
            { t: "soccer", w: 2 },
            { t: "goal", w: 1 },
            { t: "match", w: 1 },
            { t: "player", w: 1 },
            { t: "team", w: 1 },
            { t: "championship", w: 2 },
            { t: "nba", w: 3 },
            { t: "fifa", w: 3 },
            { t: "score", w: 1 },
            { t: "league", w: 2 },
            { t: "tournament", w: 2 },
            { t: "messi", w: 3 },
            { t: "ronaldo", w: 3 },
            { t: "lebron", w: 3 }
          ]
        },
        entertainment: {
          heLabel: "\u05D1\u05D9\u05D3\u05D5\u05E8",
          color: "#EC4899",
          terms: [
            { t: "\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05D4\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05D1\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05DC\u05E1\u05E8\u05D8", w: 2 },
            { t: "\u05DE\u05D5\u05D6\u05D9\u05E7\u05D4", w: 2 },
            { t: "\u05E9\u05D9\u05E8", w: 2 },
            { t: "\u05E9\u05D9\u05E8\u05D9\u05DD", w: 2 },
            { t: "\u05D1\u05D9\u05E6\u05D5\u05E2", w: 1 },
            { t: "\u05D6\u05DE\u05E8", w: 2 },
            { t: "\u05D6\u05DE\u05E8\u05EA", w: 2 },
            { t: "\u05E9\u05D7\u05E7\u05DF", w: 1 },
            { t: "\u05E9\u05D7\u05E7\u05E0\u05D9\u05EA", w: 2 },
            { t: "\u05E8\u05D9\u05D0\u05DC\u05D9\u05D8\u05D9", w: 3 },
            { t: "\u05E1\u05D3\u05E8\u05D4", w: 2 },
            { t: "\u05D1\u05E1\u05D3\u05E8\u05D4", w: 2 },
            { t: "\u05E2\u05D5\u05E0\u05D4", w: 1 },
            { t: "\u05D0\u05DC\u05D1\u05D5\u05DD", w: 2 },
            { t: "\u05E7\u05D5\u05E0\u05E6\u05E8\u05D8", w: 3 },
            { t: "\u05DC\u05D4\u05E7\u05D4", w: 2 },
            { t: "\u05E9\u05D9\u05D3\u05D5\u05E8", w: 1 },
            { t: "\u05D8\u05DC\u05D5\u05D5\u05D9\u05D6\u05D9\u05D4", w: 2 },
            { t: "\u05D1\u05D8\u05DC\u05D5\u05D5\u05D9\u05D6\u05D9\u05D4", w: 2 },
            { t: "\u05E2\u05E8\u05D5\u05E5", w: 1 },
            { t: "\u05EA\u05D5\u05DB\u05E0\u05D9\u05EA", w: 1 },
            { t: "\u05E7\u05D5\u05DE\u05D3\u05D9\u05D4", w: 2 },
            { t: "\u05D3\u05E8\u05DE\u05D4", w: 1 },
            { t: "\u05E7\u05DC\u05D9\u05E4", w: 2 },
            { t: "\u05D9\u05D5\u05D8\u05D9\u05D5\u05D1", w: 2 },
            { t: "\u05D8\u05D9\u05E7\u05D8\u05D5\u05E7", w: 2 },
            { t: "\u05D0\u05D9\u05E0\u05E1\u05D8\u05D2\u05E8\u05DD", w: 1 },
            { t: "\u05E1\u05DC\u05D1\u05E8\u05D9\u05D8\u05D9", w: 2 },
            { t: "\u05D0\u05D5\u05E4\u05E0\u05D4", w: 2 },
            { t: "movie", w: 2 },
            { t: "music", w: 2 },
            { t: "song", w: 2 },
            { t: "singer", w: 2 },
            { t: "actor", w: 2 },
            { t: "show", w: 1 },
            { t: "film", w: 2 },
            { t: "celebrity", w: 2 },
            { t: "series", w: 2 },
            { t: "netflix", w: 3 },
            { t: "spotify", w: 3 },
            { t: "concert", w: 2 },
            { t: "album", w: 2 },
            { t: "viral", w: 2 },
            { t: "trending", w: 1 },
            { t: "tiktok", w: 2 }
          ]
        },
        technology: {
          heLabel: "\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4",
          color: "#8B5CF6",
          terms: [
            { t: "\u05D1\u05D9\u05E0\u05D4 \u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA", w: 3 },
            { t: "AI", w: 2 },
            { t: "ai", w: 2 },
            { t: "ChatGPT", w: 3 },
            { t: "chatgpt", w: 3 },
            { t: "GPT", w: 3 },
            { t: "\u05E1\u05D8\u05D0\u05E8\u05D8\u05D0\u05E4", w: 3 },
            { t: "\u05D4\u05D9\u05D9\u05D8\u05E7", w: 3 },
            { t: "\u05D4\u05D9\u05D9 \u05D8\u05E7", w: 3 },
            { t: "\u05D0\u05E4\u05DC\u05D9\u05E7\u05E6\u05D9\u05D4", w: 2 },
            { t: "\u05EA\u05D5\u05DB\u05E0\u05D4", w: 2 },
            { t: "\u05D7\u05D1\u05E8\u05EA \u05D8\u05E7", w: 3 },
            { t: "\u05E7\u05D5\u05D3", w: 1 },
            { t: "\u05E4\u05D9\u05EA\u05D5\u05D7", w: 2 },
            { t: "\u05DE\u05E4\u05EA\u05D7", w: 1 },
            { t: "\u05D2\u05D5\u05D2\u05DC", w: 2 },
            { t: "\u05D0\u05E4\u05DC", w: 2 },
            { t: "\u05D0\u05DE\u05D6\u05D5\u05DF", w: 2 },
            { t: "\u05DE\u05D9\u05E7\u05E8\u05D5\u05E1\u05D5\u05E4\u05D8", w: 2 },
            { t: "\u05DE\u05D8\u05D0", w: 2 },
            { t: "\u05D7\u05D3\u05E9\u05E0\u05D5\u05EA", w: 2 },
            { t: "\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05D3\u05D9\u05D2\u05D9\u05D8\u05DC", w: 2 },
            { t: "\u05E8\u05D5\u05D1\u05D5\u05D8", w: 2 },
            { t: "\u05E7\u05E8\u05D9\u05E4\u05D8\u05D5", w: 2 },
            { t: "\u05D1\u05DC\u05D5\u05E7\u05E6'\u05D9\u05D9\u05DF", w: 2 },
            { t: "\u05D1\u05D9\u05D8\u05E7\u05D5\u05D9\u05DF", w: 2 },
            { t: "artificial intelligence", w: 3 },
            { t: "software", w: 2 },
            { t: "startup", w: 2 },
            { t: "app", w: 1 },
            { t: "coding", w: 2 },
            { t: "programming", w: 2 },
            { t: "tech", w: 1 },
            { t: "google", w: 2 },
            { t: "apple", w: 2 },
            { t: "amazon", w: 2 },
            { t: "meta", w: 2 },
            { t: "openai", w: 3 },
            { t: "github", w: 2 },
            { t: "developer", w: 2 },
            { t: "cybersecurity", w: 2 }
          ]
        },
        news: {
          heLabel: "\u05D7\u05D3\u05E9\u05D5\u05EA",
          color: "#F97316",
          terms: [
            { t: "\u05DE\u05DC\u05D7\u05DE\u05D4", w: 3 },
            { t: "\u05D1\u05DE\u05DC\u05D7\u05DE\u05D4", w: 3 },
            { t: "\u05E9\u05E8\u05D9\u05E4\u05D4", w: 2 },
            { t: "\u05D1\u05E9\u05E8\u05D9\u05E4\u05D4", w: 2 },
            { t: "\u05E8\u05E2\u05D9\u05D3\u05EA \u05D0\u05D3\u05DE\u05D4", w: 3 },
            { t: "\u05E4\u05D9\u05D2\u05D5\u05E2", w: 3 },
            { t: "\u05DE\u05D1\u05E6\u05E2", w: 2 },
            { t: "\u05D9\u05E8\u05D9", w: 2 },
            { t: "\u05E0\u05E4\u05D2\u05E2", w: 2 },
            { t: "\u05E0\u05E4\u05D2\u05E2\u05D9\u05DD", w: 2 },
            { t: "\u05EA\u05D0\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D0\u05E1\u05D5\u05DF", w: 3 },
            { t: "\u05E2\u05D3\u05DB\u05D5\u05DF", w: 1 },
            { t: "\u05E4\u05DC\u05E9", w: 2 },
            { t: "\u05DB\u05EA\u05D1\u05D4", w: 1 },
            { t: "\u05D3\u05D9\u05D5\u05D5\u05D7", w: 1 },
            { t: "\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D4\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D1\u05D7\u05D3\u05E9\u05D5\u05EA", w: 2 },
            { t: "\u05D9\u05D3\u05D9\u05E2\u05D4", w: 2 },
            { t: "\u05E2\u05E6\u05D5\u05E8", w: 1 },
            { t: "\u05D7\u05D9\u05E4\u05D5\u05E9", w: 1 },
            { t: "\u05DE\u05D7\u05E1\u05D5\u05DD", w: 2 },
            { t: "\u05E0\u05D5\u05D4\u05DC", w: 1 },
            { t: "\u05D4\u05D5\u05D3\u05E2\u05D4", w: 1 },
            { t: "\u05D7\u05D9\u05E8\u05D5\u05DD", w: 3 },
            { t: "\u05D1\u05D9\u05D8\u05D7\u05D5\u05DF", w: 2 },
            { t: "\u05D2\u05D1\u05D5\u05DC", w: 2 },
            { t: "breaking", w: 2 },
            { t: "news", w: 1 },
            { t: "update", w: 1 },
            { t: "war", w: 2 },
            { t: "attack", w: 2 },
            { t: "disaster", w: 2 },
            { t: "earthquake", w: 2 },
            { t: "fire", w: 1 },
            { t: "crisis", w: 2 },
            { t: "alert", w: 2 },
            { t: "urgent", w: 2 },
            { t: "killed", w: 2 },
            { t: "injured", w: 2 },
            { t: "report", w: 1 },
            { t: "conflict", w: 2 },
            { t: "bomb", w: 3 }
          ]
        },
        health: {
          heLabel: "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA",
          color: "#10B981",
          terms: [
            { t: "\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA", w: 3 },
            { t: "\u05D4\u05D1\u05E8\u05D9\u05D0\u05D5\u05EA", w: 3 },
            { t: "\u05EA\u05E8\u05D5\u05E4\u05D4", w: 2 },
            { t: "\u05EA\u05E8\u05D5\u05E4\u05D5\u05EA", w: 2 },
            { t: "\u05E8\u05D5\u05E4\u05D0", w: 2 },
            { t: "\u05E8\u05D5\u05E4\u05D0\u05D9\u05DD", w: 2 },
            { t: "\u05D7\u05D5\u05DC\u05D4", w: 2 },
            { t: "\u05DE\u05D7\u05DC\u05D4", w: 2 },
            { t: "\u05E4\u05D9\u05D8\u05E0\u05E1", w: 2 },
            { t: "\u05D3\u05D9\u05D0\u05D8\u05D4", w: 2 },
            { t: "\u05EA\u05D6\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D5\u05D9\u05D8\u05DE\u05D9\u05DF", w: 2 },
            { t: "\u05E4\u05E1\u05D9\u05DB\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05E0\u05E4\u05E9", w: 2 },
            { t: "\u05DB\u05D5\u05E9\u05E8", w: 2 },
            { t: "\u05D0\u05D9\u05DE\u05D5\u05DF", w: 2 },
            { t: "\u05D1\u05D9\u05EA \u05D7\u05D5\u05DC\u05D9\u05DD", w: 3 },
            { t: "\u05DE\u05E8\u05E4\u05D0\u05D4", w: 2 },
            { t: "\u05E0\u05D9\u05EA\u05D5\u05D7", w: 2 },
            { t: "\u05D7\u05D9\u05E1\u05D5\u05DF", w: 2 },
            { t: "\u05D5\u05D9\u05E8\u05D5\u05E1", w: 2 },
            { t: "\u05DE\u05D2\u05E4\u05D4", w: 2 },
            { t: "\u05E1\u05D5\u05DB\u05E8\u05EA", w: 3 },
            { t: "\u05DC\u05D7\u05E5 \u05D3\u05DD", w: 3 },
            { t: "\u05E4\u05E1\u05D9\u05DB\u05D9\u05D0\u05D8\u05E8\u05D9\u05D4", w: 3 },
            { t: "\u05D7\u05E8\u05D3\u05D4", w: 2 },
            { t: "\u05D3\u05D9\u05DB\u05D0\u05D5\u05DF", w: 2 },
            { t: "\u05E9\u05D9\u05E0\u05D4", w: 1 },
            { t: "health", w: 2 },
            { t: "medicine", w: 2 },
            { t: "doctor", w: 2 },
            { t: "disease", w: 2 },
            { t: "fitness", w: 2 },
            { t: "diet", w: 1 },
            { t: "nutrition", w: 2 },
            { t: "mental health", w: 3 },
            { t: "therapy", w: 2 },
            { t: "wellness", w: 2 },
            { t: "vaccine", w: 2 },
            { t: "hospital", w: 2 },
            { t: "symptom", w: 2 },
            { t: "exercise", w: 1 },
            { t: "weight loss", w: 2 }
          ]
        },
        economy: {
          heLabel: "\u05DB\u05DC\u05DB\u05DC\u05D4",
          color: "#F59E0B",
          terms: [
            { t: "\u05DB\u05DC\u05DB\u05DC\u05D4", w: 3 },
            { t: "\u05D4\u05DB\u05DC\u05DB\u05DC\u05D4", w: 3 },
            { t: "\u05D1\u05D5\u05E8\u05E1\u05D4", w: 3 },
            { t: "\u05DE\u05E0\u05D9\u05D5\u05EA", w: 3 },
            { t: "\u05D3\u05D5\u05DC\u05E8", w: 2 },
            { t: "\u05E9\u05E7\u05DC", w: 2 },
            { t: "\u05D0\u05D9\u05E0\u05E4\u05DC\u05E6\u05D9\u05D4", w: 3 },
            { t: "\u05E8\u05D9\u05D1\u05D9\u05EA", w: 3 },
            { t: "\u05D4\u05E9\u05E7\u05E2\u05D4", w: 2 },
            { t: "\u05E0\u05D3\u05DC\u05DF", w: 3 },
            { t: '\u05E0\u05D3\u05DC"\u05DF', w: 3 },
            { t: "\u05DE\u05E9\u05DB\u05E0\u05EA\u05D0", w: 3 },
            { t: "\u05DE\u05D7\u05D9\u05E8", w: 1 },
            { t: "\u05D9\u05D5\u05E7\u05E8", w: 2 },
            { t: "\u05D9\u05D5\u05E7\u05E8 \u05D4\u05DE\u05D7\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05E1", w: 1 },
            { t: "\u05EA\u05E7\u05E6\u05D9\u05D1", w: 2 },
            { t: "\u05D2\u05D9\u05E8\u05E2\u05D5\u05DF", w: 2 },
            { t: "\u05D9\u05D9\u05E6\u05D5\u05D0", w: 2 },
            { t: "\u05D9\u05D1\u05D5\u05D0", w: 2 },
            { t: "\u05E8\u05D5\u05D5\u05D7", w: 1 },
            { t: "\u05D4\u05E4\u05E1\u05D3", w: 1 },
            { t: "\u05D7\u05D1\u05E8\u05D4", w: 1 },
            { t: "\u05E9\u05DB\u05E8", w: 2 },
            { t: "\u05E9\u05DB\u05E8 \u05DE\u05D9\u05E0\u05D9\u05DE\u05D5\u05DD", w: 3 },
            { t: "\u05E4\u05E0\u05E1\u05D9\u05D4", w: 2 },
            { t: "\u05D1\u05D9\u05D8\u05D5\u05D7 \u05DC\u05D0\u05D5\u05DE\u05D9", w: 3 },
            { t: "economy", w: 2 },
            { t: "stocks", w: 2 },
            { t: "market", w: 1 },
            { t: "dollar", w: 2 },
            { t: "inflation", w: 2 },
            { t: "investment", w: 2 },
            { t: "bitcoin", w: 2 },
            { t: "crypto", w: 2 },
            { t: "finance", w: 2 },
            { t: "bank", w: 1 },
            { t: "mortgage", w: 2 },
            { t: "price", w: 1 },
            { t: "gdp", w: 3 },
            { t: "recession", w: 2 },
            { t: "nasdaq", w: 3 },
            { t: "s&p", w: 3 },
            { t: "interest rate", w: 3 },
            { t: "housing", w: 1 }
          ]
        },
        science: {
          heLabel: "\u05DE\u05D3\u05E2",
          color: "#06B6D4",
          terms: [
            { t: "\u05DE\u05D3\u05E2", w: 3 },
            { t: "\u05D4\u05DE\u05D3\u05E2", w: 3 },
            { t: "\u05D7\u05DC\u05DC", w: 3 },
            { t: "\u05D1\u05D7\u05DC\u05DC", w: 3 },
            { t: "\u05E4\u05D9\u05D6\u05D9\u05E7\u05D4", w: 3 },
            { t: "\u05DB\u05D9\u05DE\u05D9\u05D4", w: 3 },
            { t: "\u05D1\u05D9\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05D7\u05E7\u05E8", w: 2 },
            { t: "\u05D2\u05D9\u05DC\u05D5\u05D9", w: 2 },
            { t: "\u05E0\u05D0\u05E1\u05D0", w: 3 },
            { t: "\u05DB\u05D5\u05DB\u05D1", w: 2 },
            { t: "\u05DB\u05D5\u05DB\u05D1\u05D9\u05DD", w: 2 },
            { t: "\u05D2\u05DC\u05E7\u05E1\u05D9\u05D4", w: 3 },
            { t: "\u05D7\u05D9\u05D9\u05D3\u05E7", w: 2 },
            { t: "\u05D7\u05D9\u05D9\u05D3\u05E7\u05D9\u05DD", w: 2 },
            { t: "\u05D0\u05D1\u05D5\u05DC\u05D5\u05E6\u05D9\u05D4", w: 3 },
            { t: "DNA", w: 3 },
            { t: "\u05D2\u05E0\u05D8\u05D9\u05E7\u05D4", w: 3 },
            { t: "\u05DE\u05D0\u05D5\u05D1\u05DF", w: 2 },
            { t: "\u05D3\u05D9\u05E0\u05D5\u05D6\u05D0\u05D5\u05E8", w: 2 },
            { t: "\u05E0\u05D9\u05E1\u05D5\u05D9", w: 2 },
            { t: "\u05DE\u05E2\u05D1\u05D3\u05D4", w: 2 },
            { t: "\u05D7\u05D5\u05E7\u05E8", w: 1 },
            { t: "\u05DE\u05D3\u05E2\u05DF", w: 2 },
            { t: "\u05D0\u05E1\u05D8\u05E8\u05D5\u05E0\u05D5\u05DE\u05D9\u05D4", w: 3 },
            { t: "\u05D2\u05D9\u05D0\u05D5\u05D2\u05E8\u05E4\u05D9\u05D4", w: 2 },
            { t: "\u05D0\u05E7\u05DC\u05D9\u05DD", w: 2 },
            { t: "science", w: 2 },
            { t: "space", w: 2 },
            { t: "physics", w: 2 },
            { t: "chemistry", w: 2 },
            { t: "biology", w: 2 },
            { t: "research", w: 1 },
            { t: "discovery", w: 2 },
            { t: "nasa", w: 3 },
            { t: "star", w: 1 },
            { t: "planet", w: 2 },
            { t: "evolution", w: 2 },
            { t: "study", w: 1 },
            { t: "experiment", w: 2 },
            { t: "quantum", w: 3 },
            { t: "climate", w: 2 },
            { t: "species", w: 2 }
          ]
        },
        religion: {
          heLabel: "\u05D3\u05EA \u05D5\u05DE\u05E1\u05D5\u05E8\u05EA",
          color: "#A78BFA",
          terms: [
            { t: "\u05EA\u05D5\u05E8\u05D4", w: 3 },
            { t: "\u05D4\u05EA\u05D5\u05E8\u05D4", w: 3 },
            { t: "\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05D1\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05DC\u05E9\u05D1\u05EA", w: 3 },
            { t: "\u05D7\u05D2", w: 2 },
            { t: "\u05D1\u05D7\u05D2", w: 2 },
            { t: "\u05EA\u05E4\u05D9\u05DC\u05D4", w: 3 },
            { t: "\u05DC\u05D4\u05EA\u05E4\u05DC\u05DC", w: 3 },
            { t: "\u05E8\u05D1", w: 2 },
            { t: "\u05D4\u05E8\u05D1", w: 2 },
            { t: "\u05D9\u05E9\u05D9\u05D1\u05D4", w: 3 },
            { t: "\u05D4\u05DC\u05DB\u05D4", w: 3 },
            { t: "\u05DB\u05E9\u05E8\u05D5\u05EA", w: 3 },
            { t: "\u05DB\u05E9\u05E8", w: 3 },
            { t: "\u05E4\u05E1\u05D7", w: 3 },
            { t: "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4", w: 3 },
            { t: "\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8", w: 3 },
            { t: "\u05E1\u05D5\u05DB\u05D5\u05EA", w: 3 },
            { t: "\u05D7\u05E0\u05D5\u05DB\u05D4", w: 3 },
            { t: "\u05E4\u05D5\u05E8\u05D9\u05DD", w: 3 },
            { t: "\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA", w: 3 },
            { t: "\u05D1\u05D9\u05EA \u05DB\u05E0\u05E1\u05EA", w: 3 },
            { t: "\u05DB\u05E0\u05E1\u05D9\u05D9\u05D4", w: 3 },
            { t: "\u05DE\u05E1\u05D2\u05D3", w: 3 },
            { t: "\u05DE\u05E6\u05D5\u05D5\u05D4", w: 2 },
            { t: "\u05DE\u05E6\u05D5\u05D5\u05EA", w: 2 },
            { t: "\u05D1\u05E8\u05DB\u05D4", w: 2 },
            { t: "\u05E7\u05D9\u05D3\u05D5\u05E9", w: 3 },
            { t: "\u05EA\u05E9\u05D5\u05D1\u05D4", w: 2 },
            { t: "\u05D0\u05DE\u05D5\u05E0\u05D4", w: 2 },
            { t: "\u05D0\u05DC\u05D5\u05D4\u05D9\u05DD", w: 2 },
            { t: "\u05D3\u05EA\u05D9", w: 2 },
            { t: "\u05D7\u05E8\u05D3\u05D9", w: 3 },
            { t: "\u05D7\u05E8\u05D3\u05D9\u05DD", w: 3 },
            { t: "\u05E6\u05D9\u05D5\u05E0\u05D9 \u05D3\u05EA\u05D9", w: 3 },
            { t: "torah", w: 3 },
            { t: "shabbat", w: 3 },
            { t: "jewish", w: 2 },
            { t: "prayer", w: 2 },
            { t: "rabbi", w: 3 },
            { t: "religion", w: 2 },
            { t: "faith", w: 1 },
            { t: "church", w: 2 },
            { t: "bible", w: 2 },
            { t: "god", w: 1 },
            { t: "holy", w: 1 },
            { t: "synagogue", w: 3 },
            { t: "kosher", w: 3 },
            { t: "islam", w: 2 },
            { t: "muslim", w: 2 },
            { t: "christian", w: 2 }
          ]
        }
      };
      CATEGORY_IDS = Object.keys(CATEGORIES);
    }
  });

  // brain/classifier.js
  function scoreText(text) {
    if (!text || text.length < MIN_TEXT_LENGTH) return {};
    const lower = text.toLowerCase();
    const scores = {};
    for (const id of CATEGORY_IDS) {
      const { terms } = CATEGORIES[id];
      let score = 0;
      for (const { t, w } of terms) {
        if (lower.includes(t.toLowerCase())) score += w;
      }
      if (score >= MIN_SCORE_TO_CLASSIFY) scores[id] = score;
    }
    return scores;
  }
  function classify(text) {
    const scores = scoreText(text);
    if (Object.keys(scores).length === 0) return "uncategorized";
    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }
  var MIN_TEXT_LENGTH, MIN_SCORE_TO_CLASSIFY;
  var init_classifier = __esm({
    "brain/classifier.js"() {
      init_categories();
      MIN_TEXT_LENGTH = 15;
      MIN_SCORE_TO_CLASSIFY = 2;
    }
  });

  // shared/constants.js
  var STORAGE_KEY, ONBOARDING_KEY, SPEAK_COOLDOWN_MS, ASK_AFTER_COUNT, ASK_COOLDOWN_MS, SETTINGS_KEY, MSG;
  var init_constants = __esm({
    "shared/constants.js"() {
      STORAGE_KEY = "teshuva_state";
      ONBOARDING_KEY = "teshuva_onboarded";
      SPEAK_COOLDOWN_MS = 9e3;
      ASK_AFTER_COUNT = 5;
      ASK_COOLDOWN_MS = 5 * 6e4;
      SETTINGS_KEY = "teshuva_settings";
      MSG = {
        GET_STATS: "GET_STATS",
        RESET_STATS: "RESET_STATS",
        RECORD_SIGNAL: "RECORD_SIGNAL",
        // { categoryId, type: 'positive'|'negative' }
        GET_INSIGHTS: "GET_INSIGHTS",
        GET_SETTINGS: "GET_SETTINGS",
        UPDATE_SETTINGS: "UPDATE_SETTINGS",
        // { autoDismiss: boolean }
        SETTINGS_CHANGED: "SETTINGS_CHANGED"
        // broadcast to content scripts
      };
    }
  });

  // brain/state.js
  function createState(storageAdapter) {
    const session = {};
    const allTime = {};
    const weights = {};
    const dismissed = {};
    function initDefaults() {
      for (const id of CATEGORY_IDS) {
        session[id] = 0;
        allTime[id] = allTime[id] ?? 0;
        weights[id] = weights[id] ?? DEFAULT_WEIGHT;
        dismissed[id] = dismissed[id] ?? 0;
      }
    }
    async function persist() {
      await storageAdapter.set(STORAGE_KEY, {
        allTime: { ...allTime },
        weights: { ...weights },
        dismissed: { ...dismissed }
      });
    }
    return {
      // טען נתונים שמורים מהאחסון
      async load() {
        const saved = await storageAdapter.get(STORAGE_KEY);
        if (saved?.allTime) Object.assign(allTime, saved.allTime);
        if (saved?.weights) Object.assign(weights, saved.weights);
        if (saved?.dismissed) Object.assign(dismissed, saved.dismissed);
        initDefaults();
      },
      // רשום צפייה בקטגוריה
      observe(categoryId) {
        session[categoryId] = (session[categoryId] ?? 0) + 1;
        allTime[categoryId] = (allTime[categoryId] ?? 0) + 1;
        persist();
      },
      // המשתמש הראה עניין (לחץ, שיתף, אהב)
      positiveSignal(categoryId) {
        weights[categoryId] = Math.min(MAX_WEIGHT, (weights[categoryId] ?? DEFAULT_WEIGHT) + WEIGHT_POSITIVE_DELTA);
        persist();
      },
      // המשתמש דילג מהר
      negativeSignal(categoryId) {
        weights[categoryId] = Math.max(MIN_WEIGHT, (weights[categoryId] ?? DEFAULT_WEIGHT) - WEIGHT_NEGATIVE_DELTA);
        persist();
      },
      // פוסט הוסר בפועל מהפיד
      dismissSignal(categoryId) {
        dismissed[categoryId] = (dismissed[categoryId] ?? 0) + 1;
        persist();
      },
      // קריאת נתוני הסשן הנוכחי
      getSessionStats() {
        return { ...session };
      },
      // קריאת נתונים מצטברים מכל הזמן
      getAllTimeStats() {
        return { ...allTime };
      },
      // קריאת משקלות העניין של המשתמש
      getWeights() {
        return { ...weights };
      },
      // קריאת ספירת הפוסטים שהוסרו
      getDismissed() {
        return { ...dismissed };
      },
      // סה"כ פוסטים שנצפו בסשן הזה
      getSessionTotal() {
        return Object.values(session).reduce((sum, n) => sum + n, 0);
      },
      // סה"כ פוסטים שהוסרו מכל הזמן
      getDismissedTotal() {
        return Object.values(dismissed).reduce((sum, n) => sum + n, 0);
      },
      // מחק את כל הנתונים
      async reset() {
        for (const id of CATEGORY_IDS) {
          session[id] = 0;
          allTime[id] = 0;
          weights[id] = DEFAULT_WEIGHT;
          dismissed[id] = 0;
        }
        await storageAdapter.set(STORAGE_KEY, null);
      }
    };
  }
  var DEFAULT_WEIGHT, MAX_WEIGHT, MIN_WEIGHT, WEIGHT_POSITIVE_DELTA, WEIGHT_NEGATIVE_DELTA;
  var init_state = __esm({
    "brain/state.js"() {
      init_categories();
      init_constants();
      DEFAULT_WEIGHT = 1;
      MAX_WEIGHT = 3;
      MIN_WEIGHT = 0.1;
      WEIGHT_POSITIVE_DELTA = 0.15;
      WEIGHT_NEGATIVE_DELTA = 0.08;
    }
  });

  // brain/explanations.js
  function greeting() {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour >= 5 && hour < 12) return "\u05D1\u05D5\u05E7\u05E8 \u05D8\u05D5\u05D1! \u2600\uFE0F";
    if (hour >= 12 && hour < 17) return "\u05E6\u05D4\u05E8\u05D9\u05D9\u05DD \u05D8\u05D5\u05D1\u05D9\u05DD! \u{1F324}\uFE0F";
    if (hour >= 17 && hour < 21) return "\u05E2\u05E8\u05D1 \u05D8\u05D5\u05D1! \u{1F306}";
    return "\u05DC\u05D9\u05DC\u05D4 \u05D8\u05D5\u05D1! \u{1F319}";
  }
  function explain(categoryId, allTimeStats) {
    const cat = getCategory(categoryId);
    if (!cat) return null;
    const label = cat.heLabel;
    const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0) || 1;
    const count = allTimeStats[categoryId] ?? 0;
    const pct = Math.round(count / total * 100);
    const seed = count % 3;
    if (count === 0) {
      return [
        `\u05E4\u05E2\u05DD \u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05E9\u05D0\u05E0\u05D9 \u05E8\u05D5\u05D0\u05D4 ${label} \u05D0\u05E6\u05DC\u05DA. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05EA\u05E0\u05E1\u05D4 \u2014 \u05D0\u05DD \u05DC\u05D0 \u05EA\u05E2\u05E6\u05D5\u05E8 \u05E2\u05DC\u05D9\u05D5, \u05D4\u05D5\u05D0 \u05D9\u05D9\u05E2\u05DC\u05DD.`,
        `${label} \u2014 \u05D7\u05D3\u05E9 \u05D1\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA. \u05D9\u05D9\u05EA\u05DB\u05DF \u05E9\u05DE\u05D9\u05E9\u05D4\u05D5 \u05E9\u05D0\u05EA\u05D4 \u05E2\u05D5\u05E7\u05D1 \u05D0\u05D7\u05E8\u05D9\u05D5 \u05E9\u05D9\u05EA\u05E3 \u05DE\u05E9\u05D4\u05D5 \u05D1\u05E0\u05D5\u05E9\u05D0.`,
        `\u05D4\u05E4\u05D9\u05D3 \u05E0\u05D9\u05E1\u05D4 ${label} \u05D1\u05E4\u05E2\u05DD \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4. \u05DB\u05DC \u05E9\u05E0\u05D9\u05D9\u05D4 \u05E9\u05EA\u05E2\u05E6\u05D5\u05E8 \u05E2\u05DC\u05D9\u05D5 \u05DE\u05DC\u05DE\u05D3\u05EA \u05D0\u05D5\u05EA\u05D5 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA.`
      ][seed];
    }
    if (pct >= 40) {
      return [
        `${pct}% \u05DE\u05D4\u05EA\u05D5\u05DB\u05DF \u05E9\u05DC\u05DA \u05D4\u05D5\u05D0 ${label}. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05D1\u05E0\u05D4 \u05DC\u05DA "\u05D1\u05D5\u05E2\u05EA ${label}" \u2014 \u05DB\u05DC \u05DC\u05D7\u05D9\u05E6\u05D4 \u05DE\u05D2\u05D3\u05D9\u05DC\u05D4 \u05D0\u05D5\u05EA\u05D4.`,
        `${label} \u05E9\u05D5\u05DC\u05D8 \u05D1\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA (${pct}%). \u05DB\u05E0\u05E8\u05D0\u05D4 \u05E9\u05D4\u05EA\u05D7\u05D9\u05DC \u05DE\u05E4\u05D5\u05E1\u05D8 \u05D0\u05D7\u05D3 \u05E9\u05E2\u05E6\u05E8\u05EA \u05E2\u05DC\u05D9\u05D5 \u05D6\u05DE\u05DF \u05E8\u05D1.`,
        `\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u05DE\u05D5\u05D8\u05D4 ${label} (${pct}%). \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05E0\u05D9\u05D7 \u05E9\u05D6\u05D4 \u05DE\u05D4 \u05E9\u05D0\u05EA\u05D4 \u05E8\u05D5\u05E6\u05D4 \u2014 \u05D4\u05D0\u05DD \u05D4\u05D5\u05D0 \u05E6\u05D5\u05D3\u05E7?`
      ][seed];
    }
    if (pct >= 15) {
      return [
        `${label} \u05DE\u05D4\u05D5\u05D5\u05D4 ${pct}% \u05DE\u05D4\u05E4\u05D9\u05D3 \u2014 \u05E0\u05D5\u05E9\u05D0 \u05E9\u05D7\u05D5\u05D6\u05E8. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05EA\u05D7\u05D9\u05DC "\u05DC\u05D6\u05DB\u05D5\u05E8" \u05D0\u05D5\u05EA\u05DA \u05DB\u05DE\u05D9 \u05E9\u05DE\u05D2\u05D9\u05D1 \u05DC${label}.`,
        `${pct}% ${label}. \u05DC\u05D0 \u05E9\u05D5\u05DC\u05D8 \u05D0\u05D1\u05DC \u05D7\u05D5\u05D6\u05E8 \u2014 \u05D4\u05E4\u05DC\u05D8\u05E4\u05D5\u05E8\u05DE\u05D4 \u05D1\u05D5\u05D3\u05E7\u05EA \u05E2\u05D3 \u05DB\u05DE\u05D4 \u05D0\u05EA\u05D4 \u05DE\u05D2\u05D9\u05D1.`,
        `\u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05D4\u05E9\u05E7\u05D9\u05E2 ${pct}% \u05DE\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u05D1${label}. \u05D0\u05DD \u05DC\u05D0 \u05EA\u05D2\u05D9\u05D1 \u05DB\u05DC\u05DC \u2014 \u05D4\u05D5\u05D0 \u05D9\u05E4\u05D7\u05D9\u05EA.`
      ][seed];
    }
    return [
      `${label} \u05DE\u05D5\u05E4\u05D9\u05E2 \u05DC\u05E4\u05E2\u05DE\u05D9\u05DD (${pct}%). \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05E0\u05E1\u05D4 \u05DC\u05D4\u05D1\u05D9\u05DF \u05D0\u05DD \u05D9\u05E9 \u05E4\u05D4 \u05E4\u05D5\u05D8\u05E0\u05E6\u05D9\u05D0\u05DC.`,
      `${pct}% \u05D1\u05DC\u05D1\u05D3 \u05DE\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u05D4\u05D5\u05D0 ${label} \u2014 \u05D4\u05E4\u05DC\u05D8\u05E4\u05D5\u05E8\u05DE\u05D4 \u05D1\u05D5\u05D3\u05E7\u05EA \u05D0\u05DD \u05D6\u05D4 \u05EA\u05D5\u05E4\u05E1 \u05D0\u05E6\u05DC\u05DA.`,
      `${label} \u05D1\u05DB\u05DE\u05D5\u05EA \u05E7\u05D8\u05E0\u05D4 (${pct}%). \u05D0\u05DD \u05EA\u05E2\u05E6\u05D5\u05E8 \u05E2\u05DC\u05D9\u05D5 \u2014 \u05D4\u05DB\u05DE\u05D5\u05EA \u05EA\u05D2\u05D3\u05DC \u05DE\u05D4\u05E8.`
    ][seed];
  }
  function weeklyInsights(allTimeStats, historyStats = {}) {
    const insights = [];
    const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0);
    if (total === 0) return ["\u05E2\u05D5\u05D3 \u05DC\u05D0 \u05E6\u05D1\u05E8\u05EA \u05DE\u05E1\u05E4\u05D9\u05E7 \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD. \u05D4\u05DE\u05E9\u05DA \u05DC\u05D2\u05DC\u05D5\u05DC \u05E2\u05DD \u05D4\u05EA\u05D5\u05E1\u05E3 \u05E4\u05E2\u05D9\u05DC!"];
    const ranked = Object.entries(allTimeStats).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const [topId, topCount] = ranked[0] ?? [];
    if (topId) {
      const label = getCategory(topId)?.heLabel ?? topId;
      const pct = Math.round(topCount / total * 100);
      insights.push(`${pct}% \u05DE\u05D4\u05EA\u05D5\u05DB\u05DF \u05E9\u05E8\u05D0\u05D9\u05EA \u05D4\u05D5\u05D0 <b>${label}</b>. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05E0\u05D9\u05D7 \u05E9\u05D6\u05D4 \u05DE\u05D4 \u05E9\u05D0\u05EA\u05D4.`);
    }
    const [secId, secCount] = ranked[1] ?? [];
    if (secId) {
      const label = getCategory(secId)?.heLabel ?? secId;
      const pct = Math.round(secCount / total * 100);
      insights.push(`\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05E9\u05E0\u05D9\u05D9\u05D4: <b>${label}</b> (${pct}%). ${pct > 20 ? "\u05D2\u05DD \u05E4\u05D4 \u05D9\u05E9 \u05D1\u05D5\u05E2\u05D4." : "\u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D0 \u05E9\u05D5\u05DC\u05D8\u05EA."}`);
    }
    const socialVisits = Object.values(historyStats.socialCounts ?? {}).reduce((s, n) => s + n, 0);
    if (socialVisits > 0) {
      const perDay = Math.round(socialVisits / 7);
      insights.push(`\u05D1\u05D9\u05E7\u05E8\u05EA \u05D1\u05E8\u05E9\u05EA\u05D5\u05EA \u05D7\u05D1\u05E8\u05EA\u05D9\u05D5\u05EA ${socialVisits.toLocaleString()} \u05E4\u05E2\u05DE\u05D9\u05DD \u05D4\u05E9\u05D1\u05D5\u05E2 \u2014 \u05DB-<b>${perDay} \u05D1\u05D9\u05E7\u05D5\u05E8\u05D9\u05DD \u05D1\u05D9\u05D5\u05DD</b>.`);
    }
    if (historyStats.peakHour != null) {
      const h = historyStats.peakHour;
      const period = h < 12 ? "\u05D1\u05D5\u05E7\u05E8" : h < 17 ? "\u05D0\u05D7\u05E8 \u05D4\u05E6\u05D4\u05E8\u05D9\u05D9\u05DD" : h < 21 ? "\u05E2\u05E8\u05D1" : "\u05DC\u05D9\u05DC\u05D4";
      insights.push(`\u05D0\u05EA\u05D4 \u05D2\u05D5\u05DC\u05E9 \u05D4\u05DB\u05D9 \u05D4\u05E8\u05D1\u05D4 \u05D1${period} (\u05E9\u05E2\u05D4 ${h}:00). \u05D1\u05D3\u05D9\u05D5\u05E7 \u05D0\u05D6 \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05D4\u05DB\u05D9 \u05DE\u05DE\u05D5\u05E7\u05D3.`);
    }
    const activeCats = ranked.filter(([, n]) => n > 0).length;
    if (activeCats >= 5) {
      insights.push(`\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u05DE\u05DB\u05E1\u05D4 <b>${activeCats} \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA</b> \u2014 \u05D9\u05D7\u05E1\u05D9\u05EA \u05DE\u05D2\u05D5\u05D5\u05DF. \u05D0\u05D1\u05DC ${getCategory(topId)?.heLabel} \u05E2\u05D3\u05D9\u05D9\u05DF \u05E9\u05D5\u05DC\u05D8\u05EA.`);
    } else if (activeCats <= 2 && activeCats > 0) {
      insights.push(`\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u05DE\u05E8\u05D5\u05DB\u05D6 \u05D1-${activeCats} \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA \u05D1\u05DC\u05D1\u05D3. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05D4\u05E6\u05E8 \u05D0\u05EA \u05D4\u05EA\u05DE\u05D5\u05E0\u05D4 \u05E2\u05DC\u05D9\u05DA.`);
    }
    return insights;
  }
  var init_explanations = __esm({
    "brain/explanations.js"() {
      init_categories();
    }
  });

  // brain/intent.js
  function buildIntent(categoryId, allTimeStats, weights) {
    const cat = getCategory(categoryId);
    const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1;
    const count = allTimeStats[categoryId] ?? 0;
    const pct = Math.round(count / total * 100);
    const weight = weights?.[categoryId] ?? 1;
    const type = resolveType(count, pct, weight);
    return {
      type,
      categoryId,
      heLabel: cat?.heLabel ?? categoryId,
      percentage: pct,
      weight,
      heText: buildText(type, cat?.heLabel ?? categoryId, pct, weight)
    };
  }
  function resolveType(count, pct, weight) {
    if (count === 0) return INTENT_TYPE.FIRST_TIME;
    if (weight >= 1.5) return INTENT_TYPE.EXPLICIT;
    if (pct >= 40) return INTENT_TYPE.DOMINANT;
    if (pct >= 15) return INTENT_TYPE.RECURRING;
    return INTENT_TYPE.TEST;
  }
  function buildText(type, label, pct, weight) {
    switch (type) {
      case INTENT_TYPE.FIRST_TIME:
        return `\u05D6\u05D5 \u05D4\u05E4\u05E2\u05DD \u05D4\u05E8\u05D0\u05E9\u05D5\u05E0\u05D4 \u05E9\u05D0\u05EA\u05D4 \u05E0\u05D7\u05E9\u05E3 \u05DC${label}. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05E0\u05E1\u05D4 \u05D0\u05D5\u05EA\u05DA.`;
      case INTENT_TYPE.EXPLICIT:
        return `\u05D0\u05EA\u05D4 \u05E8\u05D5\u05D0\u05D4 ${label} \u05DB\u05D9 \u05D4\u05E8\u05D0\u05D9\u05EA \u05E9\u05D6\u05D4 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF \u05D0\u05D5\u05EA\u05DA. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DC\u05DE\u05D3.`;
      case INTENT_TYPE.DOMINANT:
        return `${label} \u05E9\u05D5\u05DC\u05D8 \u05D1-${pct}% \u05DE\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA \u2014 \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05D1\u05D8\u05D5\u05D7 \u05E9\u05D6\u05D4 \u05DE\u05D4 \u05E9\u05D0\u05EA\u05D4 \u05E8\u05D5\u05E6\u05D4.`;
      case INTENT_TYPE.RECURRING:
        return `${label} \u05DE\u05D4\u05D5\u05D5\u05D4 ${pct}% \u05DE\u05D4\u05EA\u05D5\u05DB\u05DF \u05E9\u05DC\u05DA. \u05E0\u05D5\u05E9\u05D0 \u05E9\u05D7\u05D5\u05D6\u05E8, \u05D0\u05D1\u05DC \u05DC\u05D0 \u05E9\u05D5\u05DC\u05D8.`;
      case INTENT_TYPE.TEST:
      default:
        return `${label} \u05DE\u05D5\u05E4\u05D9\u05E2 \u05DC\u05E4\u05E2\u05DE\u05D9\u05DD (${pct}% \u05DE\u05D4\u05E4\u05D9\u05D3). \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05E2\u05D3\u05D9\u05D9\u05DF \u05D1\u05D5\u05D3\u05E7 \u05D0\u05DD \u05D6\u05D4 \u05DE\u05D3\u05D5\u05D9\u05E7 \u05E2\u05D1\u05D5\u05E8\u05DA.`;
    }
  }
  var INTENT_TYPE;
  var init_intent = __esm({
    "brain/intent.js"() {
      init_categories();
      INTENT_TYPE = {
        DOMINANT: "dominant",
        // > 40% מהפיד
        RECURRING: "recurring",
        // 15–40%
        FIRST_TIME: "first-time",
        // 0 פוסטים קודמים
        TEST: "test",
        // האלגוריתם מנסה את המשתמש
        EXPLICIT: "explicit"
        // המשתמש לחץ 👍 בעבר
      };
    }
  });

  // brain/signals.js
  function buildSignals(categoryId, allTimeStats, weights, sessionStats = {}) {
    const signals = [];
    const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1;
    const count = allTimeStats[categoryId] ?? 0;
    const pct = Math.round(count / total * 100);
    const weight = weights?.[categoryId] ?? 1;
    const sesCount = sessionStats[categoryId] ?? 0;
    const historyScore = Math.min(100, pct * 2);
    signals.push({
      label: "\u05E6\u05E4\u05D9\u05D9\u05D4 \u05E7\u05D5\u05D3\u05DE\u05EA",
      value: historyScore,
      type: historyScore > 50 ? "negative" : historyScore > 20 ? "neutral" : "positive"
    });
    const interestScore = Math.round((weight - 0.1) / 2.9 * 100);
    signals.push({
      label: "\u05E2\u05E0\u05D9\u05D9\u05DF \u05DE\u05E4\u05D5\u05E8\u05E9",
      value: Math.max(0, Math.min(100, interestScore)),
      type: weight >= 1.5 ? "positive" : weight <= 0.5 ? "negative" : "neutral"
    });
    const sessionScore = Math.min(100, sesCount * 12);
    signals.push({
      label: "\u05EA\u05D3\u05D9\u05E8\u05D5\u05EA \u05D4\u05D9\u05D5\u05DD",
      value: sessionScore,
      type: sessionScore > 60 ? "negative" : "neutral"
    });
    return signals;
  }
  var init_signals = __esm({
    "brain/signals.js"() {
    }
  });

  // brain/brain-api.js
  function createBrain(storageAdapter) {
    const state = createState(storageAdapter);
    return {
      // טען state שמור — לקרוא פעם אחת בהפעלה
      load() {
        return state.load();
      },
      // רשום פוסט חדש שנצפה — מחזיר את הקטגוריה
      observe(text) {
        const categoryId = classify(text);
        if (categoryId !== "uncategorized") state.observe(categoryId);
        return categoryId;
      },
      // הסבר קצר למה המשתמש רואה תוכן של קטגוריה זו
      explain(categoryId) {
        return explain(categoryId, state.getAllTimeStats());
      },
      // הסבר עמוק — סוג הכוונה + אחוז + טקסט מפורט
      intent(categoryId) {
        return buildIntent(categoryId, state.getAllTimeStats(), state.getWeights());
      },
      // 3 אותות מספריים לbadge הסבר ויזואלי
      signals(categoryId) {
        return buildSignals(categoryId, state.getAllTimeStats(), state.getWeights(), state.getSessionStats());
      },
      // ברכה לפי שעה
      greeting() {
        return greeting();
      },
      // תובנות שבועיות — מחרוזות לטאב "תובנות" בפופ-אפ
      weeklyInsights(historyStats) {
        return weeklyInsights(state.getAllTimeStats(), historyStats);
      },
      // כל הסטטיסטיקות — לפופ-אפ
      getStats() {
        return {
          session: state.getSessionStats(),
          allTime: state.getAllTimeStats(),
          weights: state.getWeights(),
          dismissed: state.getDismissed(),
          dismissedTotal: state.getDismissedTotal(),
          total: state.getSessionTotal(),
          categories: CATEGORIES,
          ids: CATEGORY_IDS
        };
      },
      // המשתמש הראה עניין חיובי בתוכן
      positive(categoryId) {
        state.positiveSignal(categoryId);
      },
      // המשתמש דילג מהר
      negative(categoryId) {
        state.negativeSignal(categoryId);
      },
      // פוסט הוסר בפועל ע"י מנוע הפעולות — לספירה בפופ-אפ
      recordDismiss(categoryId) {
        state.dismissSignal(categoryId);
      },
      // מחק את כל הנתונים
      reset() {
        return state.reset();
      },
      // כלי עזר לדיבוג — ניקוד הטקסט בלי לשמור
      debug: {
        score: scoreText,
        classify
      }
    };
  }
  var init_brain_api = __esm({
    "brain/brain-api.js"() {
      init_classifier();
      init_state();
      init_explanations();
      init_intent();
      init_signals();
      init_categories();
    }
  });

  // brain/adapters/chrome-adapter.js
  function createChromeAdapter() {
    return {
      get(key) {
        return new Promise((resolve) => {
          chrome.storage.local.get(key, (result) => resolve(result[key] ?? null));
        });
      },
      set(key, value) {
        return new Promise((resolve) => {
          chrome.storage.local.set({ [key]: value }, resolve);
        });
      }
    };
  }
  var init_chrome_adapter = __esm({
    "brain/adapters/chrome-adapter.js"() {
    }
  });

  // brain/questions.js
  function createQuestions() {
    let lastAskedAt = 0;
    const asked = /* @__PURE__ */ new Set();
    return {
      // האם הגיע הזמן לשאול על קטגוריה זו?
      shouldAsk(categoryId, sessionCount) {
        if (sessionCount < ASK_AFTER_COUNT) return false;
        if (asked.has(categoryId)) return false;
        if (Date.now() - lastAskedAt < ASK_COOLDOWN_MS) return false;
        return true;
      },
      // סמן ששאלנו
      markAsked(categoryId) {
        asked.add(categoryId);
        lastAskedAt = Date.now();
      },
      // בנה שאלה מוכנה להצגה
      build(categoryId) {
        const cat = getCategory(categoryId);
        if (!cat) return null;
        const label = cat.heLabel;
        return {
          text: `\u05D0\u05E0\u05D9 \u05E8\u05D5\u05D0\u05D4 \u05E9\u05D0\u05EA\u05D4 \u05E0\u05D7\u05E9\u05E3 \u05D4\u05E8\u05D1\u05D4 \u05DC${label}. \u05D4\u05D0\u05DD \u05D6\u05D4 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF \u05D0\u05D5\u05EA\u05DA? \u05DC\u05D7\u05E5 + \u05DB\u05DF / - \u05DC\u05D0`,
          categoryId,
          answers: {
            yes: `\u05EA\u05D5\u05D3\u05D4! \u05D0\u05E1\u05DE\u05DF \u05E9\u05D0\u05EA\u05D4 \u05D0\u05D5\u05D4\u05D1 ${label}.`,
            no: `\u05D4\u05D1\u05E0\u05EA\u05D9, \u05D0\u05E0\u05E1\u05D4 \u05DC\u05D6\u05D4\u05D5\u05EA \u05E4\u05D7\u05D5\u05EA ${label} \u05D1\u05E2\u05EA\u05D9\u05D3.`
          }
        };
      },
      // "למה אני רואה את זה?" — הסבר ידני על בקשה
      whyDoISeeThis(categoryId, allTimeStats) {
        const cat = getCategory(categoryId);
        if (!cat) return "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D6\u05D4\u05D5\u05EA \u05D0\u05EA \u05D4\u05E0\u05D5\u05E9\u05D0.";
        const label = cat.heLabel;
        const total = Object.values(allTimeStats).reduce((s, n) => s + n, 0) || 1;
        const pct = Math.round((allTimeStats[categoryId] ?? 0) / total * 100);
        if (pct === 0) return `\u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05E0\u05E1\u05D4 \u05DC\u05D4\u05E6\u05D9\u05D2 \u05DC\u05DA ${label} \u05DC\u05E8\u05D0\u05D5\u05EA \u05D0\u05DD \u05D6\u05D4 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF.`;
        if (pct >= 50) return `${pct}% \u05DE\u05D4\u05EA\u05D5\u05DB\u05DF \u05E9\u05DC\u05DA \u05D4\u05D5\u05D0 ${label}. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05DE\u05D0\u05DE\u05D9\u05DF \u05E9\u05D6\u05D4 \u05D4\u05E0\u05D5\u05E9\u05D0 \u05E9\u05DC\u05DA!`;
        if (pct >= 20) return `${label} \u05DE\u05D4\u05D5\u05D5\u05D4 ${pct}% \u05DE\u05D4\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA. \u05D0\u05EA\u05D4 \u05E0\u05D7\u05E9\u05E3 \u05DC\u05D6\u05D4 \u05DC\u05E2\u05D9\u05EA\u05D9\u05DD \u05E7\u05E8\u05D5\u05D1\u05D5\u05EA.`;
        return `${label} \u05DE\u05D5\u05E4\u05D9\u05E2 \u05D1-${pct}% \u05DE\u05D4\u05EA\u05D5\u05DB\u05DF \u05E9\u05DC\u05DA. \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05E2\u05D3\u05D9\u05D9\u05DF \u05DC\u05D5\u05DE\u05D3 \u05D0\u05EA \u05D4\u05D8\u05E2\u05DD \u05E9\u05DC\u05DA.`;
      }
    };
  }
  var init_questions = __esm({
    "brain/questions.js"() {
      init_categories();
      init_constants();
    }
  });

  // mascot/animations.js
  function playMood(mascot, mood = "idle") {
    const list = MOOD_ANIMATIONS[mood] ?? MOOD_ANIMATIONS.idle;
    const name = list[Math.floor(Math.random() * list.length)];
    mascot.animate(name);
  }
  var MOOD_ANIMATIONS;
  var init_animations = __esm({
    "mascot/animations.js"() {
      MOOD_ANIMATIONS = {
        greet: ["Wave", "Greeting"],
        think: ["Thinking", "LookDown"],
        excited: ["Congratulate", "Wave"],
        confused: ["LookLeft", "LookRight"],
        idle: ["IdleRopePile", "IdleFingerTap"]
      };
    }
  });

  // agent/dialogue.js
  function createDialogue(memory = null) {
    const turns = [];
    let lastUserTs = 0;
    return {
      // Add a user message and analyze its intent
      addUserTurn(text) {
        const intent = detectIntent(text);
        const turn = { role: "user", text, intent, ts: Date.now() };
        turns.push(turn);
        if (turns.length > MAX_TURNS) turns.shift();
        lastUserTs = Date.now();
        memory?.noteInteraction(text, intent);
        return intent;
      },
      // Add an agent response
      addAgentTurn(text) {
        turns.push({ role: "agent", text, intent: null, ts: Date.now() });
        if (turns.length > MAX_TURNS) turns.shift();
      },
      // Generate a contextual response based on the last user turn + history
      buildResponse(categoryId, brain) {
        const lastUser = [...turns].reverse().find((t) => t.role === "user");
        if (!lastUser) return null;
        const { intent } = lastUser;
        switch (intent) {
          case "explain":
            return brain.intent(categoryId).heText;
          case "stats": {
            const stats = brain.getStats();
            const total = stats.total ?? 0;
            return total === 0 ? "\u05E2\u05D5\u05D3 \u05DC\u05D0 \u05E6\u05D1\u05E8\u05EA \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD \u2014 \u05D4\u05DE\u05E9\u05DA \u05DC\u05D2\u05DC\u05D5\u05E9!" : `\u05E6\u05E4\u05D9\u05EA \u05D1-${total} \u05E4\u05D5\u05E1\u05D8\u05D9\u05DD. \u05D4\u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D4 \u05D4\u05DE\u05D5\u05D1\u05D9\u05DC\u05D4: ${getTopCategory(stats)}.`;
          }
          case "reset":
            return "\u05DE\u05D5\u05DB\u05DF \u05DC\u05D0\u05E4\u05E1 \u05D4\u05DB\u05DC? \u05DC\u05D7\u05E5 + \u05DC\u05D0\u05D9\u05E9\u05D5\u05E8, - \u05DC\u05D1\u05D9\u05D8\u05D5\u05DC.";
          case "greeting":
            return brain.greeting();
          case "question":
            return brain.explain(categoryId);
          case "positive":
          case "negative":
            return null;
          // handled by mascot-controller
          default:
            return brain.explain(categoryId);
        }
      },
      getHistory() {
        return [...turns];
      },
      getLastIntent() {
        return turns.filter((t) => t.role === "user").slice(-1)[0]?.intent ?? null;
      },
      getLastUserTs() {
        return lastUserTs;
      },
      clearHistory() {
        turns.length = 0;
      },
      // Context window summary for long-term memory consolidation
      getSummary() {
        const userTurns = turns.filter((t) => t.role === "user");
        const intents = [...new Set(userTurns.map((t) => t.intent).filter(Boolean))];
        return { turnCount: turns.length, intents, lastText: userTurns.slice(-1)[0]?.text ?? "" };
      }
    };
  }
  function detectIntent(text) {
    const lower = text.toLowerCase();
    for (const [intent, kws] of Object.entries(INTENT_KEYWORDS)) {
      if (kws.some((kw) => lower.includes(kw))) return intent;
    }
    return "general";
  }
  function getTopCategory(stats) {
    let best = null, bestN = 0;
    for (const [k, n] of Object.entries(stats.allTime ?? {})) {
      if (n > bestN) {
        bestN = n;
        best = k;
      }
    }
    return stats.categories?.[best]?.heLabel ?? best ?? "\u2014";
  }
  var MAX_TURNS, INTENT_KEYWORDS;
  var init_dialogue = __esm({
    "agent/dialogue.js"() {
      init_constants();
      MAX_TURNS = 10;
      INTENT_KEYWORDS = {
        question: ["\u05DC\u05DE\u05D4", "\u05DE\u05D4", "\u05D0\u05D9\u05DA", "\u05DE\u05EA\u05D9", "\u05DB\u05DE\u05D4", "why", "what", "how", "when"],
        positive: ["\u05DB\u05DF", "\u05D1\u05E1\u05D3\u05E8", "\u05DE\u05E1\u05DB\u05D9\u05DD", "yes", "ok", "great", "\u{1F44D}"],
        negative: ["\u05DC\u05D0", "\u05DC\u05D0 \u05E8\u05D5\u05E6\u05D4", "no", "stop", "\u05E0\u05D5\u05E8\u05D0\u05D9", "\u{1F44E}"],
        reset: ["\u05D0\u05E4\u05E1", "\u05D4\u05EA\u05D7\u05DC \u05DE\u05D7\u05D3\u05E9", "reset", "clear"],
        explain: ["\u05D4\u05E1\u05D1\u05E8", "\u05EA\u05E1\u05D1\u05D9\u05E8", "explain", "\u05DC\u05DE\u05D4 \u05D0\u05E0\u05D9 \u05E8\u05D5\u05D0\u05D4", "why do i see"],
        stats: ["\u05E1\u05D8\u05D8\u05D9\u05E1\u05D8\u05D9\u05E7\u05D5\u05EA", "\u05DB\u05DE\u05D4", "statistics", "stats", "how many"],
        greeting: ["\u05E9\u05DC\u05D5\u05DD", "\u05D4\u05D9\u05D9", "hello", "hi", "\u05D1\u05D5\u05E7\u05E8", "morning"]
      };
    }
  });

  // mascot/mascot-controller.js
  function createMascotController(mascot, brain, options = {}) {
    const questions = createQuestions();
    const dialogue = options.dialogue ?? createDialogue(options.memory ?? null);
    let lastSpokenAt = 0;
    let pendingQ = null;
    let pendingEl = null;
    let idleTimer = null;
    function canSpeak() {
      return Date.now() - lastSpokenAt > SPEAK_COOLDOWN_MS;
    }
    function speak(text, mood = MOOD.idle) {
      if (!canSpeak()) return false;
      lastSpokenAt = Date.now();
      playMood(mascot, mood);
      mascot.say(text);
      return true;
    }
    function startIdleLoop() {
      idleTimer = setInterval(() => {
        if (canSpeak()) playMood(mascot, MOOD.idle);
      }, IDLE_INTERVAL_MS);
    }
    function stopIdleLoop() {
      clearInterval(idleTimer);
      idleTimer = null;
    }
    return {
      // ── הפעלה ─────────────────────────────────────────────────
      async start() {
        await brain.load();
        startIdleLoop();
        const isNew = await new Promise(
          (resolve) => chrome.storage.local.get(ONBOARDING_KEY, (d) => resolve(!d[ONBOARDING_KEY]))
        );
        if (isNew) {
          chrome.storage.local.set({ [ONBOARDING_KEY]: true });
          setTimeout(() => {
            speak("\u05E9\u05DC\u05D5\u05DD! \u05D0\u05E0\u05D9 \u05D4\u05D0\u05DC\u05D2\u05D5\u05E8\u05D9\u05EA\u05DD \u05E9\u05D7\u05D6\u05E8 \u05D1\u05EA\u05E9\u05D5\u05D1\u05D4. \u05D0\u05E6\u05E4\u05D4 \u05D1\u05DE\u05D4 \u05E9\u05D0\u05EA\u05D4 \u05E8\u05D5\u05D0\u05D4 \u05D5\u05D0\u05E1\u05D1\u05D9\u05E8 \u05DC\u05DE\u05D4.", MOOD.greeting);
            setTimeout(() => speak("\u05E4\u05E9\u05D5\u05D8 \u05D2\u05DC\u05D5\u05DC \u05DB\u05E8\u05D2\u05D9\u05DC \u2014 \u05D0\u05E0\u05D9 \u05D0\u05DC\u05DE\u05D3 \u05DE\u05DE\u05DA \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA.", MOOD.explain), 6e3);
          }, 800);
        } else {
          setTimeout(() => speak(brain.greeting(), MOOD.greeting), 800);
        }
      },
      // ── פוסט חדש גולש ────────────────────────────────────────
      onPostSeen(text, el = null) {
        const catId = brain.observe(text);
        if (catId === "uncategorized") return catId;
        const { session, weights } = brain.getStats();
        const weight = weights?.[catId] ?? 1;
        const autoDismissEnabled = options.settings?.autoDismiss ?? true;
        if (autoDismissEnabled && weight < AUTO_DISMISS_THRESHOLD && el && options.onDismiss) {
          options.onDismiss(el).then((result) => {
            if (result.ok) {
              brain.recordDismiss(catId);
              if (canSpeak()) speak("\u05D4\u05E1\u05E8\u05EA\u05D9 \u05E4\u05D5\u05E1\u05D8 \u05DC\u05D0 \u05E8\u05DC\u05D5\u05D5\u05E0\u05D8\u05D9 \u05D1\u05E9\u05DE\u05DA \u{1F4CE}", MOOD.positive);
            }
          });
          return catId;
        }
        const count = session[catId] ?? 0;
        if (questions.shouldAsk(catId, count)) {
          const q = questions.build(catId);
          if (q && canSpeak()) {
            pendingQ = q;
            pendingEl = el;
            lastSpokenAt = Date.now();
            questions.markAsked(catId);
            playMood(mascot, MOOD.explain);
            mascot.say(q.text);
            options.onQuestion?.(catId);
          }
        } else if (canSpeak()) {
          const intent = brain.intent(catId);
          speak(intent.heText, MOOD.explain);
        }
        return catId;
      },
      // ── משוב מהמשתמש ─────────────────────────────────────────
      onPositive() {
        if (!pendingQ) return;
        brain.positive(pendingQ.categoryId);
        speak(pendingQ.answers.yes, MOOD.positive);
        options.onAnswered?.();
        pendingQ = null;
        pendingEl = null;
      },
      onNegative() {
        if (!pendingQ) return;
        brain.negative(pendingQ.categoryId);
        speak(pendingQ.answers.no, MOOD.negative);
        options.onAnswered?.();
        const elToDismiss = pendingEl;
        const dismissCatId = pendingQ.categoryId;
        pendingQ = null;
        pendingEl = null;
        if (options.onDismiss && elToDismiss) {
          options.onDismiss(elToDismiss).then((result) => {
            if (result.ok) {
              brain.recordDismiss(dismissCatId);
              setTimeout(() => {
                if (canSpeak()) speak("\u05D4\u05E1\u05E8\u05EA\u05D9 \u05D0\u05EA \u05D4\u05E4\u05D5\u05E1\u05D8 \u05D4\u05D6\u05D4! \u{1F4CE}", MOOD.positive);
              }, 2500);
            }
          });
        }
      },
      // ── "למה אני רואה את זה?" — לחיצה ידנית ─────────────────
      onWhyClick(categoryId) {
        const intent = brain.intent(categoryId);
        speak(intent.heText, MOOD.explain);
      },
      // ── שיחה טקסטואלית (dialogue layer) ─────────────────────
      onUserText(text) {
        const intent = dialogue.addUserTurn(text);
        const catId = brain.observe(text);
        const response = dialogue.buildResponse(catId === "uncategorized" ? null : catId, brain);
        if (response) {
          dialogue.addAgentTurn(response);
          speak(response, MOOD.explain);
        }
        return intent;
      },
      // ── ניקוי (לשימוש בסביבת test) ───────────────────────────
      destroy() {
        stopIdleLoop();
      },
      getStats() {
        return brain.getStats();
      }
    };
  }
  var MOOD, IDLE_INTERVAL_MS, AUTO_DISMISS_THRESHOLD;
  var init_mascot_controller = __esm({
    "mascot/mascot-controller.js"() {
      init_questions();
      init_constants();
      init_animations();
      init_dialogue();
      MOOD = {
        greeting: "greet",
        explain: "think",
        positive: "excited",
        negative: "confused",
        idle: "idle"
      };
      IDLE_INTERVAL_MS = 15e3;
      AUTO_DISMISS_THRESHOLD = 0.4;
    }
  });

  // extension/content/site-adapters.js
  function getSelectorForCurrentSite() {
    const hostname = location.hostname.replace("www.", "");
    return SITE_SELECTORS[hostname] ?? null;
  }
  var SITE_SELECTORS;
  var init_site_adapters = __esm({
    "extension/content/site-adapters.js"() {
      SITE_SELECTORS = {
        "twitter.com": "[data-testid='tweetText']",
        "x.com": "[data-testid='tweetText']",
        "facebook.com": "[data-ad-preview='message'], [dir='auto']",
        "instagram.com": "._a9zs span, .C4VMK span",
        "youtube.com": "#video-title, #description-text",
        "tiktok.com": "[data-e2e='browse-video-desc']",
        "linkedin.com": ".feed-shared-update-v2__description span, .update-components-text span",
        "reddit.com": "[data-testid='post-content'] h3, .Post h3",
        "threads.net": "div[dir='auto'] span",
        "threads.com": "div[dir='auto'] span",
        "localhost": "[data-testid='tweetText']"
      };
    }
  });

  // extension/content/feed-observer.js
  function startFeedObserver(selector, onElement) {
    if (!selector) return;
    const seen = /* @__PURE__ */ new WeakSet();
    function processEl(el) {
      if (seen.has(el)) return;
      seen.add(el);
      const text = (el.innerText || el.textContent || "").trim();
      if (text.length >= MIN_TEXT_LENGTH2) onElement(el, text);
    }
    function scanVisible() {
      document.querySelectorAll(selector).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top >= 0 && r.top < window.innerHeight) processEl(el);
      });
    }
    scanVisible();
    new MutationObserver(scanVisible).observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", () => setTimeout(scanVisible, 300), { passive: true });
  }
  var MIN_TEXT_LENGTH2;
  var init_feed_observer = __esm({
    "extension/content/feed-observer.js"() {
      MIN_TEXT_LENGTH2 = 15;
    }
  });

  // extension/content/action-engine.js
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  function findText(candidates, patterns) {
    return [...document.querySelectorAll(candidates)].find((el) => patterns.some((p) => p.test(el.textContent)));
  }
  async function dismissPost(el) {
    const host = location.hostname.replace("www.", "");
    const platform = PLATFORMS[host];
    if (!platform || !el) return { ok: false, reason: "unsupported" };
    try {
      const container = platform.container(el);
      if (!container) return { ok: false, reason: "container-not-found" };
      platform.reveal(container);
      await sleep(DELAY.reveal);
      const btn = platform.menuBtn(container);
      if (!btn) return { ok: false, reason: "menu-btn-not-found" };
      btn.click();
      await sleep(DELAY.menu);
      const opt = platform.option();
      if (!opt) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        return { ok: false, reason: "option-not-found" };
      }
      opt.click();
      return { ok: true, host };
    } catch (err) {
      return { ok: false, reason: err.message };
    }
  }
  function isActionSupported() {
    const host = location.hostname.replace("www.", "");
    return host in PLATFORMS;
  }
  var DELAY, PLATFORMS;
  var init_action_engine = __esm({
    "extension/content/action-engine.js"() {
      DELAY = { reveal: 250, menu: 450, option: 350 };
      PLATFORMS = {
        "youtube.com": {
          container: (el) => el.closest("ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer"),
          reveal: (c) => {
            c.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
            c.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
          },
          menuBtn: (c) => c.querySelector("ytd-menu-renderer button#button, ytd-menu-renderer yt-icon-button#button"),
          option: () => findText(
            "ytd-menu-service-item-renderer, tp-yt-paper-item",
            [/not interested/i, /לא מעוניין/i]
          )
        },
        "x.com": {
          container: (el) => el.closest('article[data-testid="tweet"]'),
          reveal: () => {
          },
          menuBtn: (c) => c.querySelector('[data-testid="caret"]'),
          option: () => findText(
            '[data-testid="Dropdown"] [role="menuitem"], [role="menuitem"]',
            [/not interested/i, /לא מעוניין/i, /this post/i]
          )
        },
        "facebook.com": {
          container: (el) => el.closest('div[role="article"]') || el.closest('[data-pagelet^="FeedUnit"]'),
          reveal: () => {
          },
          menuBtn: (c) => c.querySelector('[aria-label="More options"], [aria-label="\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05D5\u05EA"]'),
          option: () => findText(
            '[role="menuitem"], [role="menu"] [tabindex="0"]',
            [/hide post/i, /הסתר פוסט/i, /not interested/i, /לא מעוניין/i, /snooze/i]
          )
        },
        "instagram.com": {
          container: (el) => el.closest("article, ._aatb") || el.parentElement?.closest('[role="presentation"]'),
          reveal: () => {
          },
          menuBtn: (c) => c.querySelector('[aria-label="More options"]') || [...c.querySelectorAll("button")].findLast((b) => b.querySelector("svg")),
          option: () => findText(
            '[role="dialog"] button, [role="menu"] button',
            [/not interested/i, /לא מעוניין/i, /don.t suggest/i]
          )
        },
        "tiktok.com": {
          container: (el) => el.closest('[data-e2e="recommend-list-item-container"]') || el.closest('div[class*="DivItemContainer"]') || el.closest("article"),
          reveal: (c) => {
            c.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
            c.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
          },
          menuBtn: (c) => {
            const direct = c.querySelector('[data-e2e="not-interested"]') || c.querySelector('[data-e2e="video-more"]');
            if (direct) return direct;
            return [...c.querySelectorAll("button")].find(
              (b) => /more|options/i.test(b.getAttribute("data-e2e") ?? "") || /more|options/i.test(b.getAttribute("aria-label") ?? "")
            );
          },
          option: () => findText(
            '[role="menuitem"], [data-e2e="not-interested-text"], [class*="DivMenuItem"] span',
            [/not interested/i, /לא מעוניין/i, /don.t recommend/i, /uninterested/i]
          )
        }
      };
      PLATFORMS["twitter.com"] = PLATFORMS["x.com"];
      PLATFORMS["linkedin.com"] = {
        container: (el) => el.closest(".feed-shared-update-v2, .occludable-update, [data-urn]") || el.closest("li.artdeco-list__item"),
        reveal: () => {
        },
        menuBtn: (c) => c.querySelector('[aria-label="Open control menu"], [aria-label="\u05E4\u05EA\u05D7 \u05EA\u05E4\u05E8\u05D9\u05D8 \u05D1\u05E7\u05E8\u05D4"], button.feed-shared-control-menu__trigger') || [...c.querySelectorAll("button")].find(
          (b) => /control menu|more options/i.test(b.getAttribute("aria-label") ?? "")
        ),
        option: () => findText(
          '[role="listbox"] [role="option"], .artdeco-dropdown__content [role="option"], [role="menu"] [role="menuitem"]',
          [/not interested/i, /לא מעוניין/i, /unfollow/i, /hide/i, /report/i]
        )
      };
      PLATFORMS["reddit.com"] = {
        container: (el) => el.closest('shreddit-post, [data-testid="post-container"], .Post, article'),
        reveal: () => {
        },
        menuBtn: (c) => c.querySelector('[aria-label="More options"], button[aria-haspopup="menu"]') || [...c.querySelectorAll("button")].find(
          (b) => /more options|overflow/i.test(b.getAttribute("aria-label") ?? "")
        ),
        option: () => findText(
          '[data-testid="post-overflow-menu"] button, [role="menu"] [role="menuitem"], [role="menuitem"]',
          [/not interested/i, /hide/i, /block/i]
        )
      };
      PLATFORMS["threads.net"] = {
        container: (el) => el.closest('article, [role="article"], div[tabindex="-1"][style*="padding"]'),
        reveal: () => {
        },
        menuBtn: (c) => [...c.querySelectorAll('button, [role="button"]')].find(
          (b) => /more|options/i.test(b.getAttribute("aria-label") ?? "") || b.querySelector('svg[aria-label*="More"], svg[aria-label*="more"]')
        ),
        option: () => findText(
          '[role="dialog"] button, [role="menu"] button, [role="menuitem"]',
          [/not interested/i, /hide/i, /mute/i, /block/i, /unfollow/i]
        )
      };
      PLATFORMS["threads.com"] = PLATFORMS["threads.net"];
    }
  });

  // extension/content/feedback-ui.js
  function injectStyles() {
    if (styleEl || document.getElementById("tshuva-styles")) return;
    styleEl = document.createElement("style");
    styleEl.id = "tshuva-styles";
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
  }
  function createFeedbackUI(onPositive, onNegative) {
    function show(categoryLabel) {
      hide();
      injectStyles();
      barEl = document.createElement("div");
      barEl.id = "tshuva-feedback";
      barEl.innerHTML = `
      <div class="tshuva-label">\u{1F914} \u05DE\u05D4 \u05D3\u05E2\u05EA\u05DA \u05E2\u05DC \u05EA\u05D5\u05DB\u05DF ${categoryLabel}?</div>
      <div class="tshuva-btns">
        <button class="tshuva-btn tshuva-no">\u{1F44E} \u05DC\u05D0 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF</button>
        <button class="tshuva-btn tshuva-yes">\u{1F44D} \u05DB\u05DF, \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF</button>
      </div>
    `;
      barEl.querySelector(".tshuva-yes").onclick = () => {
        onPositive();
        hide();
      };
      barEl.querySelector(".tshuva-no").onclick = () => {
        onNegative();
        hide();
      };
      document.body.appendChild(barEl);
      autoHide = setTimeout(hide, 12e3);
    }
    function hide() {
      clearTimeout(autoHide);
      barEl?.remove();
      barEl = null;
      autoHide = null;
    }
    return { show, hide };
  }
  var STYLES, styleEl, barEl, autoHide;
  var init_feedback_ui = __esm({
    "extension/content/feedback-ui.js"() {
      STYLES = `
  #tshuva-feedback {
    position: fixed;
    bottom: 160px;
    right: 24px;
    z-index: 2147483646;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    font-family: 'Segoe UI', Arial, sans-serif;
    animation: tshuva-fadein 0.3s ease;
  }
  @keyframes tshuva-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tshuva-label {
    font-size: 11px;
    color: #a0a0b0;
    background: #1a1a2e;
    padding: 4px 10px;
    border-radius: 99px;
    direction: rtl;
  }
  .tshuva-btns {
    display: flex;
    gap: 8px;
  }
  .tshuva-btn {
    padding: 8px 18px;
    border: none;
    border-radius: 99px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, opacity 0.15s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    direction: rtl;
  }
  .tshuva-btn:hover { transform: scale(1.08); }
  .tshuva-yes { background: #059669; color: white; }
  .tshuva-no  { background: #dc2626; color: white; }
`;
      styleEl = null;
      barEl = null;
      autoHide = null;
    }
  });

  // extension/content/dialogue-ui.js
  function createDialogueUI(onSend) {
    let container = null;
    let styleEl2 = null;
    let autoHide2 = null;
    function injectStyles3() {
      if (document.getElementById("tshuva-chat-style")) return;
      styleEl2 = document.createElement("style");
      styleEl2.id = "tshuva-chat-style";
      styleEl2.textContent = STYLES2;
      document.head.appendChild(styleEl2);
    }
    function show() {
      hide();
      injectStyles3();
      container = document.createElement("div");
      container.id = "tshuva-chat";
      container.innerHTML = `
      <button class="tshuva-chat-btn" id="tshuva-chat-close" title="\u05E1\u05D2\u05D5\u05E8">\u2715</button>
      <input id="tshuva-chat-input" type="text" placeholder="\u05E9\u05D0\u05DC \u05D0\u05EA \u05E7\u05DC\u05D9\u05E4\u05D9..." maxlength="200" autocomplete="off" />
      <button class="tshuva-chat-btn" id="tshuva-chat-send" title="\u05E9\u05DC\u05D7">\u27A4</button>
    `;
      document.body.appendChild(container);
      const input = container.querySelector("#tshuva-chat-input");
      const sendBtn = container.querySelector("#tshuva-chat-send");
      const closeBtn = container.querySelector("#tshuva-chat-close");
      setTimeout(() => input.focus(), 50);
      function submit() {
        const text = input.value.trim();
        if (!text) return;
        onSend(text);
        input.value = "";
        resetAutoHide();
      }
      sendBtn.onclick = submit;
      closeBtn.onclick = hide;
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
        if (e.key === "Escape") hide();
      });
      input.addEventListener("input", resetAutoHide);
      resetAutoHide();
    }
    function resetAutoHide() {
      clearTimeout(autoHide2);
      autoHide2 = setTimeout(hide, 3e4);
    }
    function hide() {
      clearTimeout(autoHide2);
      container?.remove();
      container = null;
    }
    function toggle() {
      if (container) hide();
      else show();
    }
    return { show, hide, toggle };
  }
  var STYLES2;
  var init_dialogue_ui = __esm({
    "extension/content/dialogue-ui.js"() {
      STYLES2 = `
  #tshuva-chat {
    position: fixed;
    bottom: 165px;
    right: 20px;
    z-index: 2147483646;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    gap: 6px;
    direction: rtl;
    animation: tshuva-chat-in 0.2s ease;
  }
  @keyframes tshuva-chat-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  #tshuva-chat-input {
    background: #1a1a2e;
    border: 1.5px solid #4c4c8f;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    color: #e8e8ff;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    outline: none;
    padding: 8px 14px;
    transition: border-color 0.2s;
    width: 190px;
  }
  #tshuva-chat-input:focus { border-color: #7c7cff; }
  #tshuva-chat-input::placeholder { color: #5a5a8a; }
  .tshuva-chat-btn {
    background: #3d3d7a;
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    font-size: 15px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    transition: background 0.15s;
    width: 34px;
  }
  .tshuva-chat-btn:hover { background: #5c5caa; }
`;
    }
  });

  // extension/content/youtube-innertube.js
  function extractFromRenderer(r) {
    const texts = [];
    const content = r.content ?? r;
    const title = content.title?.runs?.map((x) => x.text).join("") ?? content.headline?.runs?.map((x) => x.text).join("") ?? "";
    const desc = content.descriptionSnippet?.runs?.map((x) => x.text).join("") ?? "";
    if (title.length > 4) texts.push(title);
    if (desc.length > 4) texts.push(desc);
    return texts;
  }
  function extractTexts(root) {
    const results = [];
    const queue = [{ obj: root, depth: 0 }];
    while (queue.length > 0 && results.length < 200) {
      const { obj, depth } = queue.shift();
      if (!obj || typeof obj !== "object" || depth > 12) continue;
      if (Array.isArray(obj)) {
        for (const item of obj) queue.push({ obj: item, depth: depth + 1 });
        continue;
      }
      for (const [key, val] of Object.entries(obj)) {
        if (VIDEO_RENDERER_KEYS.has(key)) {
          results.push(...extractFromRenderer(val));
        } else if (val && typeof val === "object") {
          queue.push({ obj: val, depth: depth + 1 });
        }
      }
    }
    return results;
  }
  function startInnerTubeIntercept(onText) {
    if (location.hostname.replace("www.", "") !== "youtube.com") return;
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      const url = typeof args[0] === "string" ? args[0] : args[0] instanceof Request ? args[0].url : "";
      if (url.includes("/youtubei/v1/")) {
        response.clone().json().then((data) => {
          const texts = extractTexts(data);
          texts.forEach((t) => onText(t));
        }).catch(() => {
        });
      }
      return response;
    };
  }
  var VIDEO_RENDERER_KEYS;
  var init_youtube_innertube = __esm({
    "extension/content/youtube-innertube.js"() {
      VIDEO_RENDERER_KEYS = /* @__PURE__ */ new Set([
        "videoRenderer",
        "compactVideoRenderer",
        "gridVideoRenderer",
        "richItemRenderer",
        "reelItemRenderer",
        "playlistVideoRenderer",
        "movieRenderer",
        "radioRenderer"
      ]);
    }
  });

  // extension/content/post-badge.js
  function injectStyles2() {
    if (styleInjected || document.getElementById("tshuva-badge-styles")) return;
    const s = document.createElement("style");
    s.id = "tshuva-badge-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
    styleInjected = true;
  }
  function injectPostBadge(postEl, categoryId, categoryLabel, categoryColor, signals, onDismiss) {
    if (!postEl) return null;
    if (postEl.querySelector(".tshuva-badge")) return null;
    injectStyles2();
    const badge = document.createElement("div");
    badge.className = "tshuva-badge";
    badge.dataset.tshuvaCategory = categoryId;
    const signalHtml = signals.map((sig) => {
      const cls = sig.type === "positive" ? "pos" : sig.type === "negative" ? "neg" : "neu";
      return `
      <span class="tshuva-badge-signal">
        <span class="tshuva-badge-signal-bar">
          <span class="tshuva-badge-signal-fill ${cls}" style="width:${sig.value}%"></span>
        </span>
        <span class="tshuva-badge-pct ${cls}">${sig.value}%</span>
        ${sig.label}
      </span>
    `;
    }).join(`<span class="tshuva-badge-sep">\xB7</span>`);
    badge.innerHTML = `
    <span class="tshuva-badge-icon" style="color:${categoryColor}">\u{1F4CE}</span>
    <span class="tshuva-badge-cat" style="color:${categoryColor}">${categoryLabel}</span>
    <span class="tshuva-badge-sep">|</span>
    ${signalHtml}
    <button class="tshuva-badge-dismiss" title="\u05D4\u05E1\u05EA\u05E8 \u05E4\u05D5\u05E1\u05D8 \u05D6\u05D4">\u2715</button>
  `;
    badge.querySelector(".tshuva-badge-dismiss").addEventListener("click", (e) => {
      e.stopPropagation();
      badge.style.opacity = "0";
      badge.style.transform = "scale(0.9)";
      badge.style.transition = "all 0.2s ease";
      setTimeout(() => badge.remove(), 200);
      onDismiss?.();
    });
    postEl.insertAdjacentElement("afterend", badge);
    return badge;
  }
  var CSS, styleInjected;
  var init_post_badge = __esm({
    "extension/content/post-badge.js"() {
      CSS = `
  .tshuva-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 6px 0 2px;
    padding: 5px 10px 5px 8px;
    background: rgba(10,10,20,0.88);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11.5px;
    color: #d0d0e0;
    direction: rtl;
    cursor: default;
    user-select: none;
    backdrop-filter: blur(4px);
    max-width: 420px;
    flex-wrap: wrap;
    position: relative;
    z-index: 9999;
    animation: tshuva-badge-in 0.25s ease;
  }
  @keyframes tshuva-badge-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .tshuva-badge-icon {
    font-size: 13px;
    flex-shrink: 0;
  }
  .tshuva-badge-cat {
    font-weight: 700;
    font-size: 12px;
  }
  .tshuva-badge-sep {
    color: rgba(255,255,255,0.25);
    font-size: 10px;
  }
  .tshuva-badge-signal {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10.5px;
    color: #9090aa;
    white-space: nowrap;
  }
  .tshuva-badge-signal-bar {
    display: inline-block;
    width: 28px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.12);
    vertical-align: middle;
    overflow: hidden;
  }
  .tshuva-badge-signal-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.3s ease;
  }
  .tshuva-badge-signal-fill.pos  { background: #22c55e; }
  .tshuva-badge-signal-fill.neu  { background: #f59e0b; }
  .tshuva-badge-signal-fill.neg  { background: #ef4444; }
  .tshuva-badge-pct {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .tshuva-badge-pct.pos { color: #22c55e; }
  .tshuva-badge-pct.neu { color: #f59e0b; }
  .tshuva-badge-pct.neg { color: #ef4444; }
  .tshuva-badge-dismiss {
    margin-right: auto;
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    font-size: 13px;
    padding: 0 2px;
    line-height: 1;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .tshuva-badge-dismiss:hover { color: #ef4444; }
`;
      styleInjected = false;
    }
  });

  // extension/content/bundle-entry.js
  var require_bundle_entry = __commonJS({
    "extension/content/bundle-entry.js"() {
      init_svg_mascot();
      init_brain_api();
      init_chrome_adapter();
      init_mascot_controller();
      init_site_adapters();
      init_feed_observer();
      init_action_engine();
      init_feedback_ui();
      init_dialogue_ui();
      init_youtube_innertube();
      init_post_badge();
      init_categories();
      init_constants();
      (async () => {
        const svgMascot = createSVGMascot();
        svgMascot.init();
        const clippyEl = svgMascot._el;
        const mascot = {
          say: (text) => svgMascot.say(text),
          animate: (name) => svgMascot.animate(name ?? ""),
          show: () => svgMascot.show(),
          hide: () => svgMascot.hide(),
          onClick: (cb) => svgMascot.onClick(cb)
        };
        const savedSettings = await new Promise((r) => chrome.storage.local.get(SETTINGS_KEY, r));
        const settingsRef = { autoDismiss: savedSettings[SETTINGS_KEY]?.autoDismiss ?? true };
        chrome.runtime.onMessage.addListener((msg) => {
          if (msg.type === MSG.SETTINGS_CHANGED) settingsRef.autoDismiss = msg.autoDismiss;
        });
        const brain = createBrain(createChromeAdapter());
        let controller;
        const feedbackUI = createFeedbackUI(
          () => controller?.onPositive(),
          () => controller?.onNegative()
        );
        controller = createMascotController(mascot, brain, {
          onDismiss: isActionSupported() ? dismissPost : null,
          settings: settingsRef,
          onQuestion: (catId) => feedbackUI.show(CATEGORIES[catId]?.heLabel ?? catId),
          onAnswered: () => feedbackUI.hide()
        });
        await controller.start();
        const dialogueUI = createDialogueUI((text) => {
          controller.onUserText(text);
        });
        svgMascot.onClick(() => dialogueUI.toggle());
        const selector = getSelectorForCurrentSite();
        if (selector) {
          startFeedObserver(selector, (el, text) => {
            const catId = controller.onPostSeen(text, el);
            if (catId && catId !== "uncategorized" && el) {
              const cat = CATEGORIES[catId];
              const signals = brain.signals(catId);
              injectPostBadge(
                el,
                catId,
                cat?.heLabel ?? catId,
                cat?.color ?? "#ff9a1f",
                signals,
                async () => {
                  brain.negative(catId);
                  const label = cat?.heLabel ?? catId;
                  const result = dismissPost ? await dismissPost(el) : { ok: false, reason: "unsupported" };
                  if (result.ok) {
                    const w = brain.getStats().weights?.[catId] ?? 1;
                    const replies = [
                      `\u05D4\u05D1\u05E0\u05EA\u05D9! \u05DE\u05E4\u05D7\u05D9\u05EA ${label} \u05D1\u05E4\u05D9\u05D3 \u05E9\u05DC\u05DA.`,
                      `\u05E7\u05D9\u05D1\u05DC\u05EA\u05D9 \u2014 \u05E4\u05D7\u05D5\u05EA ${label} \u05DE\u05E2\u05DB\u05E9\u05D9\u05D5.`,
                      `\u05E8\u05E9\u05DE\u05EA\u05D9. ${label} \u05DC\u05D0 \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF \u05D0\u05D5\u05EA\u05DA \u05E2\u05DB\u05E9\u05D9\u05D5.`,
                      w < 0.5 ? `\u05E9\u05D5\u05D1 ${label}? \u05DB\u05D1\u05E8 \u05DE\u05E1\u05D9\u05E8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA.` : `\u05E4\u05D7\u05D5\u05EA ${label} \u2014 \u05E0\u05DC\u05DE\u05D3.`
                    ];
                    mascot.say(replies[Math.floor(Math.random() * replies.length)]);
                  } else {
                    console.debug(`[\u05EA\u05E9\u05D5\u05D1\u05D4] dismiss failed on ${location.hostname}: ${result.reason}`);
                    mascot.say(`\u05E8\u05E9\u05DE\u05EA\u05D9 \u05E9\u05E4\u05D7\u05D5\u05EA ${label} \u05DE\u05E2\u05E0\u05D9\u05D9\u05DF \u05D0\u05D5\u05EA\u05DA \u2014 \u05D2\u05DD \u05D0\u05DD \u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05EA\u05D9 \u05DC\u05D4\u05E1\u05EA\u05D9\u05E8 \u05D0\u05EA \u05D4\u05E4\u05D5\u05E1\u05D8 \u05D0\u05D5\u05D8\u05D5\u05DE\u05D8\u05D9\u05EA \u05DB\u05D0\u05DF.`);
                  }
                  mascot.animate();
                }
              );
            }
          });
        }
        startInnerTubeIntercept((text) => controller.onPostSeen(text, null));
        document.addEventListener("keydown", (e) => {
          if (e.key === "+" || e.key === "=") controller.onPositive();
          else if (e.key === "-") controller.onNegative();
        });
      })();
    }
  });
  require_bundle_entry();
})();
