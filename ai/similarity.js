import { textToVector } from './embedding.js'

/**
 * cosineSimilarity(a, b) → number in [-1, 1]
 * Both a and b must be Float32Array of same length.
 */
export function cosineSimilarity(a, b) {
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return dot  // already L2-normalized in embedding.js
}

/**
 * findSimilar(queryText, corpus, threshold?) → { text, score }[]
 * corpus: string[]
 * Returns matches above threshold (default 0.4), sorted by score desc.
 */
export function findSimilar(queryText, corpus, threshold = 0.4) {
  const qVec = textToVector(queryText)
  return corpus
    .map(text => ({ text, score: cosineSimilarity(qVec, textToVector(text)) }))
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
}

/**
 * detectRecurringPatterns(history) → string[]
 * history: string[] of recent post texts
 * Returns representative texts of recurring clusters.
 */
export function detectRecurringPatterns(history) {
  if (history.length < 3) return []
  const vectors = history.map(textToVector)
  const clusters = simpleClustering(vectors, 0.5)
  return clusters
    .filter(c => c.indices.length >= 2)
    .map(c => history[c.centroidIdx])
}

// ── Internal ────────────────────────────────────────────────

function simpleClustering(vectors, threshold) {
  const assigned = new Array(vectors.length).fill(-1)
  const clusters = []

  for (let i = 0; i < vectors.length; i++) {
    if (assigned[i] !== -1) continue
    const cluster = { indices: [i], centroidIdx: i }
    for (let j = i + 1; j < vectors.length; j++) {
      if (assigned[j] !== -1) continue
      if (cosineSimilarity(vectors[i], vectors[j]) >= threshold) {
        cluster.indices.push(j)
        assigned[j] = clusters.length
      }
    }
    assigned[i] = clusters.length
    clusters.push(cluster)
  }
  return clusters
}
