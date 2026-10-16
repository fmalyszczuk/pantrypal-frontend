import { useState } from 'react'
import { changePassword } from '../../api/auth.js'
import { retryAfterMessage } from './retryAfterMessage.js'
import './AuthForms.css'

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setError(null)

    try {
      await changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setStatus('success')
    } catch (err) {
      setError(err.status === 429 ? retryAfterMessage(err.retryAfterSeconds) : err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="auth-form auth-form--section" onSubmit={handleSubmit}>
      <h2 className="auth-form__section-title">Change password</h2>

      <label className="auth-form__label" htmlFor="change-password-current">
        Current password
      </label>
      <input
        id="change-password-current"
        type="password"
        className="auth-form__input"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        disabled={isLoading}
        required
      />

      <label className="auth-form__label" htmlFor="change-password-new">
        New password
      </label>
      <input
        id="change-password-new"
        type="password"
        className="auth-form__input"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        disabled={isLoading}
        minLength={10}
        required
      />
      <p className="auth-form__hint">At least 10 characters. Avoid common passwords.</p>

      <button type="submit" className="auth-form__submit" disabled={isLoading}>
        {isLoading ? 'Changing…' : 'Change password'}
      </button>

      {status === 'success' && (
        <p className="auth-form__success">
          Password changed. Your other sessions have been logged out.
        </p>
      )}
      {status === 'error' && <p className="auth-form__error">{error}</p>}
    </form>
  )
}

export default ChangePasswordForm
