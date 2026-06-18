/**
 * marketplace/review-system.js — Ratings, comments, and reports
 */

export function createReviewSystem(storage) {
  const REVIEWS_KEY = 'teshuva_marketplace_reviews'
  let reviews = {}  // itemId → { ratings: [], reports: [] }

  return {
    async load() {
      const saved = await storage.get(REVIEWS_KEY)
      reviews = saved ?? {}
    },

    // Submit a rating (1–5 stars + optional comment)
    async rate(itemId, userId, stars, comment = '') {
      if (stars < 1 || stars > 5) throw new Error('stars must be 1–5')
      if (!reviews[itemId]) reviews[itemId] = { ratings: [], reports: [] }

      // Update existing rating if user already rated
      const existing = reviews[itemId].ratings.findIndex(r => r.userId === userId)
      const entry    = { userId, stars, comment: comment.slice(0, 280), ts: Date.now() }
      if (existing >= 0) {
        reviews[itemId].ratings[existing] = entry
      } else {
        reviews[itemId].ratings.push(entry)
      }

      await storage.set(REVIEWS_KEY, reviews)
      return this.getAggregated(itemId)
    },

    // Get aggregated stats for an item
    getAggregated(itemId) {
      const { ratings = [] } = reviews[itemId] ?? {}
      if (!ratings.length) return { count: 0, avg: 0, distribution: {} }
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      let sum = 0
      for (const { stars } of ratings) { sum += stars; distribution[stars]++ }
      return {
        count:        ratings.length,
        avg:          Math.round((sum / ratings.length) * 10) / 10,
        distribution,
        recent:       ratings.slice(-5).reverse(),
      }
    },

    // Report an item
    async report(itemId, userId, reason) {
      if (!reviews[itemId]) reviews[itemId] = { ratings: [], reports: [] }
      reviews[itemId].reports.push({ userId, reason, ts: Date.now() })
      await storage.set(REVIEWS_KEY, reviews)

      // Flag for manual review if 3+ reports
      return { flagged: reviews[itemId].reports.length >= 3 }
    },

    // Admin: get all flagged items
    getFlagged() {
      return Object.entries(reviews)
        .filter(([, v]) => v.reports.length >= 3)
        .map(([id, v]) => ({ itemId: id, reportCount: v.reports.length }))
    },
  }
}
