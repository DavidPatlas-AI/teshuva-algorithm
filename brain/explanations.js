import { getCategory } from './categories.js'

export function greeting() {
  const hour = new Date().getHours()
  if (hour >= 5  && hour < 12) return 'בוקר טוב! ☀️'
  if (hour >= 12 && hour < 17) return 'צהריים טובים! 🌤️'
  if (hour >= 17 && hour < 21) return 'ערב טוב! 🌆'
  return 'לילה טוב! 🌙'
}

// הסבר עשיר למה פוסט מסוים מופיע — לפי עוצמה ותדירות
export function explain(categoryId, allTimeStats) {
  const cat = getCategory(categoryId)
  if (!cat) return null

  const label = cat.heLabel
  const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0) || 1
  const count = allTimeStats[categoryId] ?? 0
  const pct   = Math.round(count / total * 100)
  const seed  = count % 3

  // ── פעם ראשונה ─────────────────────────────────────────────
  if (count === 0) {
    return [
      `פעם ראשונה שאני רואה ${label} אצלך. האלגוריתם מתנסה — אם לא תעצור עליו, הוא ייעלם.`,
      `${label} — חדש בפיד שלך. ייתכן שמישהו שאתה עוקב אחריו שיתף משהו בנושא.`,
      `הפיד ניסה ${label} בפעם הראשונה. כל שנייה שתעצור עליו מלמדת אותו להמשיך.`,
    ][seed]
  }

  // ── שולט (40%+) ─────────────────────────────────────────────
  if (pct >= 40) {
    return [
      `${pct}% מהתוכן שלך הוא ${label}. האלגוריתם בנה לך "בועת ${label}" — כל לחיצה מגדילה אותה.`,
      `${label} שולט בפיד שלך (${pct}%). כנראה שהתחיל מפוסט אחד שעצרת עליו זמן רב.`,
      `הפיד שלך מוטה ${label} (${pct}%). האלגוריתם מניח שזה מה שאתה רוצה — האם הוא צודק?`,
    ][seed]
  }

  // ── חוזר (15-40%) ────────────────────────────────────────────
  if (pct >= 15) {
    return [
      `${label} מהווה ${pct}% מהפיד — נושא שחוזר. האלגוריתם מתחיל "לזכור" אותך כמי שמגיב ל${label}.`,
      `${pct}% ${label}. לא שולט אבל חוזר — הפלטפורמה בודקת עד כמה אתה מגיב.`,
      `האלגוריתם השקיע ${pct}% מהפיד שלך ב${label}. אם לא תגיב כלל — הוא יפחית.`,
    ][seed]
  }

  // ── נמוך (<15%) ──────────────────────────────────────────────
  return [
    `${label} מופיע לפעמים (${pct}%). האלגוריתם מנסה להבין אם יש פה פוטנציאל.`,
    `${pct}% בלבד מהפיד שלך הוא ${label} — הפלטפורמה בודקת אם זה תופס אצלך.`,
    `${label} בכמות קטנה (${pct}%). אם תעצור עליו — הכמות תגדל מהר.`,
  ][seed]
}

// תובנות שבועיות — לטאב "תובנות" בפופ-אפ
export function weeklyInsights(allTimeStats, historyStats = {}) {
  const insights = []
  const total = Object.values(allTimeStats).reduce((sum, n) => sum + n, 0)
  if (total === 0) return ['עוד לא צברת מספיק נתונים. המשך לגלול עם התוסף פעיל!']

  // קטגוריה שולטת
  const ranked = Object.entries(allTimeStats)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])

  const [topId, topCount] = ranked[0] ?? []
  if (topId) {
    const label = getCategory(topId)?.heLabel ?? topId
    const pct   = Math.round(topCount / total * 100)
    insights.push(`${pct}% מהתוכן שראית הוא <b>${label}</b>. האלגוריתם מניח שזה מה שאתה.`)
  }

  // קטגוריה שנייה
  const [secId, secCount] = ranked[1] ?? []
  if (secId) {
    const label = getCategory(secId)?.heLabel ?? secId
    const pct   = Math.round(secCount / total * 100)
    insights.push(`קטגוריה שנייה: <b>${label}</b> (${pct}%). ${pct > 20 ? 'גם פה יש בועה.' : 'עדיין לא שולטת.'}`)
  }

  // היסטוריה
  const socialVisits = Object.values(historyStats.socialCounts ?? {}).reduce((s, n) => s + n, 0)
  if (socialVisits > 0) {
    const perDay = Math.round(socialVisits / 7)
    insights.push(`ביקרת ברשתות חברתיות ${socialVisits.toLocaleString()} פעמים השבוע — כ-<b>${perDay} ביקורים ביום</b>.`)
  }

  if (historyStats.peakHour != null) {
    const h = historyStats.peakHour
    const period = h < 12 ? 'בוקר' : h < 17 ? 'אחר הצהריים' : h < 21 ? 'ערב' : 'לילה'
    insights.push(`אתה גולש הכי הרבה ב${period} (שעה ${h}:00). בדיוק אז האלגוריתם הכי ממוקד.`)
  }

  // אם יש מגוון רחב
  const activeCats = ranked.filter(([, n]) => n > 0).length
  if (activeCats >= 5) {
    insights.push(`הפיד שלך מכסה <b>${activeCats} קטגוריות</b> — יחסית מגוון. אבל ${getCategory(topId)?.heLabel} עדיין שולטת.`)
  } else if (activeCats <= 2 && activeCats > 0) {
    insights.push(`הפיד שלך מרוכז ב-${activeCats} קטגוריות בלבד. האלגוריתם הצר את התמונה עליך.`)
  }

  return insights
}
