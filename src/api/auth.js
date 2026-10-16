import { request, postJson } from './client.js'

// 204, no body: just makes sure the XSRF-TOKEN cookie is set. Call once on
// startup, before anything else.
export function getCsrfToken() {
  return request('/auth/csrf')
}

// 200 { id, email } when logged in, or throws (status 401) when not.
export function getCurrentUser() {
  return request('/auth/me')
}

// 202 { email }, always — whether or not the address was already
// registered (see ../../README.md: sign-up can't be used to find out who
// has an account). Does not log the user in.
export function register({ email, password }) {
  return postJson('/auth/register', { email, password })
}

// 200 { id, email } + sets the session cookie. Throws (status 401) for any
// bad credentials, or (status 403) for a correct password on an
// unconfirmed address.
export function login({ email, password }) {
  return postJson('/auth/login', { email, password })
}

export function logout() {
  return request('/auth/logout', { method: 'POST' })
}

export function verifyEmail(token) {
  return postJson('/auth/verify-email', { token })
}

export function resendVerification(email) {
  return postJson('/auth/resend-verification', { email })
}

// 204, always — whether or not the address has an account.
export function forgotPassword(email) {
  return postJson('/auth/forgot-password', { email })
}

export function resetPassword({ token, newPassword }) {
  return postJson('/auth/reset-password', { token, newPassword })
}

// 204. Needs the current password again (400 "The password is incorrect"
// if wrong, not 401 — the user is still logged in). Logs out every other
// session of the user; this one stays logged in.
export function changePassword({ currentPassword, newPassword }) {
  return postJson('/auth/password', { currentPassword, newPassword })
}

// 204. Deletes the account and everything it owns, permanently, and logs
// out every session including this one. Needs the password (400 if wrong).
export function deleteAccount(password) {
  return postJson('/auth/delete-account', { password })
}
