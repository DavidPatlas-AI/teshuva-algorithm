// מנוע הפעולות — לוחץ "Not interested" / "Hide" בשם המשתמש
// תומך: YouTube, X/Twitter, Facebook, Instagram, TikTok

const DELAY = { reveal: 250, menu: 450, option: 350 }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function findText(candidates, patterns) {
  return [...document.querySelectorAll(candidates)]
    .find(el => patterns.some(p => p.test(el.textContent)))
}

const PLATFORMS = {

  'youtube.com': {
    container: el =>
      el.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-reel-item-renderer'),

    reveal: c => {
      c.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
      c.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    },

    menuBtn: c =>
      c.querySelector('ytd-menu-renderer button#button, ytd-menu-renderer yt-icon-button#button'),

    option: () =>
      findText('ytd-menu-service-item-renderer, tp-yt-paper-item',
        [/not interested/i, /לא מעוניין/i]),
  },

  'x.com': {
    container: el => el.closest('article[data-testid="tweet"]'),
    reveal:    ()  => {},
    menuBtn:   c  => c.querySelector('[data-testid="caret"]'),
    option:    () =>
      findText('[data-testid="Dropdown"] [role="menuitem"], [role="menuitem"]',
        [/not interested/i, /לא מעוניין/i, /this post/i]),
  },

  'facebook.com': {
    container: el =>
      el.closest('div[role="article"]') ||
      el.closest('[data-pagelet^="FeedUnit"]'),

    reveal: () => {},

    menuBtn: c =>
      c.querySelector('[aria-label="More options"], [aria-label="אפשרויות נוספות"]'),

    option: () =>
      findText('[role="menuitem"], [role="menu"] [tabindex="0"]',
        [/hide post/i, /הסתר פוסט/i, /not interested/i, /לא מעוניין/i, /snooze/i]),
  },

  'instagram.com': {
    container: el =>
      el.closest('article, ._aatb') || el.parentElement?.closest('[role="presentation"]'),

    reveal: () => {},

    menuBtn: c =>
      c.querySelector('[aria-label="More options"]') ||
      [...c.querySelectorAll('button')].findLast(b => b.querySelector('svg')),

    option: () =>
      findText('[role="dialog"] button, [role="menu"] button',
        [/not interested/i, /לא מעוניין/i, /don.t suggest/i]),
  },

  'tiktok.com': {
    container: el =>
      el.closest('[data-e2e="recommend-list-item-container"]') ||
      el.closest('div[class*="DivItemContainer"]') ||
      el.closest('article'),

    reveal: c => {
      c.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
      c.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    },

    menuBtn: c => {
      // Direct "Not interested" button (newer TikTok layouts)
      const direct = c.querySelector('[data-e2e="not-interested"]') ||
                     c.querySelector('[data-e2e="video-more"]')
      if (direct) return direct
      // Fallback: overflow / more-options button
      return [...c.querySelectorAll('button')].find(b =>
        /more|options/i.test(b.getAttribute('data-e2e') ?? '') ||
        /more|options/i.test(b.getAttribute('aria-label') ?? '')
      )
    },

    option: () =>
      findText(
        '[role="menuitem"], [data-e2e="not-interested-text"], [class*="DivMenuItem"] span',
        [/not interested/i, /לא מעוניין/i, /don.t recommend/i, /uninterested/i]
      ),
  },

}

// aliases
PLATFORMS['twitter.com'] = PLATFORMS['x.com']

// ── Public API ────────────────────────────────────────────────────────────────

export async function dismissPost(el) {
  const host     = location.hostname.replace('www.', '')
  const platform = PLATFORMS[host]
  if (!platform || !el) return { ok: false, reason: 'unsupported' }

  try {
    const container = platform.container(el)
    if (!container) return { ok: false, reason: 'container-not-found' }

    // חשוף את כפתור התפריט (חלק מהפלטפורמות מסתירים אותו עד hover)
    platform.reveal(container)
    await sleep(DELAY.reveal)

    const btn = platform.menuBtn(container)
    if (!btn) return { ok: false, reason: 'menu-btn-not-found' }

    btn.click()
    await sleep(DELAY.menu)

    const opt = platform.option()
    if (!opt) {
      // סגור את התפריט ויצא
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      return { ok: false, reason: 'option-not-found' }
    }

    opt.click()
    return { ok: true, host }

  } catch (err) {
    return { ok: false, reason: err.message }
  }
}

export function isActionSupported() {
  const host = location.hostname.replace('www.', '')
  return host in PLATFORMS
}
