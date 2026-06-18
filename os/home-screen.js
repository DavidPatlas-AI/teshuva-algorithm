/**
 * os/home-screen.js — Home screen bootstrap
 *
 * Loads all OS components and wires them together.
 * Runs in the context of home-screen.html (desktop Electron or browser).
 */

import { createWindowManager } from './window-manager.js'
import { createNotifications }  from './notifications.js'
import { createControlCenter }  from './control-center.js'
import { createLauncher }       from './launcher.js'
import { createClockWidget }    from './widgets/widget-clock.js'
import { createStatsWidget }    from './widgets/widget-stats.js'
import { createInsightsWidget } from './widgets/widget-insights.js'
import { createShortcutsWidget } from './widgets/widget-shortcuts.js'
import { createNotesApp }       from '../apps/notes/notes.js'
import { createTasksApp }       from '../apps/tasks/tasks.js'
import { createInsightsApp }    from '../apps/insights/insights.js'
import { createSettingsApp }    from '../apps/settings/settings.js'
import { createFileSystem }     from './file-system.js'
import { createTaskManager }    from '../assistant/tasks.js'

;(async () => {
  // ── Storage adapter (localStorage for home screen) ───────────
  const storage = {
    get: k => Promise.resolve(JSON.parse(localStorage.getItem(k) ?? 'null')),
    set: (k, v) => { localStorage.setItem(k, JSON.stringify(v)) },
  }

  // ── OS Components ────────────────────────────────────────────
  const wm      = createWindowManager()
  const notif   = createNotifications()
  const control = createControlCenter(storage)
  const fs      = createFileSystem(storage)
  const tasks   = createTaskManager(storage)

  await Promise.all([control.load(), fs.load(), tasks.load()])

  // ── Launcher + Apps ──────────────────────────────────────────
  // brain is not available in standalone home-screen — use stub
  const brainStub = {
    getStats: () => ({ allTime: {}, weights: {}, total: 0, categories: {}, ids: [] }),
    intent:   () => ({ heText: '' }),
    greeting: () => `שלום! 😊`,
    weeklyInsights: () => [],
    reset:    async () => {},
  }

  const launcher = createLauncher(wm, [])
  const notesApp    = createNotesApp(wm, fs)
  const tasksApp    = createTasksApp(wm, tasks)
  const insightsApp = createInsightsApp(wm, brainStub)
  const settingsApp = createSettingsApp(wm, control, brainStub)

  // ── Widgets ──────────────────────────────────────────────────
  const widgetArea = document.getElementById('widget-area')
  createClockWidget(widgetArea)
  createStatsWidget(widgetArea, brainStub)
  createInsightsWidget(widgetArea, brainStub)
  createShortcutsWidget(widgetArea)

  // ── Taskbar clock ─────────────────────────────────────────────
  const clock = document.getElementById('taskbar-clock')
  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
  }, 1000)

  // ── Taskbar buttons ───────────────────────────────────────────
  document.getElementById('btn-launcher')?.addEventListener('click', () => launcher.toggle())
  document.getElementById('btn-notes')?.addEventListener('click',    () => notesApp.open())
  document.getElementById('btn-tasks')?.addEventListener('click',    () => tasksApp.open())
  document.getElementById('btn-settings')?.addEventListener('click', () => settingsApp.open())
  document.getElementById('btn-agent')?.addEventListener('click',    () => {
    notif.agent(brainStub.greeting())
  })

  // ── Initial notification ──────────────────────────────────────
  setTimeout(() => notif.agent('ברוך הבא ל-Teshuva OS! 📎'), 800)
})()
