// StorageAdapter עבור Electron — שומר בקובץ JSON בתיקיית userData

import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'

export function createElectronAdapter() {
  const filePath = path.join(app.getPath('userData'), 'teshuva-state.json')

  async function readAll() {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }

  async function writeAll(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  return {
    async get(key) {
      const data = await readAll()
      return data[key] ?? null
    },
    async set(key, value) {
      const data = await readAll()
      if (value === null) {
        delete data[key]
      } else {
        data[key] = value
      }
      await writeAll(data)
    },
  }
}
