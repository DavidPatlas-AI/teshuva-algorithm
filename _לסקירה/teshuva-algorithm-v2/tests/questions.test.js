// tests/questions.test.js
// בדיקות ל-brain/questions.js — factory, ללא module-level state

import { createQuestions } from '../brain/questions.js'

test('shouldAsk — false כשספירה נמוכה מסף', () => {
  const q = createQuestions()
  expect(q.shouldAsk('sports', 3)).toBe(false)
})

test('shouldAsk — true כשספירה מספיקה', () => {
  const q = createQuestions()
  // מדמים שעבר מספיק זמן (lastAskedAt = 0 בברירת מחדל)
  expect(q.shouldAsk('sports', 5)).toBe(true)
})

test('shouldAsk — false אחרי markAsked', () => {
  const q = createQuestions()
  q.markAsked('sports')
  expect(q.shouldAsk('sports', 10)).toBe(false)
})

test('shouldAsk — false עבור קטגוריה שלא נשאלה אחרי markAsked של אחרת', () => {
  const q = createQuestions()
  q.markAsked('politics')
  // ה-cooldown עדיין פעיל, גם sports לא יתאים
  expect(q.shouldAsk('sports', 10)).toBe(false)
})

test('instance נפרד — state לא משתף', () => {
  const q1 = createQuestions()
  const q2 = createQuestions()
  q1.markAsked('sports')
  // q2 לא מושפע
  expect(q2.shouldAsk('sports', 5)).toBe(true)
})

test('build — מחזיר שאלה תקינה', () => {
  const q      = createQuestions()
  const result = q.build('sports')
  expect(result).not.toBeNull()
  expect(result.categoryId).toBe('sports')
  expect(typeof result.text).toBe('string')
  expect(typeof result.answers.yes).toBe('string')
  expect(typeof result.answers.no).toBe('string')
})

test('build — null לקטגוריה לא קיימת', () => {
  const q = createQuestions()
  expect(q.build('not-a-real-category')).toBeNull()
})

test('whyDoISeeThis — מחזיר מחרוזת עברית', () => {
  const q    = createQuestions()
  const text = q.whyDoISeeThis('sports', { sports: 10, politics: 5 })
  expect(typeof text).toBe('string')
  expect(text.length).toBeGreaterThan(10)
})
