/**
 * assistant/skills/skill-weather.js — Weather skill (uses open-meteo.com, no API key)
 *
 * Privacy-safe: uses Open-Meteo (free, no tracking, no API key needed).
 */

export const SKILL_MANIFEST = {
  id:     'weather',
  name:   'מזג אוויר',
  events: ['user:ask_weather'],
}

// Coordinates for Tel Aviv (default)
const DEFAULT_LAT = 32.0853
const DEFAULT_LON = 34.7818

export async function getWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&wind_speed_unit=kmh`
  const res  = await fetch(url)
  if (!res.ok) throw new Error('Weather API error')
  const data = await res.json()
  const { temperature, weathercode, windspeed } = data.current_weather
  return {
    temperature,
    windspeed,
    description: describeCode(weathercode),
    heText: `מזג האוויר: ${describeCode(weathercode)}, ${temperature}°C, רוח ${windspeed} קמ"ש`,
  }
}

export function activate({ bus, api }) {
  async function onAskWeather() {
    try {
      const weather = await getWeather()
      bus.emit('agent:say', { text: weather.heText, mood: 'think' })
    } catch {
      bus.emit('agent:say', { text: 'לא הצלחתי לקבל מזג אוויר כרגע.', mood: 'confused' })
    }
  }
  bus.on('user:ask_weather', onAskWeather)
  return { deactivate: () => bus.off('user:ask_weather', onAskWeather) }
}

function describeCode(code) {
  if (code === 0) return 'שמיים בהירים'
  if (code <= 3)  return 'מעונן חלקית'
  if (code <= 49) return 'ערפל'
  if (code <= 69) return 'גשם'
  if (code <= 79) return 'שלג'
  if (code <= 99) return 'סופות'
  return 'לא ידוע'
}
