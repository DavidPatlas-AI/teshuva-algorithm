import { getCategory } from './categories.js'

// ברכה לפי שעה ביום
export function greeting() {
  const hour = new Date().getHours()
  if (hour >= 5  && hour < 12) return 'בוקר טוב! ☀️'
  if (hour >= 12 && hour < 17) return 'צהריים טובים! 🌤️'
  if (hour >= 17 && hour < 21) return 'ערב טוב! 🌆'
  return 'לילה טוב! 🌙'
}

// הסבר למה הופיע תוכן של קטגוריה מסוימת
export function explain(categoryId, allTimeStats) {
  const cat = getCategory(categoryId)
  if (!cat) return null

  const label = cat.heLabel
  const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0) || 1
  const count = allTimeStats[categoryId] || 0
  const pct   = Math.round(count / total * 100)

  if (count === 0) return `זו הפעם הראשונה שאתה רואה ${label} — האלגוריתם מתנסה.`
  if (pct >= 40)   return `אתה רואה הרבה ${label} (${pct}% מהפיד שלך). האלגוריתם למד שזה מעניין אותך.`
  if (pct >= 15)   return `${label} מהווה ${pct}% מהתוכן שלך — נושא שחוזר אצלך.`
  return `${label} מופיע לפעמים (${pct}% מהפיד). האלגוריתם עדיין מנסה להבין אם זה רלוונטי לך.`
}

// תובנות שבועיות — מחרוזת אחת לכל תובנה
export function weeklyInsights(allTimeStats, historyStats = {}) {
  const insights = []
  const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0)
  if (total === 0) return ['עוד לא צברת מספיק נתונים. המשך לגלול!']

  // הקטגוריה שנצפתה הכי הרבה
  const top = Object.entries(allTimeStats)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])[0]

  if (top) {
    const label = getCategory(top[0])?.heLabel ?? top[0]
    const pct = Math.round(top[1] / total * 100)
    insights.push(`הנושא שאתה נחשף אליו הכי הרבה הוא ${label} — ${pct}% מהתוכן.`)
  }

  // כמה ביקורים ברשתות חברתיות
  const socialVisits = Object.values(historyStats.socialCounts ?? {}).reduce((s, n) => s + n, 0)
  if (socialVisits > 0) {
    insights.push(`ביקרת ברשתות חברתיות ${socialVisits.toLocaleString()} פעמים השבוע.`)
  }

  // שעת שיא
  if (historyStats.peakHour != null) {
    insights.push(`אתה גולש הכי הרבה בשעה ${historyStats.peakHour}:00.`)
  }

  return insights
}
