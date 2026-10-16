// Shared with every form that hits the login throttle (see ../../../README.md:
// login, register, forgot/reset-password and the sensitive account actions
// below all share the same 429 + Retry-After behavior).
export function retryAfterMessage(seconds) {
  if (!seconds) return 'Too many attempts. Please try again later.'
  const minutes = Math.ceil(seconds / 60)
  return `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
}
