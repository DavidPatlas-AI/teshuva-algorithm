// tests/brain.test.js
// בדיקות integration ל-brain-api.js — עם memory adapter

import { createBrain } from '../brain/brain-api.js'

function memoryAdapter() {
  const store = {}
  return {
    get: (key)        => Promise.resolve(store[key] ?? null),
    set: (key, value) => { store[key] = value; return Promise.resolve() },
  }
}

function makeBrain() {
  return createBrain(memoryAdapter())
}

// ── load + observe ────────────────────────────────────────────

test('load — מחזיר Promise', async () => {
  const brain = makeBrain()
  await expect(brain.load()).resolves.not.toThrow()
})

test('observe — מחזיר categoryId', async () => {
  const brain = makeBrain()
  await brain.load()
  const id = brain.observe('בחירות כנסת ממשלה פוליטי')
  expect(typeof id).toBe('string')
  expect(id).toBe('politics')
})

test('observe — uncategorized לטקסט לא מזוהה', async () => {
  const brain = makeBrain()
  await brain.load()
  expect(brain.observe('   ')).toBe('uncategorized')
  expect(brain.observe('aaaa bbbb cccc dddd eeee')).toBe('uncategorized')
})

// ── getStats ──────────────────────────────────────────────────

test('getStats — מחזיר מבנה תקין', async () => {
  const brain = makeBrain()
  await brain.load()
  const stats = brain.getStats()
  expect(stats).toHaveProperty('session')
  expect(stats).toHaveProperty('allTime')
  expect(stats).toHaveProperty('weights')
  expect(stats).toHaveProperty('total')
  expect(stats).toHaveProperty('categories')
  expect(stats).toHaveProperty('ids')
})

test('getStats.total — עולה עם כל observe', async () => {
  const brain = makeBrain()
  await brain.load()
  brain.observe('כדורגל גול מכבי ליגה')
  brain.observe('election government vote democrat')
  expect(brain.getStats().total).toBe(2)
})

// ── explain ───────────────────────────────────────────────────

test('explain — מחזיר מחרוזת', async () => {
  const brain = makeBrain()
  await brain.load()
  brain.observe('כדורגל גול מכבי ליגה')
  const text = brain.explain('sports')
  expect(typeof text).toBe('string')
  expect(text.length).toBeGreaterThan(5)
})

// ── intent ────────────────────────────────────────────────────

test('intent — מחזיר אובייקט עם type ו-heText', async () => {
  const brain = makeBrain()
  await brain.load()
  const intent = brain.intent('sports')
  expect(intent).toHaveProperty('type')
  expect(intent).toHaveProperty('heText')
  expect(intent).toHaveProperty('percentage')
  expect(intent).toHaveProperty('categoryId', 'sports')
})

test('intent.type — first-time כשאין נתונים', async () => {
  const brain = makeBrain()
  await brain.load()
  expect(brain.intent('religion').type).toBe('first-time')
})

// ── positive / negative ───────────────────────────────────────

test('positive — מגדיל weight', async () => {
  const brain = makeBrain()
  await brain.load()
  const before = brain.getStats().weights.politics
  brain.positive('politics')
  expect(brain.getStats().weights.politics).toBeGreaterThan(before)
})

test('negative — מקטין weight', async () => {
  const brain = makeBrain()
  await brain.load()
  const before = brain.getStats().weights.sports
  brain.negative('sports')
  expect(brain.getStats().weights.sports).toBeLessThan(before)
})

// ── greeting ──────────────────────────────────────────────────

test('greeting — מחזיר מחרוזת עברית', async () => {
  const brain = makeBrain()
  await brain.load()
  const g = brain.greeting()
  expect(typeof g).toBe('string')
  expect(g.length).toBeGreaterThan(3)
})

// ── reset ─────────────────────────────────────────────────────

test('reset — מאפס stats', async () => {
  const brain = makeBrain()
  await brain.load()
  brain.observe('כדורגל גול מכבי')
  await brain.reset()
  expect(brain.getStats().total).toBe(0)
})
