import ChangePasswordForm from './ChangePasswordForm.jsx'
import DeleteAccountForm from './DeleteAccountForm.jsx'
import './AuthForms.css'

function AccountPage({ user, onAccountDeleted }) {
  return (
    <div className="account-page">
      <h1 className="auth-form__title">Account</h1>
      <p className="account-page__email">{user.email}</p>
      <ChangePasswordForm />
      <DeleteAccountForm onAccountDeleted={onAccountDeleted} />
    </div>
  )
}

export default AccountPage
