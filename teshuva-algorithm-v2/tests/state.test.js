// tests/state.test.js
// בדיקות ל-brain/state.js — משתמשים ב-in-memory adapter בלבד

import { createState } from '../brain/state.js'

// ── Storage adapter מדומה (in-memory) ────────────────────────
function memoryAdapter() {
  const store = {}
  return {
    get: (key)        => Promise.resolve(store[key] ?? null),
    set: (key, value) => { store[key] = value; return Promise.resolve() },
  }
}

// ── load ─────────────────────────────────────────────────────

test('load — state ריק מאתחל ברירות מחדל', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  const all = state.getAllTimeStats()
  expect(typeof all).toBe('object')
  expect(all.politics).toBe(0)
})

test('load — טוען נתונים שמורים', async () => {
  const adapter = memoryAdapter()
  await adapter.set('teshuva_state', { allTime: { sports: 7 }, weights: { sports: 1.5 } })

  const state = createState(adapter)
  await state.load()
  expect(state.getAllTimeStats().sports).toBe(7)
  expect(state.getWeights().sports).toBe(1.5)
})

// ── observe ───────────────────────────────────────────────────

test('observe — מגדיל session ו-allTime', async () => {
  const state = createState(memoryAdapter())
  await state.load()

  state.observe('politics')
  state.observe('politics')
  state.observe('sports')

  expect(state.getSessionStats().politics).toBe(2)
  expect(state.getAllTimeStats().politics).toBe(2)
  expect(state.getAllTimeStats().sports).toBe(1)
})

test('getSessionTotal — סכום כל הסשן', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  state.observe('politics')
  state.observe('sports')
  state.observe('sports')
  expect(state.getSessionTotal()).toBe(3)
})

// ── signals ───────────────────────────────────────────────────

test('positiveSignal — מגדיל weight', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  const before = state.getWeights().politics
  state.positiveSignal('politics')
  expect(state.getWeights().politics).toBeGreaterThan(before)
})

test('negativeSignal — מקטין weight', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  const before = state.getWeights().sports
  state.negativeSignal('sports')
  expect(state.getWeights().sports).toBeLessThan(before)
})

test('weight לא עולה על 3.0', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  for (let i = 0; i < 30; i++) state.positiveSignal('politics')
  expect(state.getWeights().politics).toBeLessThanOrEqual(3.0)
})

test('weight לא יורד מתחת ל-0.1', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  for (let i = 0; i < 30; i++) state.negativeSignal('sports')
  expect(state.getWeights().sports).toBeGreaterThanOrEqual(0.1)
})

// ── reset ─────────────────────────────────────────────────────

test('reset — מאפס הכל', async () => {
  const state = createState(memoryAdapter())
  await state.load()
  state.observe('politics')
  state.positiveSignal('politics')
  await state.reset()
  expect(state.getAllTimeStats().politics).toBe(0)
  expect(state.getWeights().politics).toBe(1.0)
})
