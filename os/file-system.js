/**
 * os/file-system.js — Sandboxed virtual file system
 *
 * All "files" are stored in chrome.storage.local / localStorage.
 * Provides a path-like interface without actual filesystem access.
 */

const FS_KEY = 'teshuva_os_fs'

export function createFileSystem(storage) {
  let vfs = {}  // { 'path/to/file': { content, updatedAt } }

  return {
    async load() {
      const saved = await storage.get(FS_KEY)
      vfs = saved ?? {}
    },

    async read(path) {
      return vfs[normalize(path)]?.content ?? null
    },

    async write(path, content) {
      vfs[normalize(path)] = { content, updatedAt: Date.now() }
      await storage.set(FS_KEY, vfs)
    },

    async delete(path) {
      delete vfs[normalize(path)]
      await storage.set(FS_KEY, vfs)
    },

    async exists(path) {
      return normalize(path) in vfs
    },

    // List files under a prefix
    list(prefix = '') {
      const norm = normalize(prefix)
      return Object.keys(vfs)
        .filter(k => k.startsWith(norm))
        .map(k => ({ path: k, updatedAt: vfs[k].updatedAt }))
    },

    async readJSON(path) {
      const raw = await this.read(path)
      if (!raw) return null
      try { return JSON.parse(raw) } catch { return null }
    },

    async writeJSON(path, obj) {
      await this.write(path, JSON.stringify(obj, null, 2))
    },

    async reset() {
      vfs = {}
      await storage.set(FS_KEY, vfs)
    },
  }
}

function normalize(path) {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/^\//, '')
}
