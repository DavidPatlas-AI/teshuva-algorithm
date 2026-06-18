// popup-entry.js — נבנה ל-popup.js ע"י esbuild
// מייבא categories מהמקור האחד, מדבר עם background דרך api.js

import { CATEGORIES, CATEGORY_IDS } from '../../brain/categories.js'
import { api }                        from '../api.js'

// סיווג URL לפי דומיין — בשימוש לניתוח היסטוריית גלישה
const URL_KEYS = {
  politics:      ['news','politic','gov','knesset','haaretz','ynet','mako','maariv'],
  sports:        ['sport','football','basketball','nba','fifa','maccabi'],
  entertainment: ['netflix','prime','disney','music','spotify','youtube','tiktok'],
  technology:    ['github','stackoverflow','tech','dev','google','apple','amazon','openai'],
  news:          ['breaking','cnn','bbc','walla','nrg','calcalist'],
  health:        ['health','medical','doctor','fitness','gym','diet'],
  economy:       ['finance','bank','invest','stock','crypto','bitcoin'],
  science:       ['science','nasa','nature','research','academic','wikipedia'],
  religion:      ['torah','jewish','chabad','otzar','daat','hebrewbooks'],
}

function classifyUrl(url) {
  const lower = url.toLowerCase()
  for (const id of CATEGORY_IDS) {
    for (const kw of URL_KEYS[id] ?? [])
      if (lower.includes(kw)) return id
  }
  return 'uncategorized'
}

const SOCIAL_DOMAINS = ['twitter.com','x.com','facebook.com','instagram.com','youtube.com','tiktok.com','linkedin.com','reddit.com','threads.net','snapchat.com']

function showTab(name) {
  const names = ['overview','categories','history','insights']
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', names[i] === name))
  document.querySelectorAll('.tab-content').forEach(el =>
    el.classList.toggle('active', el.id === 'tab-' + name))
}
window.showTab = showTab

