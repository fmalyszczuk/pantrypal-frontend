import { useEffect, useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import AddRecipePage from './pages/AddRecipePage.jsx'
import RecipesPage from './pages/RecipesPage.jsx'
import ShoppingListPage from './pages/ShoppingListPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import AuthPage from './pages/auth/AuthPage.jsx'
import AccountPage from './pages/auth/AccountPage.jsx'
import VerifyEmailPage from './pages/auth/VerifyEmailPage.jsx'
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx'
import { getCsrfToken, getCurrentUser, logout } from './api/auth.js'
import { onUnauthorized } from './api/client.js'

// No router yet — a handful of useState-driven tabs is enough for this scope
// (see CLAUDE.md: don't reach for extra libraries until the app outgrows this).
const PAGES = {
  home: { label: 'Home', component: HomePage },
  addRecipe: { label: 'Add Recipe', component: AddRecipePage },
  recipes: { label: 'My Recipes', component: RecipesPage },
  shoppingList: { label: 'Shopping List', component: ShoppingListPage },
  chat: { label: 'Chat', component: ChatPage },
}

// The password-reset and email-verification links the backend emails out
// are real URLs opened directly in a browser (see ../../README.md's
// "Email verification and forgotten passwords"), not navigation within the
// tabbed app — so they're matched against the actual pathname once here,
// ahead of the tabbed app and its login gate, rather than through a router.
const STANDALONE_ROUTES = {
  '/verify-email': VerifyEmailPage,
  '/reset-password': ResetPasswordPage,
}

function AuthenticatedApp() {
  const [authStatus, setAuthStatus] = useState('loading') // 'loading' | 'authenticated' | 'anonymous'
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('home')

  useEffect(() => {
    let cancelled = false

    getCsrfToken()
      .then(() => getCurrentUser())
      .then((loggedInUser) => {
        if (cancelled) return
        setUser(loggedInUser)
        setAuthStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        setAuthStatus('anonymous')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(
    () =>
      // A session can end at any point (expiry, logout elsewhere) while the
      // user is deep in some other page; fall back to the login page from
      // wherever that happens rather than making every page handle a 401.
      onUnauthorized(() => {
        setUser(null)
        setAuthStatus('anonymous')
      }),
    [],
  )

  function handleLoggedIn(loggedInUser) {
    setUser(loggedInUser)
    setAuthStatus('authenticated')
  }

  function handleLogout() {
    // Best-effort: whether or not this call succeeds, there's nothing more
    // the frontend can do about an already-dead session, so show the login
    // page regardless.
    logout().catch(() => {})
    setUser(null)
    setAuthStatus('anonymous')
  }

  if (authStatus === 'loading') {
    return <p className="app__status">Loading…</p>
  }

  if (authStatus === 'anonymous') {
    return <AuthPage onLoggedIn={handleLoggedIn} />
  }

  const PageComponent = PAGES[page]?.component

  return (
    <div className="app">
      <nav className="app__nav">
        {Object.entries(PAGES).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className={`app__nav-button${page === key ? ' app__nav-button--active' : ''}`}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
        <span className="app__nav-spacer" />
        <button
          type="button"
          className={`app__user${page === 'account' ? ' app__user--active' : ''}`}
          onClick={() => setPage('account')}
        >
          {user.email}
        </button>
        <button type="button" className="app__nav-button" onClick={handleLogout}>
          Log out
        </button>
      </nav>
      <main className="app__content">
        {page === 'account' ? (
          <AccountPage user={user} onAccountDeleted={handleLogout} />
        ) : page === 'chat' ? (
          <ChatPage userId={user.id} />
        ) : (
          <PageComponent />
        )}
      </main>
    </div>
  )
}

function App() {
  const StandaloneRoute = STANDALONE_ROUTES[window.location.pathname]
  if (StandaloneRoute) {
    return <StandaloneRoute />
  }

  return <AuthenticatedApp />
}

export default App
