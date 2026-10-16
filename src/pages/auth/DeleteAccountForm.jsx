import { useState } from 'react'
import { deleteAccount } from '../../api/auth.js'
import { retryAfterMessage } from './retryAfterMessage.js'
import './AuthForms.css'

function DeleteAccountForm({ onAccountDeleted }) {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    // There's no undo on the backend either way (see ../../../README.md's
    // "POST /auth/delete-account"), so the frontend's own confirm dialog is
    // the only thing standing between a misclick and permanent data loss.
    const confirmed = window.confirm(
      "Delete your account and everything in it — recipes, shopping list, chat history? This can't be undone.",
    )
    if (!confirmed) return

    setStatus('loading')
    setError(null)

    try {
      await deleteAccount(password)
      onAccountDeleted()
    } catch (err) {
      setError(err.status === 429 ? retryAfterMessage(err.retryAfterSeconds) : err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="auth-form auth-form--section auth-form--danger" onSubmit={handleSubmit}>
      <h2 className="auth-form__section-title">Delete account</h2>
      <p className="auth-form__hint">
        Permanently deletes your account, recipes, shopping list, and chat history.
      </p>

      <label className="auth-form__label" htmlFor="delete-account-password">
        Password
      </label>
      <input
        id="delete-account-password"
        type="password"
        className="auth-form__input"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isLoading}
        required
      />

      <button type="submit" className="auth-form__submit auth-form__submit--danger" disabled={isLoading}>
        {isLoading ? 'Deleting…' : 'Delete my account'}
      </button>

      {status === 'error' && <p className="auth-form__error">{error}</p>}
    </form>
  )
}

export default DeleteAccountForm
