import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import AddRecipePage from './pages/AddRecipePage.jsx'
import ShoppingListPage from './pages/ShoppingListPage.jsx'
import ChatPage from './pages/ChatPage.jsx'

// No router yet — a handful of useState-driven tabs is enough for this scope
// (see CLAUDE.md: don't reach for extra libraries until the app outgrows this).
const PAGES = {
  home: { label: 'Home', component: HomePage },
  addRecipe: { label: 'Add Recipe', component: AddRecipePage },
  shoppingList: { label: 'Shopping List', component: ShoppingListPage },
  chat: { label: 'Chat', component: ChatPage },
}

function App() {
  const [page, setPage] = useState('home')
  const PageComponent = PAGES[page].component

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
      </nav>
      <main className="app__content">
        <PageComponent />
      </main>
    </div>
  )
}

export default App
