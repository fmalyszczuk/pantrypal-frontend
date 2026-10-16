import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import VerifyEmailPage from './VerifyEmailPage.jsx'
import { verifyEmail } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  verifyEmail: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('confirms the token from the URL and strips it from the address bar', async () => {
  window.history.pushState({}, '', '/verify-email?token=abc123')
  verifyEmail.mockResolvedValue(null)

  render(<VerifyEmailPage />)

  expect(await screen.findByText(/your email is confirmed/i)).toBeInTheDocument()
  expect(verifyEmail).toHaveBeenCalledWith('abc123')
  expect(window.location.search).toBe('')
})

test('shows the backend error when the token is invalid or expired', async () => {
  window.history.pushState({}, '', '/verify-email?token=bad')
  verifyEmail.mockRejectedValue(new Error('The link is invalid or has expired'))

  render(<VerifyEmailPage />)

  expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument()
})

test('shows a message when the URL has no token', async () => {
  window.history.pushState({}, '', '/verify-email')

  render(<VerifyEmailPage />)

  expect(await screen.findByText(/missing its token/i)).toBeInTheDocument()
  expect(verifyEmail).not.toHaveBeenCalled()
})
