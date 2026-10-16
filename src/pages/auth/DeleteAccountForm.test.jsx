import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DeleteAccountForm from './DeleteAccountForm.jsx'
import { deleteAccount } from '../../api/auth.js'

vi.mock('../../api/auth.js', () => ({
  deleteAccount: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

test('asks for confirmation, then deletes the account and calls onAccountDeleted', async () => {
  deleteAccount.mockResolvedValue(null)
  const onAccountDeleted = vi.fn()
  const user = userEvent.setup()

  render(<DeleteAccountForm onAccountDeleted={onAccountDeleted} />)

  await user.type(screen.getByLabelText(/password/i), 'mypassword1')
  await user.click(screen.getByRole('button', { name: /delete my account/i }))

  expect(window.confirm).toHaveBeenCalled()
  expect(deleteAccount).toHaveBeenCalledWith('mypassword1')
  expect(onAccountDeleted).toHaveBeenCalled()
})

test('declining the confirmation does not call the API', async () => {
  window.confirm.mockReturnValue(false)
  const onAccountDeleted = vi.fn()
  const user = userEvent.setup()

  render(<DeleteAccountForm onAccountDeleted={onAccountDeleted} />)

  await user.type(screen.getByLabelText(/password/i), 'mypassword1')
  await user.click(screen.getByRole('button', { name: /delete my account/i }))

  expect(deleteAccount).not.toHaveBeenCalled()
  expect(onAccountDeleted).not.toHaveBeenCalled()
})

test('shows the backend error when the password is wrong', async () => {
  deleteAccount.mockRejectedValue(Object.assign(new Error('The password is incorrect'), { status: 400 }))
  const onAccountDeleted = vi.fn()
  const user = userEvent.setup()

  render(<DeleteAccountForm onAccountDeleted={onAccountDeleted} />)

  await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
  await user.click(screen.getByRole('button', { name: /delete my account/i }))

  expect(await screen.findByText(/password is incorrect/i)).toBeInTheDocument()
  expect(onAccountDeleted).not.toHaveBeenCalled()
})
