// Thin fetch wrapper. Paths are relative to /api, which Vite proxies to the backend.
const BASE = '/api'
const UNAUTHORIZED_EVENT = 'pantrypal:unauthorized'

// The backend's CSRF cookie. Every non-GET request must echo its value back
// in the X-XSRF-TOKEN header or get a 403 (see ../../README.md's "Accounts
// and login"). GET /auth/csrf sets it; any other response refreshes it too.
function readCsrfCookie() {
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export async function request(path, options = {}) {
  const method = options.method ?? 'GET'
  const headers = { ...options.headers }

  if (method !== 'GET') {
    const csrfToken = readCsrfCookie()
    if (csrfToken) {
      headers['X-XSRF-TOKEN'] = csrfToken
    }
  }

  const response = await fetch(`${BASE}${path}`, { ...options, headers })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    const error = new Error(message || `Request failed with status ${response.status}`)
    error.status = response.status
    // Session expired or never existed: let the app fall back to the login
    // page from wherever the call happened, instead of every caller having
    // to special-case 401 itself.
    if (response.status === 401) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After'))
      error.retryAfterSeconds = Number.isFinite(retryAfter) ? retryAfter : null
    }
    throw error
  }
  if (response.status === 204) {
    return null
  }
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export function onUnauthorized(callback) {
  window.addEventListener(UNAUTHORIZED_EVENT, callback)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, callback)
}

export function postJson(path, body) {
  return request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function patchJson(path, body) {
  return request(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function deleteResource(path) {
  return request(path, { method: 'DELETE' })
}
