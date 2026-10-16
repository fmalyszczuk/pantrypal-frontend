import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ResetPasswordPage from './ResetPasswordPage.jsx'
import { resetPassword } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  resetPassword: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('submits the new password with the token from the URL', async () => {
  window.history.pushState({}, '', '/reset-password?token=abc123')
  resetPassword.mockResolvedValue(null)
  const user = userEvent.setup()

  render(<ResetPasswordPage />)

  const input = await screen.findByLabelText(/new password/i)
  await user.type(input, 'newlongpassword1')
  await user.click(screen.getByRole('button', { name: /reset password/i }))

  expect(resetPassword).toHaveBeenCalledWith({ token: 'abc123', newPassword: 'newlongpassword1' })
  expect(await screen.findByText(/password has been changed/i)).toBeInTheDocument()
  expect(window.location.search).toBe('')
})

test('shows the backend error on failure', async () => {
  window.history.pushState({}, '', '/reset-password?token=abc123')
  resetPassword.mockRejectedValue(new Error('The link is invalid or has expired'))
  const user = userEvent.setup()

  render(<ResetPasswordPage />)

  const input = await screen.findByLabelText(/new password/i)
  await user.type(input, 'newlongpassword1')
  await user.click(screen.getByRole('button', { name: /reset password/i }))

  expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument()
})

test('shows a message when the URL has no token', async () => {
  window.history.pushState({}, '', '/reset-password')

  render(<ResetPasswordPage />)

  expect(await screen.findByText(/missing its token/i)).toBeInTheDocument()
})
