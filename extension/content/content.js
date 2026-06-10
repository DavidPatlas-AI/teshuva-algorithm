// Content script — watches social feeds and activates the mascot

const PREFS_DEFAULT = {
  mascot: { visible: true, position: "bottom-right" },
  categories: {
    politics:      { heLabel: "פוליטיקה",   weight: 1.0, color: "#EF4444" },
    sports:        { heLabel: "ספורט",       weight: 1.0, color: "#3B82F6" },
    entertainment: { heLabel: "בידור",        weight: 1.0, color: "#EC4899" },
    technology:    { heLabel: "טכנולוגיה",   weight: 1.0, color: "#8B5CF6" },
    news:          { heLabel: "חדשות",        weight: 1.0, color: "#F97316" },
    health:        { heLabel: "בריאות",       weight: 1.0, color: "#10B981" },
    economy:       { heLabel: "כלכלה",        weight: 1.0, color: "#F59E0B" },
    science:       { heLabel: "מדע",          weight: 1.0, color: "#06B6D4" },
    religion:      { heLabel: "דת ומסורת",   weight: 1.0, color: "#A78BFA" },
    uncategorized: { heLabel: "שונות",        weight: 1.0, color: "#9CA3AF" }
  }
};

// Selectors per site for extracting post text
const SITE_SELECTORS = {
  "twitter.com":      "[data-testid='tweetText']",
  "x.com":            "[data-testid='tweetText']",
  "facebook.com":     "[data-ad-preview='message'], [dir='auto']",
  "instagram.com":    "._a9zs span, .C4VMK span",
  "youtube.com":      "#video-title, #description-text",
  "tiktok.com":       "[data-e2e='browse-video-desc'], .tiktok-j2DY65-SpanText",
  "localhost":        "[data-testid='tweetText']"
};

const hostname = location.hostname.replace("www.", "");
const selector = SITE_SELECTORS[hostname];

let brain, mascot;

async function init() {
  brain = new TeshuvaBrain(PREFS_DEFAULT);
  await brain.load();

  mascot = new TeshuvaMascot(brain, PREFS_DEFAULT);
  mascot.mount();

  if (selector) startObserving();
}

function extractTextFromElement(el) {
  return el.innerText || el.textContent || "";
}

const seen = new WeakSet();
let lastNotifyTime = 0;
const NOTIFY_COOLDOWN_MS = 8000;

function processElement(el) {
  if (seen.has(el)) return;
  seen.add(el);

  const text = extractTextFromElement(el).trim();
  if (text.length < 15) return;

  const catId = brain.observe(text);

  const now = Date.now();
  if (catId !== "uncategorized" && now - lastNotifyTime > NOTIFY_COOLDOWN_MS) {
    lastNotifyTime = now;
    mascot.onContentDetected(catId, text);
  }
}

function scanVisible() {
  if (!selector) return;
  document.querySelectorAll(selector).forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight) processElement(el);
  });
}

function startObserving() {
  scanVisible();

  // MutationObserver — catches dynamically loaded content
  const observer = new MutationObserver(() => scanVisible());
  observer.observe(document.body, { childList: true, subtree: true });

  // Also scan on scroll
  let scrollTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(scanVisible, 300);
  }, { passive: true });
}

init();
