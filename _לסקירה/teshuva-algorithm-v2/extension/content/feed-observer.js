// מאזין לאלמנטים חדשים בפיד — MutationObserver + scroll

const MIN_TEXT_LENGTH = 15

// onElement נקרא עם כל אלמנט חדש גלוי
export function startFeedObserver(selector, onElement) {
  if (!selector) return

  const seen = new WeakSet()

  function processEl(el) {
    if (seen.has(el)) return
    seen.add(el)
    const text = (el.innerText || el.textContent || '').trim()
    if (text.length >= MIN_TEXT_LENGTH) onElement(el, text)
  }

  function scanVisible() {
    document.querySelectorAll(selector).forEach(el => {
      const r = el.getBoundingClientRect()
      if (r.top >= 0 && r.top < window.innerHeight) processEl(el)
    })
  }

  scanVisible()
  new MutationObserver(scanVisible).observe(document.body, { childList: true, subtree: true })
  window.addEventListener('scroll', () => setTimeout(scanVisible, 300), { passive: true })
}
