const SOCIAL_DOMAINS = ["twitter.com","x.com","facebook.com","instagram.com","youtube.com","tiktok.com","linkedin.com","reddit.com","threads.net","snapchat.com"];

const CATEGORIES_META = {
  politics:      { heLabel:"פוליטיקה",  color:"#EF4444", urlKeys:["news","politic","gov","knesset","haaretz","ynet","mako","maariv"] },
  sports:        { heLabel:"ספורט",      color:"#3B82F6", urlKeys:["sport","football","basketball","nba","fifa","maccabi"] },
  entertainment: { heLabel:"בידור",       color:"#EC4899", urlKeys:["netflix","prime","disney","music","spotify","youtube","tiktok"] },
  technology:    { heLabel:"טכנולוגיה",  color:"#8B5CF6", urlKeys:["github","stackoverflow","tech","dev","google","apple","amazon","openai"] },
  news:          { heLabel:"חדשות",       color:"#F97316", urlKeys:["news","breaking","cnn","bbc","walla","nrg","calcalist"] },
  health:        { heLabel:"בריאות",      color:"#10B981", urlKeys:["health","medical","doctor","fitness","gym","diet"] },
  economy:       { heLabel:"כלכלה",       color:"#F59E0B", urlKeys:["finance","bank","invest","stock","crypto","bitcoin","calcalist"] },
  science:       { heLabel:"מדע",         color:"#06B6D4", urlKeys:["science","nasa","nature","research","academic","wikipedia"] },
  religion:      { heLabel:"דת ומסורת",  color:"#A78BFA", urlKeys:["torah","jewish","chabad","otzar","daat","hebrewbooks"] },
};

function classifyUrl(url) {
  const lower = url.toLowerCase();
  for (const [id, meta] of Object.entries(CATEGORIES_META))
    for (const kw of meta.urlKeys)
      if (lower.includes(kw)) return id;
  return "uncategorized";
}

function showTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    const names = ['overview','categories','history','insights'];
    t.classList.toggle('active', names[i] === name);
  });
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === 'tab-' + name);
  });
}
window.showTab = showTab;

