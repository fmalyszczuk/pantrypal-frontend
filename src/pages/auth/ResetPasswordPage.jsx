import { useEffect, useState } from 'react'
import { resetPassword } from '../../api/auth.js'
import './AuthForms.css'

function ResetPasswordPage() {
  const [token, setToken] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error' | 'missing-token'
  const [error, setError] = useState(null)

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token')
    // Strip it from the address bar right away (see VerifyEmailPage for why).
    window.history.replaceState(null, '', window.location.pathname)

    if (!tokenFromUrl) {
      setStatus('missing-token')
      return
    }
    setToken(tokenFromUrl)
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      await resetPassword({ token, newPassword })
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  if (status === 'missing-token') {
    return (
      <div className="auth-form">
        <h1 className="auth-form__title">Reset password</h1>
        <p className="auth-form__error">This link is missing its token.</p>
        <div className="auth-form__links">
          <a className="auth-form__link-button" href="/">
            Back to log in
          </a>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="auth-form">
        <h1 className="auth-form__title">Password reset</h1>
        <p>Your password has been changed. You can now log in with it.</p>
        <div className="auth-form__links">
          <a className="auth-form__link-button" href="/">
            Go to log in
          </a>
        </div>
      </div>
    )
  }

  const isLoading = status === 'loading'

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Choose a new password</h1>

      <label className="auth-form__label" htmlFor="reset-password-new">
        New password
      </label>
      <input
        id="reset-password-new"
        type="password"
        className="auth-form__input"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        disabled={isLoading || !token}
        minLength={10}
        required
      />
      <p className="auth-form__hint">At least 10 characters. Avoid common passwords.</p>

      <button type="submit" className="auth-form__submit" disabled={isLoading || !token}>
        {isLoading ? 'Saving…' : 'Reset password'}
      </button>

      {status === 'error' && <p className="auth-form__error">{error}</p>}
    </form>
  )
}

export default ResetPasswordPage
