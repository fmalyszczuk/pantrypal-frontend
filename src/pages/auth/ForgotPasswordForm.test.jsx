import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ForgotPasswordForm from './ForgotPasswordForm.jsx'
import { forgotPassword } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  forgotPassword: vi.fn(),
}))

const noop = () => {}

beforeEach(() => {
  vi.clearAllMocks()
})

test('submits the email and calls onSubmitted', async () => {
  forgotPassword.mockResolvedValue(null)
  const onSubmitted = vi.fn()
  const user = userEvent.setup()

  render(<ForgotPasswordForm onSubmitted={onSubmitted} onSwitchToLogin={noop} />)

  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.click(screen.getByRole('button', { name: /send reset link/i }))

  expect(forgotPassword).toHaveBeenCalledWith('me@example.com')
  expect(onSubmitted).toHaveBeenCalled()
})

test('shows an error message on failure', async () => {
  forgotPassword.mockRejectedValue(new Error('backend is down'))
  const user = userEvent.setup()

  render(<ForgotPasswordForm onSubmitted={noop} onSwitchToLogin={noop} />)

  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.click(screen.getByRole('button', { name: /send reset link/i }))

  expect(await screen.findByText(/backend is down/i)).toBeInTheDocument()
})

test('switches to the login view', async () => {
  const onSwitchToLogin = vi.fn()
  const user = userEvent.setup()

  render(<ForgotPasswordForm onSubmitted={noop} onSwitchToLogin={onSwitchToLogin} />)

  await user.click(screen.getByRole('button', { name: /back to log in/i }))

  expect(onSwitchToLogin).toHaveBeenCalled()
})
