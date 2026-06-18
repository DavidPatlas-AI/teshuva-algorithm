/**
 * marketplace/api.js — Client API for Marketplace
 * All requests go through background.js to avoid CORS issues.
 */

const MARKETPLACE_BASE = 'https://marketplace.teshuva-algorithm.com/api/v1'

export const marketplaceApi = {
  // List items by category
  async list(category = 'skins', page = 1) {
    return fetchMarketplace(`/items?category=${category}&page=${page}`)
  },

  // Get single item
  async get(id) {
    return fetchMarketplace(`/items/${id}`)
  },

  // Search
  async search(query) {
    return fetchMarketplace(`/items?q=${encodeURIComponent(query)}`)
  },

  // Submit a rating
  async rate(id, stars, comment = '') {
    return fetchMarketplace('/ratings', {
      method: 'POST',
      body: JSON.stringify({ itemId: id, stars, comment }),
    })
  },

  // Download / install item
  async install(id) {
    const item = await this.get(id)
    if (!item?.downloadUrl) throw new Error('No download URL')
    // In extension context: fetch via background, store in extension storage
    return { id, name: item.name, downloadUrl: item.downloadUrl }
  },

  // Check for updates to installed items
  async checkUpdates(installedIds) {
    return fetchMarketplace('/updates', {
      method: 'POST',
      body: JSON.stringify({ ids: installedIds }),
    })
  },
}

async function fetchMarketplace(path, options = {}) {
  const url = MARKETPLACE_BASE + path
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`Marketplace API ${res.status}: ${url}`)
  return res.json()
}
