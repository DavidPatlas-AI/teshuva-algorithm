/**
 * enterprise/permissions.js — Role-based access control
 */

const ROLES = {
  viewer:      ['read:analytics', 'read:users'],
  editor:      ['read:analytics', 'read:users', 'write:policies'],
  admin:       ['read:analytics', 'read:users', 'write:policies', 'write:users', 'read:audit'],
  'super-admin': ['*'],
}

export function createPermissionEngine(storage) {
  let currentRole = 'viewer'

  return {
    async load() {
      const saved = await storage.get('enterprise_role')
      currentRole = saved ?? 'viewer'
    },

    getRole() {
      return currentRole
    },

    can(permission) {
      const perms = ROLES[currentRole] ?? []
      return perms.includes('*') || perms.includes(permission)
    },

    require(permission) {
      if (!this.can(permission)) {
        throw new Error(`[permissions] Access denied: ${permission} (role: ${currentRole})`)
      }
    },

    // Guard a function — throws if not permitted
    guard(permission, fn) {
      this.require(permission)
      return fn()
    },

    getAllPermissions() {
      const perms = ROLES[currentRole] ?? []
      if (perms.includes('*')) return Object.values(ROLES).flat()
      return perms
    },
  }
}

export { ROLES }
