import { postJson, request } from './client.js'

export function extractFromUrl(url) {
  return postJson('/recipes/from-url', { url })
}

// POST /recipes: manual entry, no LLM/scraping involved. ingredients is a
// list of { name, quantity, unit } — quantity/unit are optional per item.
export function createManualRecipe({ title, ingredients }) {
  return postJson('/recipes', { title, ingredients })
}

export function extractFromText(query) {
  return postJson('/recipes/from-text', { query })
}

export function extractFromFile(file) {
  const body = new FormData()
  body.append('file', file)
  // No Content-Type header: the browser sets the multipart boundary itself.
  return request('/recipes/from-file', { method: 'POST', body })
}
