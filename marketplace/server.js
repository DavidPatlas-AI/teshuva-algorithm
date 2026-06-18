/**
 * marketplace/server.js — Marketplace server (Node.js / Express)
 *
 * Handles extension upload, developer authentication, and listing.
 * Requires: express, jsonwebtoken, multer, mongoose (or any DB)
 *
 * Run: node marketplace/server.js
 */

// const express = require('express')
// const jwt     = require('jsonwebtoken')
// const multer  = require('multer')

const PORT     = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production'

/**
 * Routes:
 *
 * POST /auth/register        — developer registration
 * POST /auth/login           — login → JWT
 *
 * GET  /items                — list items (query: category, page, q)
 * GET  /items/:id            — single item
 * POST /items                — upload new item (auth required)
 * PUT  /items/:id            — update item (auth + owner)
 * DELETE /items/:id          — remove item (auth + owner or admin)
 *
 * POST /items/:id/ratings    — submit rating
 * GET  /items/:id/ratings    — get ratings
 *
 * POST /updates              — check updates for installed items
 * POST /items/:id/report     — report item
 */

// ── Auth Middleware ──────────────────────────────────────────

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  try {
    req.user = /* jwt.verify(token, JWT_SECRET) */ { id: 'mock', role: 'developer' }
    next()
  } catch {
    res.status(401).json({ error: 'invalid token' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'forbidden' })
  next()
}

// ── Item validation ──────────────────────────────────────────

function validateManifest(manifest) {
  const required = ['id', 'name', 'version', 'category', 'entry', 'author']
  const missing  = required.filter(k => !manifest[k])
  if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`)
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error('Invalid version format')
  return true
}

// ── Export for testing ───────────────────────────────────────

module.exports = { requireAuth, requireAdmin, validateManifest, PORT }

// ── Start server (uncomment to run) ─────────────────────────
// const app = express()
// app.use(express.json())
// app.listen(PORT, () => console.log(`Marketplace server on :${PORT}`))
