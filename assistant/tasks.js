/**
 * assistant/tasks.js — Task management and reminders
 */

const TASKS_KEY = 'teshuva_assistant_tasks'

export function createTaskManager(storage) {
  let tasks = []  // { id, title, dueAt, done, reminder, categoryId }[]

  return {
    async load() {
      const saved = await storage.get(TASKS_KEY)
      tasks = saved?.tasks ?? []
    },

    add(title, options = {}) {
      const task = {
        id:         `task-${Date.now()}`,
        title,
        dueAt:      options.dueAt ?? null,
        reminder:   options.reminderMs ?? null,
        categoryId: options.categoryId ?? null,
        done:       false,
        createdAt:  Date.now(),
      }
      tasks.push(task)
      return task
    },

    complete(id) {
      const t = tasks.find(t => t.id === id)
      if (t) t.done = true
      return t
    },

    remove(id) {
      tasks = tasks.filter(t => t.id !== id)
    },

    // Tasks due within the next N ms
    getDue(windowMs = 24 * 60 * 60_000) {
      const now = Date.now()
      return tasks.filter(t => !t.done && t.dueAt && t.dueAt - now <= windowMs)
    },

    getAll(includeDone = false) {
      return tasks.filter(t => includeDone || !t.done)
    },

    async save() {
      await storage.set(TASKS_KEY, { tasks })
    },

    async reset() {
      tasks = []
      await storage.set(TASKS_KEY, { tasks })
    },
  }
}
