exports.handler = async () => {
  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>דוד • כל הפרויקטים</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Rubik', sans-serif;
      background: linear-gradient(135deg, #060814 0%, #0d1b2e 100%);
      color: #e8eaf0;
      min-height: 100vh;
      padding: 12px;
    }

    .container { max-width: 700px; margin: 0 auto; }

    header {
      text-align: center;
      padding: 16px 0 20px;
    }

    header h1 {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    header p { font-size: 12px; color: #666; margin-top: 4px; }

    .top-bar {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      align-items: center;
    }

    .refresh-btn {
      flex: 1;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      border: none;
      color: #fff;
      padding: 10px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .refresh-btn:disabled { opacity: 0.5; }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 16px;
    }

    .summary-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 14px 10px;
      text-align: center;
    }

    .summary-card .val {
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .summary-card .lbl { font-size: 11px; color: #777; margin-top: 2px; }

    .site-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 10px;
      transition: border-color 0.2s;
    }

    .site-card:hover { border-color: rgba(0,212,255,0.25); }

    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .site-name {
      font-size: 15px;
      font-weight: 700;
      color: #e8eaf0;
    }

    .site-url {
      font-size: 11px;
      color: #00d4ff;
      text-decoration: none;
      display: block;
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 250px;
    }

    .badge {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 20px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .badge-ok { background: rgba(0,255,120,0.15); color: #00ff78; }
    .badge-build { background: rgba(255,165,0,0.15); color: #ffa500; }
    .badge-fail { background: rgba(255,60,60,0.15); color: #ff3c3c; }
    .badge-unknown { background: rgba(255,255,255,0.08); color: #888; }

    .site-metrics {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    .metric { font-size: 12px; color: #999; }
    .metric span { color: #00d4ff; font-weight: 700; }

    .no-analytics {
      font-size: 11px;
      color: #555;
      margin-top: 6px;
    }

    .site-repo {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }

    .site-repo a { color: #888; text-decoration: none; }
    .site-repo a:hover { color: #00d4ff; }

    .error-box {
      background: rgba(255,60,60,0.1);
      border: 1px solid rgba(255,60,60,0.3);
      color: #ff7070;
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 16px;
      font-size: 13px;
    }

    .spinner { animation: spin 1s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .loading-msg { text-align: center; padding: 40px; color: #666; font-size: 14px; }

    .footer { text-align: center; font-size: 11px; color: #444; padding: 20px 0; }

    .filter-bar {
      display: flex;
      gap: 6px;
      margin-bottom: 14px;
    }

    .filter-btn {
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: #888;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn.active {
      border-color: #00d4ff;
      color: #00d4ff;
      background: rgba(0,212,255,0.08);
    }

    .updated { font-size: 10px; color: #555; margin-top: 4px; }
  </style>
</head>
<body>
<div class="container">
  <header>
    <h1>🚀 הפרויקטים שלי</h1>
    <p>Netlify + GitHub • כל האתרים</p>
  </header>

  <div class="top-bar">
    <button class="refresh-btn" onclick="load()">🔄 עדכן</button>
  </div>

  <div id="error-box"></div>

  <div id="summary" class="summary-grid" style="display:none">
    <div class="summary-card">
      <div class="val" id="s-total">—</div>
      <div class="lbl">אתרים</div>
    </div>
    <div class="summary-card">
      <div class="val" id="s-live">—</div>
      <div class="lbl">פעילים</div>
    </div>
    <div class="summary-card">
      <div class="val" id="s-views">—</div>
      <div class="lbl">צפיות (30י)</div>
    </div>
  </div>

  <div class="filter-bar" id="filter-bar" style="display:none">
    <button class="filter-btn active" data-filter="all" onclick="setFilter('all',this)">הכל</button>
    <button class="filter-btn" data-filter="live" onclick="setFilter('live',this)">פעילים ✅</button>
    <button class="filter-btn" data-filter="analytics" onclick="setFilter('analytics',this)">עם Analytics</button>
  </div>

  <div id="sites-list">
    <div class="loading-msg"><span class="spinner">⏳</span> טוען נתונים...</div>
  </div>

  <div class="footer" id="footer"></div>
</div>

<script>
  let allSites = [];
  let currentFilter = 'all';

  async function load() {
    const btn = document.querySelector('.refresh-btn');
    const errBox = document.getElementById('error-box');
    errBox.innerHTML = '';
    btn.disabled = true;
    btn.textContent = '⏳ טוען...';
    document.getElementById('sites-list').innerHTML = '<div class="loading-msg"><span class="spinner">⏳</span> מושך נתונים מ-Netlify...</div>';

    try {
      const res = await fetch('/.netlify/functions/analytics');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'שגיאת API');

      allSites = data.sites || [];
      renderSummary(data);
      renderSites();

      document.getElementById('summary').style.display = 'grid';
      document.getElementById('filter-bar').style.display = 'flex';
      document.getElementById('footer').textContent = 'עודכן: ' + new Date(data.timestamp).toLocaleString('he-IL');
    } catch (e) {
      errBox.innerHTML = '<div class="error-box">❌ ' + e.message + '</div>';
    } finally {
      btn.disabled = false;
      btn.textContent = '🔄 עדכן';
    }
  }

  function renderSummary(data) {
    document.getElementById('s-total').textContent = data.total_sites;
    const live = data.sites.filter(s => s.deploy_status === 'ready').length;
    document.getElementById('s-live').textContent = live;
    const totalViews = data.sites.reduce((sum, s) => sum + (s.pageviews || 0), 0);
    document.getElementById('s-views').textContent = totalViews > 0 ? fmtNum(totalViews) : '—';
  }

  function setFilter(f, el) {
    currentFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderSites();
  }

  function renderSites() {
    let sites = allSites;
    if (currentFilter === 'live') sites = sites.filter(s => s.deploy_status === 'ready');
    if (currentFilter === 'analytics') sites = sites.filter(s => s.analytics_enabled);

    if (!sites.length) {
      document.getElementById('sites-list').innerHTML = '<div class="loading-msg">אין תוצאות</div>';
      return;
    }

    document.getElementById('sites-list').innerHTML = sites.map(siteCard).join('');
  }

  function siteCard(s) {
    const badgeClass = s.deploy_status === 'ready' ? 'badge-ok'
                     : s.deploy_status === 'building' ? 'badge-build'
                     : s.deploy_status === 'failed' ? 'badge-fail'
                     : 'badge-unknown';
    const badgeText = s.deploy_status === 'ready' ? '✅ פעיל'
                    : s.deploy_status === 'building' ? '🔄 בנייה'
                    : s.deploy_status === 'failed' ? '❌ שגיאה'
                    : '• ' + s.deploy_status;

    const analytics = s.analytics_enabled
      ? \`<div class="site-metrics">
          <div class="metric">צפיות: <span>\${fmtNum(s.pageviews ?? 0)}</span></div>
          <div class="metric">מבקרים: <span>\${fmtNum(s.unique_visitors ?? 0)}</span></div>
         </div>\`
      : '<div class="no-analytics">Analytics לא מופעל לאתר זה</div>';

    const repo = s.repo
      ? \`<div class="site-repo">📦 <a href="\${s.repo}" target="_blank">\${s.repo.replace('https://github.com/', '')}</a></div>\`
      : '';

    const updated = s.updated
      ? \`<div class="updated">עודכן: \${new Date(s.updated).toLocaleDateString('he-IL')}</div>\`
      : '';

    return \`
      <div class="site-card">
        <div class="site-header">
          <div>
            <div class="site-name">\${s.name}</div>
            <a class="site-url" href="\${s.url}" target="_blank">\${s.url}</a>
            \${repo}
            \${updated}
          </div>
          <span class="badge \${badgeClass}">\${badgeText}</span>
        </div>
        \${analytics}
      </div>
    \`;
  }

  function fmtNum(n) {
    if (!n) return '0';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toLocaleString('he-IL');
  }

  // טעינה ראשונית
  load();
  // רענון כל 2 דקות
  setInterval(load, 120000);
</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
    body: html
  };
};
