/**
 * brain-server-stub.js
 *
 * מריץ שרת Express מקומי שמחקה את brain-api.
 * שימושי לפיתוח ולהרצת האמולטור לפני שחיברת brain אמיתי.
 *
 * הרצה:
 *   node src/api/brain-server-stub.js
 *
 * ואז ב-config.json:
 *   "brain_api": "http://10.0.2.2:3000/api"   ← אמולטור אנדרואיד
 *   "brain_api": "http://localhost:3000/api"    ← iOS simulator / web
 */

const http = require('http');

const CATEGORIES = ['פוליטיקה', 'ספורט', 'טכנולוגיה', 'בידור', 'אחר'];

const ROUTES = {
  'GET /api/health': () => ({status: 'ok'}),

  'GET /api/stats': () => ({
    totalSeen: 342,
    dismissed: 87,
    accuracy:  91,
    breakdown: [
      {label: 'פוליטיקה',  pct: 47, color: '#ff9a1f'},
      {label: 'ספורט',     pct: 21, color: '#e7842a'},
      {label: 'טכנולוגיה', pct: 18, color: '#b9772f'},
      {label: 'אחר',       pct: 14, color: '#6f6a60'},
    ],
  }),

  'GET /api/mood': () => ({
    mood:        'neutral',
    description: 'מנטר בשקיפות מלאה',
  }),

  'GET /api/insights/weekly': () => ({
    totalSeen:   342,
    dismissed:   87,
    topCategory: 'פוליטיקה',
    message:     '47% מהפיד שלך הייתה פוליטיקה השבוע. הסרתי 87 פריטים בשמך.',
    breakdown: [
      {label: 'פוליטיקה',  pct: 47, color: '#ff9a1f'},
      {label: 'ספורט',     pct: 21, color: '#e7842a'},
      {label: 'טכנולוגיה', pct: 18, color: '#b9772f'},
      {label: 'אחר',       pct: 14, color: '#6f6a60'},
    ],
  }),

  'POST /api/explain': body => {
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    return {
      category:    cat,
      explanation: `הפוסט הזה סווג כ"${cat}" בגלל מילות מפתח ותבניות שזוהו בטקסט. צפית ב‑3 פריטים דומים לאחרונה.`,
      signals: [
        {label: 'מילות מפתח',       score: 0.62, weight: '+62%'},
        {label: 'היסטוריית גלישה',  score: 0.24, weight: '+24%'},
        {label: 'טרנד אזורי',       score: 0.14, weight: '+14%'},
      ],
    };
  },

  'POST /api/feedback': body => ({
    ok:       true,
    category: body.category,
    positive: body.positive,
    message:  body.positive ? 'תודה! נרשם.' : 'הובן. אנסה לשפר.',
  }),
};

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const key = `${req.method} ${req.url.split('?')[0]}`;
  const handler = ROUTES[key];

  if (!handler) {
    res.writeHead(404);
    res.end(JSON.stringify({error: `No route: ${key}`}));
    return;
  }

  let body = '';
  req.on('data', d => body += d);
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      const result = handler(parsed);
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({error: e.message}));
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`brain-api stub → http://localhost:${PORT}/api`);
  console.log('Android emulator → http://10.0.2.2:3000/api');
  console.log('iOS simulator    → http://localhost:3000/api');
});
