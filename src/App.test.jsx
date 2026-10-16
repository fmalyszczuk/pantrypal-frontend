import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from './App.jsx'
import { getCsrfToken, getCurrentUser } from './api/auth.js'

vi.mock('./api/auth.js', () => ({
  getCsrfToken: vi.fn(),
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  resendVerification: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifyEmail: vi.fn(),
  changePassword: vi.fn(),
  deleteAccount: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  getCsrfToken.mockResolvedValue(null)
})

test('shows the login form when nobody is logged in', async () => {
  getCurrentUser.mockRejectedValue(Object.assign(new Error('Authentication required'), { status: 401 }))

  render(<App />)

  expect(await screen.findByRole('heading', { name: /log in/i })).toBeInTheDocument()
})

test('renders the app heading once a session is found', async () => {
  getCurrentUser.mockResolvedValue({ id: 1, email: 'me@example.com' })

  render(<App />)

  expect(await screen.findByRole('heading', { name: /pantrypal/i })).toBeInTheDocument()
  expect(screen.getByText('me@example.com')).toBeInTheDocument()
})

test('clicking the logged-in email navigates to the account page', async () => {
  getCurrentUser.mockResolvedValue({ id: 1, email: 'me@example.com' })
  const user = userEvent.setup()

  render(<App />)

  await user.click(await screen.findByRole('button', { name: 'me@example.com' }))

  expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument()
})
