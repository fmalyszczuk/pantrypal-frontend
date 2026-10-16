import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import LoginForm from './LoginForm.jsx'
import { login, resendVerification } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  login: vi.fn(),
  resendVerification: vi.fn(),
}))

const noop = () => {}

beforeEach(() => {
  vi.clearAllMocks()
})

async function fillAndSubmit(user, { email = 'me@example.com', password = 'longpassword1' } = {}) {
  await user.type(screen.getByLabelText(/email/i), email)
  await user.type(screen.getByLabelText(/password/i), password)
  await user.click(screen.getByRole('button', { name: /log in/i }))
}

test('logs in and calls onLoggedIn with the user', async () => {
  const user = { id: 1, email: 'me@example.com' }
  login.mockResolvedValue(user)
  const onLoggedIn = vi.fn()
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={onLoggedIn} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)

  expect(login).toHaveBeenCalledWith({ email: 'me@example.com', password: 'longpassword1' })
  expect(onLoggedIn).toHaveBeenCalledWith(user)
})

test('shows an invalid-credentials message on 401', async () => {
  login.mockRejectedValue(Object.assign(new Error('Invalid email or password'), { status: 401 }))
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={noop} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)

  expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument()
})

test('offers to resend the verification email on 403', async () => {
  login.mockRejectedValue(Object.assign(new Error('Email address not verified'), { status: 403 }))
  resendVerification.mockResolvedValue(null)
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={noop} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)

  const resendButton = await screen.findByRole('button', { name: /resend verification email/i })
  await userEventApi.click(resendButton)

  expect(resendVerification).toHaveBeenCalledWith('me@example.com')
  expect(await screen.findByText(/verification email sent/i)).toBeInTheDocument()
})

test('shows an error when resending the verification email fails', async () => {
  login.mockRejectedValue(Object.assign(new Error('Email address not verified'), { status: 403 }))
  resendVerification.mockRejectedValue(
    Object.assign(new Error('Too many attempts.'), { status: 429, retryAfterSeconds: 60 }),
  )
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={noop} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)

  const resendButton = await screen.findByRole('button', { name: /resend verification email/i })
  await userEventApi.click(resendButton)

  expect(await screen.findByText(/try again in 1 minute/i)).toBeInTheDocument()
  // The button stays usable for another try, unlike a one-shot "sent" state.
  expect(screen.getByRole('button', { name: /resend verification email/i })).toBeEnabled()
})

test('does not carry a stale resend error into a fresh unverified result', async () => {
  login.mockRejectedValue(Object.assign(new Error('Email address not verified'), { status: 403 }))
  resendVerification.mockRejectedValue(
    Object.assign(new Error('Too many attempts.'), { status: 429, retryAfterSeconds: 60 }),
  )
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={noop} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)
  const resendButton = await screen.findByRole('button', { name: /resend verification email/i })
  await userEventApi.click(resendButton)
  await screen.findByText(/try again in 1 minute/i)

  // A second, separate login attempt (e.g. after editing the password)
  // hits the same unverified wall again — the old resend error shouldn't
  // still be showing from the previous attempt.
  await userEventApi.click(screen.getByRole('button', { name: /log in/i }))

  await screen.findByRole('button', { name: /resend verification email/i })
  expect(screen.queryByText(/try again in 1 minute/i)).not.toBeInTheDocument()
})

test('shows a retry-after message on 429', async () => {
  login.mockRejectedValue(Object.assign(new Error('Too many attempts.'), { status: 429, retryAfterSeconds: 120 }))
  const userEventApi = userEvent.setup()

  render(<LoginForm onLoggedIn={noop} onSwitchToRegister={noop} onSwitchToForgotPassword={noop} />)
  await fillAndSubmit(userEventApi)

  expect(await screen.findByText(/try again in 2 minutes/i)).toBeInTheDocument()
})

test('switches to the register and forgot-password views', async () => {
  const onSwitchToRegister = vi.fn()
  const onSwitchToForgotPassword = vi.fn()
  const userEventApi = userEvent.setup()

  render(
    <LoginForm
      onLoggedIn={noop}
      onSwitchToRegister={onSwitchToRegister}
      onSwitchToForgotPassword={onSwitchToForgotPassword}
    />,
  )

  await userEventApi.click(screen.getByRole('button', { name: /create an account/i }))
  expect(onSwitchToRegister).toHaveBeenCalled()

  await userEventApi.click(screen.getByRole('button', { name: /forgot password/i }))
  expect(onSwitchToForgotPassword).toHaveBeenCalled()
})
