// tests/classifier.test.js
// בדיקות ל-brain/classifier.js — ללא תלות ב-DOM או Chrome API

import { classify, scoreText } from '../brain/classifier.js'

// ── scoreText ─────────────────────────────────────────────────

test('scoreText — טקסט קצר מדי מחזיר {}', () => {
  expect(scoreText('כן')).toEqual({})
  expect(scoreText('')).toEqual({})
  expect(scoreText(null)).toEqual({})
})

test('scoreText — מזהה מילת מפתח עברית', () => {
  const scores = scoreText('היום בכנסת הצביעו על חוק חדש')
  expect(scores.politics).toBeGreaterThan(0)
})

test('scoreText — מזהה מילת מפתח אנגלית', () => {
  const scores = scoreText('The NBA finals were incredible last night basketball score')
  expect(scores.sports).toBeGreaterThan(0)
})

test('scoreText — כמה קטגוריות אפשריות', () => {
  const scores = scoreText('AI startup raises money on the stock market economy tech')
  expect(scores.technology).toBeGreaterThan(0)
  expect(scores.economy).toBeGreaterThan(0)
})

// ── classify ─────────────────────────────────────────────────

test('classify — טקסט ריק מחזיר uncategorized', () => {
  expect(classify('')).toBe('uncategorized')
  expect(classify('שלום')).toBe('uncategorized')
})

test('classify — מחזיר הקטגוריה הכי חזקה', () => {
  expect(classify('כדורגל גול מכבי ליגה אליפות')).toBe('sports')
  expect(classify('election government president vote congress')).toBe('politics')
  expect(classify('AI chatgpt openai software developer')).toBe('technology')
})

test('classify — עברית ואנגלית ביחד', () => {
  const result = classify('בינה מלאכותית AI startup חברת טק')
  expect(result).toBe('technology')
})

test('classify — מחזיר uncategorized כשאין התאמה', () => {
  expect(classify('Lorem ipsum dolor sit amet consectetur')).toBe('uncategorized')
})
