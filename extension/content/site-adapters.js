// CSS selectors לפוסטים בכל רשת חברתית — מקור האמת היחיד

export const SITE_SELECTORS = {
  'twitter.com':   "[data-testid='tweetText']",
  'x.com':         "[data-testid='tweetText']",
  'facebook.com':  "[data-ad-preview='message'], [dir='auto']",
  'instagram.com': "._a9zs span, .C4VMK span",
  'youtube.com':   "#video-title, #description-text",
  'tiktok.com':    "[data-e2e='browse-video-desc']",
  'localhost':     "[data-testid='tweetText']",
}

// מחזיר את הסלקטור לפי ה-hostname הנוכחי
export function getSelectorForCurrentSite() {
  const hostname = location.hostname.replace('www.', '')
  return SITE_SELECTORS[hostname] ?? null
}
