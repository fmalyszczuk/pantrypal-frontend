import { render, screen } from '@testing-library/react'
import AccountPage from './AccountPage.jsx'

test('shows the logged-in email and both account forms', () => {
  render(<AccountPage user={{ id: 1, email: 'me@example.com' }} onAccountDeleted={() => {}} />)

  expect(screen.getByText('me@example.com')).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /delete account/i })).toBeInTheDocument()
})
