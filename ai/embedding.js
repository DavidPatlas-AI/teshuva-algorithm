/**
 * ai/embedding.js — Local vector embeddings (no external API)
 *
 * Uses TF-IDF-style bag-of-words with character n-grams.
 * Produces a fixed-length float32 vector for any Hebrew/English text.
 */

const VOCAB_SIZE = 512
const NGRAM_SIZE = 3

/**
 * textToVector(text) → Float32Array of length VOCAB_SIZE
 */
export function textToVector(text) {
  const normalized = text.toLowerCase().replace(/[^֐-׿a-z0-9 ]/g, ' ')
  const ngrams = extractNgrams(normalized, NGRAM_SIZE)
  const vec = new Float32Array(VOCAB_SIZE)
  for (const ng of ngrams) {
    const idx = hashNgram(ng) % VOCAB_SIZE
    vec[idx] += 1
  }
  return l2normalize(vec)
}

/**
 * vectorize(texts) → Float32Array[] — batch embedding
 */
export function vectorize(texts) {
  return texts.map(textToVector)
}

// ── Internal ────────────────────────────────────────────────

function extractNgrams(text, n) {
  const tokens = text.split(/\s+/).filter(Boolean)
  const ngrams = []
  for (const token of tokens) {
    for (let i = 0; i <= token.length - n; i++) {
      ngrams.push(token.slice(i, i + n))
    }
    // word unigrams too
    ngrams.push(token)
  }
  return ngrams
}

function hashNgram(ngram) {
  let h = 2166136261
  for (let i = 0; i < ngram.length; i++) {
    h ^= ngram.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

function l2normalize(vec) {
  let norm = 0
  for (const v of vec) norm += v * v
  norm = Math.sqrt(norm)
  if (norm === 0) return vec
  for (let i = 0; i < vec.length; i++) vec[i] /= norm
  return vec
}
