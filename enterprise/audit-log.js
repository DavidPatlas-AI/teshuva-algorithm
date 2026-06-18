/**
 * enterprise/audit-log.js — Immutable audit trail for enterprise actions
 */

const AUDIT_KEY    = 'teshuva_audit'
const MAX_ENTRIES  = 1000
const RETENTION_MS = 2 * 365 * 24 * 60 * 60_000  // 2 years

export function createAuditLog(storage) {
  let entries = []

  return {
    async load() {
      const saved = await storage.get(AUDIT_KEY)
      entries = (saved?.entries ?? []).filter(
        e => Date.now() - e.ts <= RETENTION_MS
      )
    },

    // Log a new action
    log(action, actor, details = {}) {
      const entry = {
        id:     crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        action,
        actor,
        details,
        ts: Date.now(),
      }
      entries.push(entry)
      if (entries.length > MAX_ENTRIES) entries.shift()
      return entry
    },

    // Query entries
    query({ action, actor, from, to, limit = 100 } = {}) {
      let results = [...entries]
      if (action) results = results.filter(e => e.action === action)
      if (actor)  results = results.filter(e => e.actor  === actor)
      if (from)   results = results.filter(e => e.ts >= from)
      if (to)     results = results.filter(e => e.ts <= to)
      return results.slice(-limit)
    },

    async save() {
      await storage.set(AUDIT_KEY, { entries })
    },

    // Export for compliance reporting
    exportCSV() {
      const header = 'id,action,actor,details,timestamp'
      const rows   = entries.map(e =>
        `${e.id},${e.action},${e.actor},${JSON.stringify(e.details)},${new Date(e.ts).toISOString()}`
      )
      return [header, ...rows].join('\n')
    },
  }
}

// Standard action names
export const AUDIT_ACTIONS = {
  USER_LOGIN:       'user.login',
  USER_LOGOUT:      'user.logout',
  POLICY_CHANGE:    'policy.change',
  LICENSE_ISSUE:    'license.issue',
  LICENSE_REVOKE:   'license.revoke',
  DATA_EXPORT:      'data.export',
  DATA_DELETE:      'data.delete',
  ADMIN_ROLE_SET:   'admin.role.set',
  SETTINGS_CHANGE:  'settings.change',
}
