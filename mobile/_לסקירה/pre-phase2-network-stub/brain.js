import config from '../../config.json';

const BASE = config.brain_api;

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method:  'POST',
    headers: {'Content-Type': 'application/json'},
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`brain-api ${path} → ${res.status}`);
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`brain-api ${path} → ${res.status}`);
  return res.json();
}

export async function explain(content) {
  return post('/explain', {content});
}

export async function getWeeklyInsights() {
  return get('/insights/weekly');
}

export async function getMood() {
  return get('/mood');
}

export async function sendFeedback(category, positive) {
  return post('/feedback', {category, positive});
}

export async function getStats() {
  return get('/stats');
}
