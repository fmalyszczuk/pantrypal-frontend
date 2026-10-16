import { useState } from 'react'
import { forgotPassword } from '../../api/auth.js'
import './AuthForms.css'

function ForgotPasswordForm({ onSubmitted, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      // Always 204, whether or not the address has an account — nothing to
      // branch on, same as registration.
      await forgotPassword(email)
      onSubmitted()
    } catch (err) {
      setError(
        err.status === 429
          ? 'Too many attempts. Please try again later.'
          : err.message,
      )
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Reset your password</h1>
      <p className="auth-form__hint">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <label className="auth-form__label" htmlFor="forgot-password-email">
        Email
      </label>
      <input
        id="forgot-password-email"
        type="email"
        className="auth-form__input"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isLoading}
        required
      />

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Sending…' : 'Send reset link'}
      </button>

      {status === 'error' && <p className="auth-form__error">{error}</p>}

      <div className="auth-form__links">
        <button type="button" className="auth-form__link-button" onClick={onSwitchToLogin}>
          Back to log in
        </button>
      </div>
    </form>
  )
}

export default ForgotPasswordForm
