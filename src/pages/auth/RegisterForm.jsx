import { useState } from 'react'
import { register } from '../../api/auth.js'
import './AuthForms.css'

function RegisterForm({ onRegistered, onSwitchToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      // The backend answers the same (202) whether or not the address was
      // already registered, so there's nothing to branch on here — always
      // show the same "check your email" result.
      await register({ email, password })
      onRegistered(email)
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
      <h1 className="auth-form__title">Create an account</h1>

      <label className="auth-form__label" htmlFor="register-email">
        Email
      </label>
      <input
        id="register-email"
        type="email"
        className="auth-form__input"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={isLoading}
        required
      />

      <label className="auth-form__label" htmlFor="register-password">
        Password
      </label>
      <input
        id="register-password"
        type="password"
        className="auth-form__input"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isLoading}
        minLength={10}
        required
      />
      <p className="auth-form__hint">At least 10 characters. Avoid common passwords.</p>

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>

      {status === 'error' && <p className="auth-form__error">{error}</p>}

      <div className="auth-form__links">
        <button type="button" className="auth-form__link-button" onClick={onSwitchToLogin}>
          Already have an account? Log in
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
