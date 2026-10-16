import { useState } from 'react'
import { login, resendVerification } from '../../api/auth.js'
import { retryAfterMessage } from './retryAfterMessage.js'
import './AuthForms.css'

function LoginForm({ onLoggedIn, onSwitchToRegister, onSwitchToForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error' | 'unverified'
  const [error, setError] = useState(null)
  const [resendStatus, setResendStatus] = useState('idle') // 'idle' | 'loading' | 'sent' | 'error'
  const [resendError, setResendError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)
    setResendStatus('idle')
    setResendError(null)

    try {
      const user = await login({ email, password })
      onLoggedIn(user)
    } catch (err) {
      if (err.status === 403) {
        setStatus('unverified')
      } else if (err.status === 429) {
        setError(retryAfterMessage(err.retryAfterSeconds))
        setStatus('error')
      } else {
        setError(err.message)
        setStatus('error')
      }
    }
  }

  async function handleResend() {
    setResendStatus('loading')
    setResendError(null)
    try {
      await resendVerification(email)
      setResendStatus('sent')
    } catch (err) {
      setResendError(err.status === 429 ? retryAfterMessage(err.retryAfterSeconds) : err.message)
      setResendStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h1 className="auth-form__title">Log in</h1>

      <label className="auth-form__label" htmlFor="login-email">
        Email
      </label>
      <input
        id="login-email"
        type="email"
        className="auth-form__input"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isLoading}
        required
      />

      <label className="auth-form__label" htmlFor="login-password">
        Password
      </label>
      <input
        id="login-password"
        type="password"
        className="auth-form__input"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isLoading}
        required
      />

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Logging in…' : 'Log in'}
      </button>

      {status === 'error' && <p className="auth-form__error">{error}</p>}

      {status === 'unverified' && (
        <div className="auth-form__notice">
          <p>Please confirm your email address before logging in.</p>
          {resendStatus === 'sent' ? (
            <p>Verification email sent — check your inbox.</p>
          ) : (
            <>
              <button
                type="button"
                className="auth-form__link-button"
                onClick={handleResend}
                disabled={resendStatus === 'loading'}
              >
                {resendStatus === 'loading' ? 'Sending…' : 'Resend verification email'}
              </button>
              {resendStatus === 'error' && <p className="auth-form__error">{resendError}</p>}
            </>
          )}
        </div>
      )}

      <div className="auth-form__links">
        <button type="button" className="auth-form__link-button" onClick={onSwitchToForgotPassword}>
          Forgot password?
        </button>
        <button type="button" className="auth-form__link-button" onClick={onSwitchToRegister}>
          Create an account
        </button>
      </div>
    </form>
  )
}

export default LoginForm