function barRow(label, count, max, color) {
  const pct = max > 0 ? Math.round(count / max * 100) : 0;
  return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}"></div></div>
    <span class="bar-count">${count}</span>
  </div>`;
}

async function loadAll() {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // 1. chrome.storage — live detected content
  const stored = await new Promise(r => chrome.storage.local.get('allTime', d => r(d.allTime || {})));

  // 2. chrome.history — last 7 days, up to 5000 entries
  const histItems = await new Promise(r =>
    chrome.history.search({ text: '', maxResults: 5000, startTime: sevenDaysAgo }, r)
  );

  // ── Process history ──────────────────────────────────────
  const domainCounts = {};
  const socialCounts = {};
  const histCatCounts = {};
  const hourBuckets  = new Array(24).fill(0);

  for (const item of histItems) {
    try {
      const url  = item.url || '';
      const host = new URL(url).hostname.replace('www.','');

      // domain tally
      domainCounts[host] = (domainCounts[host] || 0) + (item.visitCount || 1);

      // social tally
      const isSocial = SOCIAL_DOMAINS.some(d => host.includes(d));
      if (isSocial) socialCounts[host] = (socialCounts[host] || 0) + (item.visitCount || 1);

      // category from URL
      const cat = classifyUrl(url);
      histCatCounts[cat] = (histCatCounts[cat] || 0) + 1;

      // hourly
      if (item.lastVisitTime) {
        const h = new Date(item.lastVisitTime).getHours();
        hourBuckets[h]++;
      }
    } catch {}
  }

  const totalVisits  = histItems.length;
  const totalSocial  = Object.values(socialCounts).reduce((a,b)=>a+b,0);
  const liveCats     = Object.entries(stored).filter(([k,v]) => v > 0 && k !== 'uncategorized');
  const topLiveCat   = liveCats.sort((a,b)=>b[1]-a[1])[0];

  // ── HEADER ───────────────────────────────────────────────
  document.getElementById('header-sub').textContent =
    `${totalVisits.toLocaleString()} ביקורים ב-7 ימים`;

  // ── TAB 1: Overview ─────────────────────────────────────
  document.getElementById('stat-visits').textContent   = totalVisits.toLocaleString();
  document.getElementById('stat-social').textContent   = totalSocial.toLocaleString();
  document.getElementById('stat-categories').textContent = liveCats.length || Object.keys(histCatCounts).filter(k=>k!=='uncategorized').length;
  document.getElementById('stat-top-cat').textContent  = topLiveCat
    ? CATEGORIES_META[topLiveCat[0]]?.heLabel || topLiveCat[0]
    : (Object.entries(histCatCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]
        ? CATEGORIES_META[Object.entries(histCatCounts).sort((a,b)=>b[1]-a[1])[0][0]]?.heLabel || '—'
        : '—');

  // Social sites
  const sortedSocial = Object.entries(socialCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxSocial    = sortedSocial[0]?.[1] || 1;
  document.getElementById('social-sites').innerHTML = sortedSocial.length
    ? sortedSocial.map(([d,c]) => barRow(d, c, maxSocial, '#A78BFA')).join('')
    : '<div class="empty">לא נמצאו ביקורים ברשתות חברתיות ב-7 ימים האחרונים</div>';

  // ── TAB 2: Categories ───────────────────────────────────
  const maxLive = Math.max(...Object.values(stored), 1);
  document.getElementById('cat-bars-live').innerHTML = liveCats.length
    ? liveCats.sort((a,b)=>b[1]-a[1])
        .map(([id,cnt]) => barRow(CATEGORIES_META[id]?.heLabel||id, cnt, maxLive, CATEGORIES_META[id]?.color||'#9CA3AF'))
        .join('')
    : '<div class="empty">עדיין לא זוהה תוכן. גלול ברשת חברתית עם התוסף פעיל.</div>';

  const histCatEntries = Object.entries(histCatCounts).filter(([k])=>k!=='uncategorized').sort((a,b)=>b[1]-a[1]);
  const maxHistCat     = histCatEntries[0]?.[1] || 1;
  document.getElementById('cat-bars-history').innerHTML = histCatEntries.length
    ? histCatEntries.map(([id,cnt]) => barRow(CATEGORIES_META[id]?.heLabel||id, cnt, maxHistCat, CATEGORIES_META[id]?.color||'#9CA3AF')).join('')
    : '<div class="empty">לא נמצאו קטגוריות בהיסטוריית הגלישה</div>';

  // ── TAB 3: History ───────────────────────────────────────
  const maxHour = Math.max(...hourBuckets, 1);
  document.getElementById('time-bars').innerHTML =
    hourBuckets.map(v => `<div class="time-bar" style="height:${Math.max(3,Math.round(v/maxHour*48))}px" title="${v} ביקורים"></div>`).join('');
  // 24 labels matching the 24 time-bar divs above — one per hour
  document.getElementById('time-labels').innerHTML =
    Array.from({length:24},(_,i) => {
      const label = i === 0 ? '12AM' : i === 6 ? '6AM' : i === 12 ? '12PM' : i === 18 ? '6PM' : ''
      return `<div class="time-label" title="שעה ${i}:00">${label}</div>`
    }).join('');

  const topDomains = Object.entries(domainCounts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const maxDomain  = topDomains[0]?.[1] || 1;
  document.getElementById('top-domains').innerHTML = topDomains.length
    ? topDomains.map(([d,c]) => `
        <div class="domain-item">
          <span class="domain-name">${d}</span>
          <span class="domain-count">${c.toLocaleString()}</span>
        </div>
        <div class="domain-bar"><div class="domain-bar-fill" style="width:${Math.round(c/maxDomain*100)}%"></div></div>
      `).join('')
    : '<div class="empty">אין היסטוריה זמינה</div>';

  // ── TAB 4: Insights ──────────────────────────────────────
  const insights = [];

  // Most visited social
  if (sortedSocial.length) {
    const [top] = sortedSocial;
    insights.push({ icon:'📱', text:`האתר הכי פופולרי שלך השבוע: <b>${top[0]}</b> — ${top[1].toLocaleString()} ביקורים.` });
  }

  // Peak hour
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets));
  insights.push({ icon:'⏰', text:`אתה גולש הכי הרבה בשעה <b>${peakHour}:00</b> (${hourBuckets[peakHour]} ביקורים ב-7 ימים).` });

  // Social vs total
  if (totalVisits > 0) {
    const pct = Math.round(totalSocial / totalVisits * 100);
    insights.push({ icon:'🕸️', text:`<b>${pct}%</b> מהגלישה שלך הולכת לרשתות חברתיות.` });
  }

  // Top category
  if (topLiveCat) {
    const liveTotal = Object.values(stored).reduce((a,b)=>a+b,0) || 1;
    const pct = Math.round(topLiveCat[1]/liveTotal*100);
    insights.push({ icon:'🔍', text:`התוכן הנפוץ ביותר שנחשפת אליו: <b>${CATEGORIES_META[topLiveCat[0]]?.heLabel}</b> — ${pct}% מהפוסטים.` });
  }

  // History category
  if (histCatEntries.length > 0) {
    const hTotal = histCatEntries.reduce((a,[,v])=>a+v,0) || 1;
    const top3 = histCatEntries.slice(0,3).map(([id,cnt]) =>
      `${CATEGORIES_META[id]?.heLabel||id} (${Math.round(cnt/hTotal*100)}%)`).join(', ');
    insights.push({ icon:'📊', text:`לפי היסטוריית הגלישה, הנושאים שמעניינים אותך: <b>${top3}</b>.` });
  }

  // Daily average
  const avgPerDay = Math.round(totalVisits / 7);
  insights.push({ icon:'📈', text:`ממוצע של <b>${avgPerDay}</b> ביקורים ביום השבוע האחרון.` });

  document.getElementById('insights-list').innerHTML = insights.length
    ? insights.map(ins => `<div class="insight"><div class="insight-icon">${ins.icon}</div><div class="insight-text">${ins.text}</div></div>`).join('')
    : '<div class="empty">אין מספיק נתונים עדיין. התוסף צריך זמן ללמוד.</div>';
}

document.getElementById('btn-reset').addEventListener('click', () => {
  chrome.storage.local.set({ allTime: {} }, () => location.reload());
});

loadAll().catch(console.error);
