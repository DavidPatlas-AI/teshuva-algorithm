/**
 * marketplace/payments.js — Developer revenue sharing
 *
 * Tracks sales, calculates developer payouts (70/30 split),
 * and prepares payout reports.
 */

const DEVELOPER_SHARE = 0.70  // 70% to developer, 30% to platform

export function createMarketplacePayments(storage) {
  const SALES_KEY = 'teshuva_marketplace_sales'
  let sales = []  // { id, itemId, developerId, amount, tier, ts }[]

  return {
    async load() {
      const saved = await storage.get(SALES_KEY)
      sales = saved?.sales ?? []
    },

    // Record a sale
    async recordSale(itemId, developerId, amount, tier = 'premium') {
      const sale = {
        id:          `sale-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        itemId,
        developerId,
        amount,
        tier,
        ts:          Date.now(),
        settled:     false,
      }
      sales.push(sale)
      await storage.set(SALES_KEY, { sales })
      return sale
    },

    // Calculate payout for a developer (unsettled sales)
    calculatePayout(developerId) {
      const devSales = sales.filter(s => s.developerId === developerId && !s.settled)
      const gross    = devSales.reduce((sum, s) => sum + s.amount, 0)
      const net      = Math.round(gross * DEVELOPER_SHARE * 100) / 100
      return {
        developerId,
        saleCount:   devSales.length,
        grossAmount: gross,
        developerShare: DEVELOPER_SHARE,
        payoutAmount: net,
        platformFee:  Math.round((gross - net) * 100) / 100,
        currency:     'ILS',
      }
    },

    // Mark sales as settled after payout
    async settlePayout(developerId) {
      let count = 0
      for (const sale of sales) {
        if (sale.developerId === developerId && !sale.settled) {
          sale.settled = true
          count++
        }
      }
      await storage.set(SALES_KEY, { sales })
      return { settled: count }
    },

    // Monthly report
    getMonthlyReport(year, month) {
      const start = new Date(year, month - 1, 1).getTime()
      const end   = new Date(year, month, 1).getTime()
      const inPeriod = sales.filter(s => s.ts >= start && s.ts < end)
      const byDev = {}
      for (const s of inPeriod) {
        if (!byDev[s.developerId]) byDev[s.developerId] = { sales: 0, gross: 0 }
        byDev[s.developerId].sales++
        byDev[s.developerId].gross += s.amount
      }
      return {
        period:    `${year}-${String(month).padStart(2, '0')}`,
        totalSales: inPeriod.length,
        totalGross: inPeriod.reduce((s, r) => s + r.amount, 0),
        byDeveloper: byDev,
      }
    },
  }
}
