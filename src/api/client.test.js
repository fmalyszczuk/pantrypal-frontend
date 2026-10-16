import { vi } from 'vitest'
import { request, postJson, onUnauthorized } from './client.js'

function mockFetchOnce(response) {
  global.fetch = vi.fn().mockResolvedValue(response)
}

function jsonResponse(body, { status = 200, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name] ?? null },
    text: () => Promise.resolve(JSON.stringify(body)),
  }
}

function textResponse(body, { status = 200, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => headers[name] ?? null },
    text: () => Promise.resolve(body),
  }
}

beforeEach(() => {
  document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC'
})

test('GET requests do not send a CSRF header', async () => {
  document.cookie = 'XSRF-TOKEN=test-token'
  mockFetchOnce(jsonResponse({ id: 1 }))

  await request('/auth/me')

  const [, options] = fetch.mock.calls[0]
  expect(options.headers['X-XSRF-TOKEN']).toBeUndefined()
})

test('non-GET requests send the CSRF token from the cookie', async () => {
  document.cookie = 'XSRF-TOKEN=test-token'
  mockFetchOnce(textResponse('', { status: 204 }))

  await postJson('/auth/logout', {})

  const [, options] = fetch.mock.calls[0]
  expect(options.headers['X-XSRF-TOKEN']).toBe('test-token')
})

test('a non-ok response throws an error tagged with the HTTP status', async () => {
  mockFetchOnce(textResponse('Invalid email or password', { status: 401 }))

  await expect(request('/auth/login', { method: 'POST' })).rejects.toMatchObject({
    message: 'Invalid email or password',
    status: 401,
  })
})

test('a 429 response carries the Retry-After seconds', async () => {
  mockFetchOnce(
    textResponse('Too many attempts. Try again later.', {
      status: 429,
      headers: { 'Retry-After': '120' },
    }),
  )

  await expect(request('/auth/login', { method: 'POST' })).rejects.toMatchObject({
    status: 429,
    retryAfterSeconds: 120,
  })
})

test('a 401 response notifies onUnauthorized listeners', async () => {
  mockFetchOnce(textResponse('Authentication required', { status: 401 }))
  const listener = vi.fn()
  const unsubscribe = onUnauthorized(listener)

  await request('/shopping-list').catch(() => {})

  expect(listener).toHaveBeenCalled()
  unsubscribe()
})
