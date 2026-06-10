// ============================================================
// Teshuva Algorithm — Content Script Bundle Entry
// Clippy mascot + brain + content detection
// ============================================================

import { initAgent } from 'clippyjs'
import ClippyAgent from 'clippyjs/agents/clippy'

// ── Categories ──────────────────────────────────────────────
const CATEGORIES = {
  politics:      { heLabel: "פוליטיקה",   color: "#EF4444", keywords: { he: ["בחירות","כנסת","ממשלה","שר","ראש ממשלה","אופוזיציה","קואליציה","מפלגה","ביבי","גנץ","לפיד"], en: ["election","government","congress","senate","president","minister","vote","policy","democrat","republican","parliament"] } },
  sports:        { heLabel: "ספורט",       color: "#3B82F6", keywords: { he: ["כדורגל","כדורסל","ליגה","גול","משחק","שחקן","קבוצה","אליפות","מכבי","הפועל"], en: ["football","basketball","soccer","goal","match","game","player","team","championship","nba","fifa","score","league"] } },
  entertainment: { heLabel: "בידור",        color: "#EC4899", keywords: { he: ["סרט","מוזיקה","שיר","זמר","שחקן","תוכנית","בידור","ריאליטי","סדרה"], en: ["movie","music","song","singer","actor","show","film","celebrity","tv","series","netflix","youtube","tiktok","viral"] } },
  technology:    { heLabel: "טכנולוגיה",   color: "#8B5CF6", keywords: { he: ["בינה מלאכותית","AI","סטארטאפ","אפליקציה","תוכנה","קוד","פיתוח","גוגל","אפל"], en: ["ai","artificial intelligence","software","startup","app","coding","programming","tech","google","apple","amazon","meta","openai","chatgpt"] } },
  news:          { heLabel: "חדשות",        color: "#F97316", keywords: { he: ["פצצה","מלחמה","שריפה","רעידת אדמה","חדשות","עדכון","פיגוע","תאונה","מבצע"], en: ["breaking","news","update","war","attack","disaster","earthquake","fire","crisis","alert","urgent","report"] } },
  health:        { heLabel: "בריאות",       color: "#10B981", keywords: { he: ["בריאות","תרופה","רופא","מחלה","פיטנס","דיאטה","תזונה","ויטמין"], en: ["health","medicine","doctor","disease","fitness","diet","nutrition","mental health","therapy","wellness","vaccine"] } },
  economy:       { heLabel: "כלכלה",        color: "#F59E0B", keywords: { he: ["כלכלה","בורסה","מניות","דולר","שקל","אינפלציה","ריבית","השקעה","נדלן","משכנתא"], en: ["economy","stocks","market","dollar","inflation","investment","bitcoin","crypto","finance","bank","mortgage"] } },
  science:       { heLabel: "מדע",          color: "#06B6D4", keywords: { he: ["מדע","חלל","פיזיקה","כימיה","ביולוגיה","מחקר","גילוי","נאסא","כוכב"], en: ["science","space","physics","chemistry","biology","research","discovery","nasa","star","planet","evolution"] } },
  religion:      { heLabel: "דת ומסורת",   color: "#A78BFA", keywords: { he: ["תורה","שבת","חג","תפילה","רב","ישיבה","הלכה","כשרות","פסח","ראש השנה"], en: ["torah","shabbat","jewish","prayer","rabbi","religion","faith","church","bible","god","holy"] } },
};

// ── Classifier ───────────────────────────────────────────────
function classify(text) {
  if (!text || text.trim().length < 10) return "uncategorized";
  const lower = text.toLowerCase();
  const scores = {};
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    scores[id] = 0;
    for (const kw of [...cat.keywords.he, ...cat.keywords.en])
      if (lower.includes(kw.toLowerCase())) scores[id]++;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return (best && best[1] > 0) ? best[0] : "uncategorized";
}

// ── Brain (in-memory + chrome.storage) ───────────────────────
const session = {};
const allTime  = {};
for (const k of Object.keys(CATEGORIES)) { session[k] = 0; allTime[k] = 0; }

function observe(text) {
  const cat = classify(text);
  session[cat]  = (session[cat] || 0) + 1;
  allTime[cat]  = (allTime[cat] || 0) + 1;
  chrome.storage.local.get('allTime', d => {
    const saved = d.allTime || {};
    saved[cat]  = (saved[cat] || 0) + 1;
    chrome.storage.local.set({ allTime: saved });
  });
  return cat;
}

function explain(catId) {
  const cat   = CATEGORIES[catId];
  const label = cat?.heLabel || catId;
  const total = Object.values(allTime).reduce((a, b) => a + b, 0) || 1;
  const pct   = Math.round((allTime[catId] || 0) / total * 100);
  if (pct === 0) return `נראה שזו פעם הראשונה שאתה רואה ${label}!`;
  return `אתה רואה ${label} כי ${pct}% מהתוכן שלך הוא בנושא הזה.`;
}

// ── Site selectors ───────────────────────────────────────────
const SITE_SELECTORS = {
  "twitter.com":  "[data-testid='tweetText']",
  "x.com":        "[data-testid='tweetText']",
  "facebook.com": "[data-ad-preview='message'], [dir='auto']",
  "instagram.com":"._a9zs span, .C4VMK span",
  "youtube.com":  "#video-title, #description-text",
  "tiktok.com":   "[data-e2e='browse-video-desc']",
  "localhost":    "[data-testid='tweetText']",
};

// ── Main ─────────────────────────────────────────────────────
(async () => {
  // Load persisted allTime
  await new Promise(resolve => {
    chrome.storage.local.get('allTime', d => {
      if (d.allTime) Object.assign(allTime, d.allTime);
      resolve();
    });
  });

  // Init Clippy
  const agent = await initAgent(ClippyAgent);
  agent.show();

  // Reposition to bottom-right corner
  const el = document.querySelector('.clippy-container') || document.querySelector('.clippy');
  if (el) {
    el.style.cssText += ';position:fixed!important;bottom:30px!important;right:30px!important;top:auto!important;left:auto!important;z-index:2147483647!important;';
  }

  await new Promise(r => setTimeout(r, 800));
  agent.speak("שלום! אני כאן כדי להסביר למה אתה רואה מה שאתה רואה.");
  agent.animate();

  // Content detection
  const hostname = location.hostname.replace("www.", "");
  const selector = SITE_SELECTORS[hostname];
  if (!selector) return;

  const seen = new WeakSet();
  let lastSpeak = 0;
  const COOLDOWN = 9000;

  function processElement(el) {
    if (seen.has(el)) return;
    seen.add(el);
    const text = (el.innerText || el.textContent || "").trim();
    if (text.length < 15) return;

    const catId = observe(text);
    const now   = Date.now();
    if (catId !== "uncategorized" && now - lastSpeak > COOLDOWN) {
      lastSpeak = now;
      agent.animate();
      setTimeout(() => agent.speak(explain(catId)), 600);
    }
  }

  function scanVisible() {
    document.querySelectorAll(selector).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top >= 0 && r.top < window.innerHeight) processElement(el);
    });
  }

  scanVisible();
  new MutationObserver(scanVisible).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', () => setTimeout(scanVisible, 300), { passive: true });
})();
