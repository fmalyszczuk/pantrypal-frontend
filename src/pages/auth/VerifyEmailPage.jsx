import { useEffect, useState } from 'react'
import { getCsrfToken, verifyEmail } from '../../api/auth.js'
import './AuthForms.css'

function VerifyEmailPage() {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    // Strip the token from the address bar immediately so it doesn't linger
    // in browser history or get leaked in a Referer header (see
    // ../../../README.md's "Frontend notes for the email links").
    window.history.replaceState(null, '', window.location.pathname)

    if (!token) {
      setError('This link is missing its token.')
      setStatus('error')
      return
    }

    // This page is reached straight from an email link, bypassing the
    // normal app startup that primes the XSRF-TOKEN cookie — without this,
    // a first-time visitor's browser has no cookie yet, so the POST below
    // would fail with 403 (see ../../../README.md's "Accounts and login").
    getCsrfToken()
      .then(() => verifyEmail(token))
      .then(() => setStatus('success'))
      .catch((err) => {
        setError(err.message)
        setStatus('error')
      })
  }, [])

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">Email verification</h1>
      {status === 'loading' && <p>Confirming your email address…</p>}
      {status === 'success' && <p>Your email is confirmed. You can now log in.</p>}
      {status === 'error' && <p className="auth-form__error">{error}</p>}
      <div className="auth-form__links">
        <a className="auth-form__link-button" href="/">
          Go to log in
        </a>
      </div>
    </div>
  )
}

export default VerifyEmailPage
