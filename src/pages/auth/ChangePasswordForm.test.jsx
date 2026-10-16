import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ChangePasswordForm from './ChangePasswordForm.jsx'
import { changePassword } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  changePassword: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

test('submits current and new password and shows a success message', async () => {
  changePassword.mockResolvedValue(null)
  const user = userEvent.setup()

  render(<ChangePasswordForm />)

  await user.type(screen.getByLabelText(/current password/i), 'oldpassword1')
  await user.type(screen.getByLabelText(/new password/i), 'newlongpassword1')
  await user.click(screen.getByRole('button', { name: /change password/i }))

  expect(changePassword).toHaveBeenCalledWith({
    currentPassword: 'oldpassword1',
    newPassword: 'newlongpassword1',
  })
  expect(await screen.findByText(/other sessions have been logged out/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/current password/i)).toHaveValue('')
})

test('shows the backend error when the current password is wrong', async () => {
  changePassword.mockRejectedValue(Object.assign(new Error('The password is incorrect'), { status: 400 }))
  const user = userEvent.setup()

  render(<ChangePasswordForm />)

  await user.type(screen.getByLabelText(/current password/i), 'wrongpassword')
  await user.type(screen.getByLabelText(/new password/i), 'newlongpassword1')
  await user.click(screen.getByRole('button', { name: /change password/i }))

  expect(await screen.findByText(/password is incorrect/i)).toBeInTheDocument()
})

test('shows a retry-after message on 429', async () => {
  changePassword.mockRejectedValue(
    Object.assign(new Error('Too many attempts.'), { status: 429, retryAfterSeconds: 60 }),
  )
  const user = userEvent.setup()

  render(<ChangePasswordForm />)

  await user.type(screen.getByLabelText(/current password/i), 'wrongpassword')
  await user.type(screen.getByLabelText(/new password/i), 'newlongpassword1')
  await user.click(screen.getByRole('button', { name: /change password/i }))

  expect(await screen.findByText(/try again in 1 minute/i)).toBeInTheDocument()
})
