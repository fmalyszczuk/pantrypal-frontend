// Thin fetch wrapper. Paths are relative to /api, which Vite proxies to the backend.
const BASE = '/api'

export async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, options)
  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || `Request failed with status ${response.status}`)
  }
  return response.json()
}

export function postJson(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
