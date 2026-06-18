/**
 * payments/paywall.js — License checking and feature gating
 */

import { PREMIUM_FEATURES, PRO_FEATURES } from './license.json' assert { type: 'json' }

const LICENSE_KEY = 'teshuva_license'

export async function getLicense(storage) {
  return storage.get(LICENSE_KEY)
}

export async function setLicense(storage, licenseData) {
  await storage.set(LICENSE_KEY, licenseData)
}

export async function validateLicense(storage) {
  const license = await getLicense(storage)
  if (!license?.key) return { valid: false, tier: 'free' }
  if (license.expiresAt && Date.now() > license.expiresAt) {
    return { valid: false, tier: 'free', expired: true }
  }
  return { valid: true, tier: license.tier ?? 'premium' }
}

/**
 * canUse(featureId, tier) → boolean
 */
export function canUse(featureId, tier = 'free') {
  if (tier === 'pro')     return true
  if (tier === 'premium') return !PRO_FEATURES.includes(featureId)
  return !PREMIUM_FEATURES.includes(featureId) && !PRO_FEATURES.includes(featureId)
}

/**
 * gateFeature(featureId, tier, fn, onBlocked?)
 * Runs fn() if allowed, calls onBlocked() otherwise.
 */
export async function gateFeature(featureId, tier, fn, onBlocked) {
  if (canUse(featureId, tier)) {
    return fn()
  }
  if (onBlocked) onBlocked(featureId)
  return null
}

export async function revokeLicense(storage) {
  await storage.set(LICENSE_KEY, null)
}
