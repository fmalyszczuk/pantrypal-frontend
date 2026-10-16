import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RegisterForm from './RegisterForm.jsx'
import { register } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  register: vi.fn(),
}))

const noop = () => {}

beforeEach(() => {
  vi.clearAllMocks()
})

test('registers and calls onRegistered with the email', async () => {
  register.mockResolvedValue({ email: 'me@example.com' })
  const onRegistered = vi.fn()
  const user = userEvent.setup()

  render(<RegisterForm onRegistered={onRegistered} onSwitchToLogin={noop} />)

  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.type(screen.getByLabelText(/password/i), 'longpassword1')
  await user.click(screen.getByRole('button', { name: /create account/i }))

  expect(register).toHaveBeenCalledWith({ email: 'me@example.com', password: 'longpassword1' })
  expect(onRegistered).toHaveBeenCalledWith('me@example.com')
})

test('shows the validation message from the backend on 400', async () => {
  register.mockRejectedValue(
    Object.assign(new Error('That password is too common or too easy to guess'), { status: 400 }),
  )
  const user = userEvent.setup()

  render(<RegisterForm onRegistered={noop} onSwitchToLogin={noop} />)

  await user.type(screen.getByLabelText(/email/i), 'me@example.com')
  await user.type(screen.getByLabelText(/password/i), 'password123')
  await user.click(screen.getByRole('button', { name: /create account/i }))

  expect(await screen.findByText(/too common or too easy to guess/i)).toBeInTheDocument()
})

test('switches to the login view', async () => {
  const onSwitchToLogin = vi.fn()
  const user = userEvent.setup()

  render(<RegisterForm onRegistered={noop} onSwitchToLogin={onSwitchToLogin} />)

  await user.click(screen.getByRole('button', { name: /already have an account/i }))

  expect(onSwitchToLogin).toHaveBeenCalled()
})
