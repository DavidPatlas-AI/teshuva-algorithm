// StorageAdapter עבור Chrome Extension — עוטף את chrome.storage.local

export function createChromeAdapter() {
  return {
    get(key) {
      return new Promise(resolve => {
        chrome.storage.local.get(key, result => resolve(result[key] ?? null))
      })
    },
    set(key, value) {
      return new Promise(resolve => {
        chrome.storage.local.set({ [key]: value }, resolve)
      })
    },
  }
}
