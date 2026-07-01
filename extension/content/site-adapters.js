// CSS selectors לפוסטים בכל רשת חברתית — מקור האמת היחיד

export const SITE_SELECTORS = {
  'twitter.com':   "[data-testid='tweetText']",
  'x.com':         "[data-testid='tweetText']",
  'facebook.com':  "[data-ad-preview='message'], [dir='auto']",
  'instagram.com': "._a9zs span, .C4VMK span",
  'youtube.com':   "#video-title, #description-text",
  'tiktok.com':    "[data-e2e='browse-video-desc']",
  'linkedin.com':  ".feed-shared-update-v2__description span, .update-components-text span",
  'reddit.com':    "[data-testid='post-content'] h3, .Post h3",
  'threads.net':   "div[dir='auto'] span",
  'threads.com':   "div[dir='auto'] span",
  'localhost':     "[data-testid='tweetText']",
}

// מחזיר את הסלקטור לפי ה-hostname הנוכחי
export function getSelectorForCurrentSite() {
  const hostname = location.hostname.replace('www.', '')
  return SITE_SELECTORS[hostname] ?? null
}
