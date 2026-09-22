import { postJson, request } from './client.js'

export function extractFromUrl(url) {
  return postJson('/recipes/from-url', { url })
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
