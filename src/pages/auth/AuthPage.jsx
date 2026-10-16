import { useState } from 'react'
import LoginForm from './LoginForm.jsx'
import RegisterForm from './RegisterForm.jsx'
import ForgotPasswordForm from './ForgotPasswordForm.jsx'
import './AuthForms.css'

function AuthPage({ onLoggedIn }) {
  const [view, setView] = useState('login')
  const [registeredEmail, setRegisteredEmail] = useState(null)

  if (view === 'register') {
    return (
      <RegisterForm
        onRegistered={(email) => {
          setRegisteredEmail(email)
          setView('registerSuccess')
        }}
        onSwitchToLogin={() => setView('login')}
      />
    )
  }

  if (view === 'registerSuccess') {
    return (
      <div className="auth-form">
        <h1 className="auth-form__title">Check your email</h1>
        <p>
          If <strong>{registeredEmail}</strong> can be registered, we've sent a
          confirmation link to it. Click it to activate your account, then log in.
        </p>
        <div className="auth-form__links">
          <button type="button" className="auth-form__link-button" onClick={() => setView('login')}>
            Back to log in
          </button>
        </div>
      </div>
    )
  }

  if (view === 'forgotPassword') {
    return (
      <ForgotPasswordForm
        onSubmitted={() => setView('forgotPasswordSuccess')}
        onSwitchToLogin={() => setView('login')}
      />
    )
  }

  if (view === 'forgotPasswordSuccess') {
    return (
      <div className="auth-form">
        <h1 className="auth-form__title">Check your email</h1>
        <p>If that address has an account, we've sent a link to reset your password.</p>
        <div className="auth-form__links">
          <button type="button" className="auth-form__link-button" onClick={() => setView('login')}>
            Back to log in
          </button>
        </div>
      </div>
    )
  }

  return (
    <LoginForm
      onLoggedIn={onLoggedIn}
      onSwitchToRegister={() => setView('register')}
      onSwitchToForgotPassword={() => setView('forgotPassword')}
    />
  )
}

export default AuthPage
