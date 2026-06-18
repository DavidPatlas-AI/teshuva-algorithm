/**
 * assistant/skills/skill-calendar.js — Simple local calendar
 *
 * Stores events locally. No external calendar API.
 * (Google Calendar integration is a future premium feature.)
 */

export const SKILL_MANIFEST = {
  id:     'calendar',
  name:   'יומן',
  events: ['user:ask_calendar', 'user:add_event'],
}

export function activate({ bus, api }) {
  const events = []  // local in-memory events

  function onAskCalendar() {
    const now      = Date.now()
    const upcoming = events
      .filter(e => e.ts >= now)
      .sort((a, b) => a.ts - b.ts)
      .slice(0, 3)

    if (!upcoming.length) {
      bus.emit('agent:say', { text: 'אין אירועים קרובים ביומן.', mood: 'idle' })
    } else {
      const list = upcoming.map(e => `• ${e.title} — ${formatDate(e.ts)}`).join('\n')
      bus.emit('agent:say', { text: `אירועים קרובים:\n${list}`, mood: 'think' })
    }
  }

  function onAddEvent({ title, ts }) {
    if (!title || !ts) return
    events.push({ title, ts, createdAt: Date.now() })
    bus.emit('agent:say', { text: `הוספתי ליומן: "${title}" ב-${formatDate(ts)}`, mood: 'excited' })
  }

  bus.on('user:ask_calendar', onAskCalendar)
  bus.on('user:add_event',    onAddEvent)

  return {
    getEvents: () => [...events],
    deactivate() {
      bus.off('user:ask_calendar', onAskCalendar)
      bus.off('user:add_event',    onAddEvent)
    },
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('he-IL', { weekday: 'short', month: 'short', day: 'numeric' })
}
