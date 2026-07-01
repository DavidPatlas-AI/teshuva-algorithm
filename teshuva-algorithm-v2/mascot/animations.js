// קבוצות אנימציה לפי mood — Clippy animation names from clippyjs

const MOOD_ANIMATIONS = {
  greet:    ['Wave', 'Greeting'],
  think:    ['Thinking', 'LookDown'],
  excited:  ['Congratulate', 'Wave'],
  confused: ['LookLeft', 'LookRight'],
  idle:     ['IdleRopePile', 'IdleFingerTap'],
}

// בחר mood לפי weight קטגוריה (1.0 = ניטרלי)
export function pickMood(weight) {
  if (weight >= 2.0) return 'excited'
  if (weight <= 0.3) return 'confused'
  return 'idle'
}

// הפעל אנימציה רנדומלית מה-mood המבוקש
export function playMood(mascot, mood = 'idle') {
  const list = MOOD_ANIMATIONS[mood] ?? MOOD_ANIMATIONS.idle
  const name = list[Math.floor(Math.random() * list.length)]
  mascot.animate(name)
}
