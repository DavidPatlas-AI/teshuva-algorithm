// מיירט קריאות InnerTube (ה-API הפנימי של YouTube) כדי לחלץ כותרות ותיאורי וידאו
// לפני שהן מרונדרות ב-DOM — נותן ל-classifier טקסט מלא, לא רק מה שנראה על המסך

// מפתחות renderer שמכילים טקסט רלוונטי
const VIDEO_RENDERER_KEYS = new Set([
  'videoRenderer', 'compactVideoRenderer', 'gridVideoRenderer',
  'richItemRenderer', 'reelItemRenderer', 'playlistVideoRenderer',
  'movieRenderer', 'radioRenderer',
])

// חלץ כותרות ותיאורים מתוך אובייקט InnerTube אחד (renderer)
function extractFromRenderer(r) {
  const texts = []
  const content = r.content ?? r  // richItemRenderer עוטף תוכן תחת .content
  const title   = content.title?.runs?.map(x => x.text).join('') ??
                  content.headline?.runs?.map(x => x.text).join('') ?? ''
  const desc    = content.descriptionSnippet?.runs?.map(x => x.text).join('') ?? ''
  if (title.length > 4) texts.push(title)
  if (desc.length  > 4) texts.push(desc)
  return texts
}

// הליכה איטרטיבית על תגובת InnerTube — מגבילה עומק ומספר תוצאות
function extractTexts(root) {
  const results = []
  const queue   = [{ obj: root, depth: 0 }]

  while (queue.length > 0 && results.length < 200) {
    const { obj, depth } = queue.shift()
    if (!obj || typeof obj !== 'object' || depth > 12) continue

    if (Array.isArray(obj)) {
      for (const item of obj) queue.push({ obj: item, depth: depth + 1 })
      continue
    }

    for (const [key, val] of Object.entries(obj)) {
      if (VIDEO_RENDERER_KEYS.has(key)) {
        results.push(...extractFromRenderer(val))
      } else if (val && typeof val === 'object') {
        queue.push({ obj: val, depth: depth + 1 })
      }
    }
  }

  return results
}

// התקן יירוט fetch — נקרא פעם אחת בלבד
export function startInnerTubeIntercept(onText) {
  if (location.hostname.replace('www.', '') !== 'youtube.com') return

  const originalFetch = window.fetch

  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args)

    const url = typeof args[0] === 'string' ? args[0]
              : args[0] instanceof Request   ? args[0].url
              : ''

    if (url.includes('/youtubei/v1/')) {
      // clone כי body ניתן לקריאה פעם אחת בלבד
      response.clone().json().then(data => {
        const texts = extractTexts(data)
        texts.forEach(t => onText(t))
      }).catch(() => {})
    }

    return response
  }
}