function barRow(label, count, max, color, weight = null, dismissed = 0) {
  const pct        = max > 0 ? Math.round(count / max * 100) : 0
  const sentimentEl = weight != null ? weightBadge(weight, dismissed) : ''
  return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="bar-count">${count}</span>
    ${sentimentEl}
  </div>`
}

function weightBadge(w, dismissed = 0) {
  if (dismissed > 0)  return `<span class="badge badge-block" title="${dismissed} הוסרו">🚫 ${dismissed}</span>`
  if (w >= 1.5)       return `<span class="badge badge-love"  title="קטגוריה אהובה">❤️</span>`
  if (w >= 0.8)       return `<span class="badge badge-mid"   title="ניטרלי">😐</span>`
  if (w >= 0.4)       return `<span class="badge badge-low"   title="לא ממש מעניין">😒</span>`
  return                     `<span class="badge badge-block" title="מסיר אוטומטית">🚫</span>`
}

async function loadAll() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  // ── Data sources ─────────────────────────────────────────────
  // brain state — דרך background (לא ישירות ל-storage)
  const brainState  = await api.getStats().catch(() => ({}))
  const stored      = brainState?.allTime    ?? {}
  const weights     = brainState?.weights    ?? {}
  const dismissedBy = brainState?.dismissed  ?? {}

  // היסטוריית גלישה
  const histItems = await new Promise(r =>
    chrome.history.search({ text: '', maxResults: 5000, startTime: sevenDaysAgo }, r)
  )

  // ── עיבוד היסטוריה ───────────────────────────────────────────
  const domainCounts  = {}
  const socialCounts  = {}
  const histCatCounts = {}
  const hourBuckets   = new Array(24).fill(0)

  for (const item of histItems) {
    try {
      const url  = item.url ?? ''
      const host = new URL(url).hostname.replace('www.', '')

      domainCounts[host] = (domainCounts[host] ?? 0) + (item.visitCount ?? 1)

      if (SOCIAL_DOMAINS.some(d => host.includes(d)))
        socialCounts[host] = (socialCounts[host] ?? 0) + (item.visitCount ?? 1)

      const cat = classifyUrl(url)
      histCatCounts[cat] = (histCatCounts[cat] ?? 0) + 1

      if (item.lastVisitTime)
        hourBuckets[new Date(item.lastVisitTime).getHours()]++
    } catch {}
  }

  const totalVisits = histItems.length
  const totalSocial = Object.values(socialCounts).reduce((a, b) => a + b, 0)
  const liveCats    = Object.entries(stored)
    .filter(([k, v]) => v > 0 && k !== 'uncategorized')
    .sort((a, b) => b[1] - a[1])
  const topLiveCat  = liveCats[0]

  // ── Dismiss banner ───────────────────────────────────────────
  const dismissedTotal = brainState?.dismissedTotal ?? 0
  if (dismissedTotal > 0) {
    document.getElementById('stat-dismissed').textContent = dismissedTotal.toLocaleString()
    document.getElementById('dismiss-banner').style.display = 'flex'
  }

  // ── Header ────────────────────────────────────────────────────
  document.getElementById('header-sub').textContent =
    `${totalVisits.toLocaleString()} ביקורים ב-7 ימים`

  // ── Tab 1: Overview ───────────────────────────────────────────
  document.getElementById('stat-visits').textContent     = totalVisits.toLocaleString()
  document.getElementById('stat-social').textContent     = totalSocial.toLocaleString()
  document.getElementById('stat-categories').textContent =
    liveCats.length || Object.keys(histCatCounts).filter(k => k !== 'uncategorized').length

  document.getElementById('stat-top-cat').textContent = topLiveCat
    ? CATEGORIES[topLiveCat[0]]?.heLabel ?? topLiveCat[0]
    : (Object.entries(histCatCounts)
        .filter(([k]) => k !== 'uncategorized')
        .sort((a, b) => b[1] - a[1])[0]
        ?.[0]
          ? CATEGORIES[Object.entries(histCatCounts).sort((a,b)=>b[1]-a[1])[0][0]]?.heLabel ?? '—'
          : '—')

  const sortedSocial = Object.entries(socialCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxSocial    = sortedSocial[0]?.[1] ?? 1
  document.getElementById('social-sites').innerHTML = sortedSocial.length
    ? sortedSocial.map(([d, c]) => barRow(d, c, maxSocial, '#A78BFA')).join('')
    : '<div class="empty">לא נמצאו ביקורים ברשתות חברתיות ב-7 ימים האחרונים</div>'

  // ── Tab 2: Categories ─────────────────────────────────────────
  const maxLive = Math.max(...Object.values(stored), 1)
  document.getElementById('cat-bars-live').innerHTML = liveCats.length
    ? liveCats.map(([id, cnt]) =>
        barRow(
          CATEGORIES[id]?.heLabel ?? id, cnt, maxLive,
          CATEGORIES[id]?.color ?? '#9CA3AF',
          weights[id] ?? null,
          dismissedBy[id] ?? 0,
        )).join('')
    : '<div class="empty">עדיין לא זוהה תוכן. גלול ברשת חברתית עם התוסף פעיל.</div>'

  const histCatEntries = Object.entries(histCatCounts)
    .filter(([k]) => k !== 'uncategorized')
    .sort((a, b) => b[1] - a[1])
  const maxHistCat = histCatEntries[0]?.[1] ?? 1
  document.getElementById('cat-bars-history').innerHTML = histCatEntries.length
    ? histCatEntries.map(([id, cnt]) =>
        barRow(CATEGORIES[id]?.heLabel ?? id, cnt, maxHistCat, CATEGORIES[id]?.color ?? '#9CA3AF')).join('')
    : '<div class="empty">לא נמצאו קטגוריות בהיסטוריית הגלישה</div>'

  // ── Tab 3: History ────────────────────────────────────────────
  const maxHour = Math.max(...hourBuckets, 1)
  document.getElementById('time-bars').innerHTML =
    hourBuckets.map(v =>
      `<div class="time-bar" style="height:${Math.max(3, Math.round(v / maxHour * 48))}px" title="${v} ביקורים"></div>`
    ).join('')

  document.getElementById('time-labels').innerHTML =
    Array.from({ length: 24 }, (_, i) => {
      const label = i === 0 ? '12AM' : i === 6 ? '6AM' : i === 12 ? '12PM' : i === 18 ? '6PM' : ''
      return `<div class="time-label" title="שעה ${i}:00">${label}</div>`
    }).join('')

  const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxDomain  = topDomains[0]?.[1] ?? 1
  document.getElementById('top-domains').innerHTML = topDomains.length
    ? topDomains.map(([d, c]) => `
        <div class="domain-item">
          <span class="domain-name">${d}</span>
          <span class="domain-count">${c.toLocaleString()}</span>
        </div>
        <div class="domain-bar"><div class="domain-bar-fill" style="width:${Math.round(c / maxDomain * 100)}%"></div></div>
      `).join('')
    : '<div class="empty">אין היסטוריה זמינה</div>'

  // ── Tab 4: Insights ───────────────────────────────────────────
  const insights = []

  if (sortedSocial.length) {
    const [top] = sortedSocial
    insights.push({ icon: '📱', text: `האתר הכי פופולרי שלך השבוע: <b>${top[0]}</b> — ${top[1].toLocaleString()} ביקורים.` })
  }

  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets))
  insights.push({ icon: '⏰', text: `אתה גולש הכי הרבה בשעה <b>${peakHour}:00</b> (${hourBuckets[peakHour]} ביקורים ב-7 ימים).` })

  if (totalVisits > 0) {
    const pct = Math.round(totalSocial / totalVisits * 100)
    insights.push({ icon: '🕸️', text: `<b>${pct}%</b> מהגלישה שלך הולכת לרשתות חברתיות.` })
  }

  if (topLiveCat) {
    const liveTotal = Object.values(stored).reduce((a, b) => a + b, 0) || 1
    const pct = Math.round(topLiveCat[1] / liveTotal * 100)
    insights.push({ icon: '🔍', text: `התוכן הנפוץ ביותר שנחשפת אליו: <b>${CATEGORIES[topLiveCat[0]]?.heLabel}</b> — ${pct}% מהפוסטים.` })
  }

  if (histCatEntries.length) {
    const hTotal = histCatEntries.reduce((a, [, v]) => a + v, 0) || 1
    const top3   = histCatEntries.slice(0, 3)
      .map(([id, cnt]) => `${CATEGORIES[id]?.heLabel ?? id} (${Math.round(cnt / hTotal * 100)}%)`).join(', ')
    insights.push({ icon: '📊', text: `לפי היסטוריית הגלישה, הנושאים שמעניינים אותך: <b>${top3}</b>.` })
  }

  const avgPerDay = Math.round(totalVisits / 7)
  insights.push({ icon: '📈', text: `ממוצע של <b>${avgPerDay}</b> ביקורים ביום השבוע האחרון.` })

  document.getElementById('insights-list').innerHTML = insights.length
    ? insights.map(ins =>
        `<div class="insight"><div class="insight-icon">${ins.icon}</div><div class="insight-text">${ins.text}</div></div>`
      ).join('')
    : '<div class="empty">אין מספיק נתונים עדיין. התוסף צריך זמן ללמוד.</div>'
}

// ── Reset button ──────────────────────────────────────────────
document.getElementById('btn-reset').addEventListener('click', async () => {
  await api.resetStats()
  location.reload()
})

loadAll().catch(console.error)
