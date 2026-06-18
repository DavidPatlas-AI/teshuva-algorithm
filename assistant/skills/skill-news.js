/**
 * assistant/skills/skill-news.js — News headlines via RSS (no API key)
 *
 * Fetches RSS feed and returns plain-text headlines.
 */

export const SKILL_MANIFEST = {
  id:     'news',
  name:   'חדשות',
  events: ['user:ask_news'],
}

const FEEDS = {
  he: 'https://www.ynet.co.il/Integration/StoryRss2.xml',
  en: 'https://feeds.bbci.co.uk/news/world/rss.xml',
}

export async function getHeadlines(lang = 'he', count = 5) {
  const feed = FEEDS[lang] ?? FEEDS.he
  const res  = await fetch(feed)
  if (!res.ok) throw new Error('RSS fetch failed')
  const text  = await res.text()
  const parser = new DOMParser()
  const doc    = parser.parseFromString(text, 'application/xml')
  const items  = [...doc.querySelectorAll('item')].slice(0, count)
  return items.map(item => ({
    title:       item.querySelector('title')?.textContent ?? '',
    description: item.querySelector('description')?.textContent?.slice(0, 120) ?? '',
    link:        item.querySelector('link')?.textContent ?? '',
  }))
}

export function activate({ bus }) {
  async function onAskNews() {
    try {
      const headlines = await getHeadlines('he', 3)
      const text = headlines.map((h, i) => `${i + 1}. ${h.title}`).join('\n')
      bus.emit('agent:say', { text: `חדשות אחרונות:\n${text}`, mood: 'think' })
    } catch {
      bus.emit('agent:say', { text: 'לא הצלחתי לטעון חדשות.', mood: 'confused' })
    }
  }
  bus.on('user:ask_news', onAskNews)
  return { deactivate: () => bus.off('user:ask_news', onAskNews) }
}
