import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AuthPage from './AuthPage.jsx'
import { register, forgotPassword } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  login: vi.fn(),
  register: vi.fn(),
  resendVerification: vi.fn(),
  forgotPassword: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('starts on the login view', () => {
  render(<AuthPage onLoggedIn={() => {}} />)
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
})

test('registering shows the check-your-email view with the submitted address', async () => {
  register.mockResolvedValue({ email: 'me@example.com' })
  const user = userEvent.setup()

  render(<AuthPage onLoggedIn={() => {}} />)

  await user.click(screen.getByRole('button', { name: /create an account/i }))
  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.type(screen.getByLabelText(/password/i), 'longpassword1')
  await user.click(screen.getByRole('button', { name: /create account/i }))

  expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
  expect(screen.getByText('me@example.com')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /back to log in/i }))
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument()
})

test('submitting the forgot-password form shows the check-your-email view', async () => {
  forgotPassword.mockResolvedValue(null)
  const user = userEvent.setup()

  render(<AuthPage onLoggedIn={() => {}} />)

  await user.click(screen.getByRole('button', { name: /forgot password/i }))
  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.click(screen.getByRole('button', { name: /send reset link/i }))

  expect(await screen.findByText(/check your email/i)).toBeInTheDocument()
})
