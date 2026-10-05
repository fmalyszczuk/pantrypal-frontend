import { useEffect, useState } from 'react'
import RecipeList from '../components/RecipeList/RecipeList.jsx'
import { listRecipes, deleteRecipe } from '../api/recipes.js'
import './RecipesPage.css'

function RecipesPage() {
  const [recipes, setRecipes] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    listRecipes()
      .then((list) => {
        if (cancelled) return
        setRecipes(list ?? [])
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleDelete(id) {
    const target = recipes.find((recipe) => recipe.id === id)
    if (!target) return

    const confirmed = window.confirm(`Delete "${target.title}"? This can't be undone.`)
    if (!confirmed) return

    const removeFromShoppingList = window.confirm(
      'Also remove this recipe\'s ingredients from the shopping list?',
    )

    // Roll back on failure rather than leaving the user thinking it's gone
    // when the backend still has it — same approach as clearing the
    // shopping list (see ShoppingListPage).
    const previousRecipes = recipes
    setRecipes((current) => current.filter((recipe) => recipe.id !== id))

    deleteRecipe(id, { removeFromShoppingList }).catch((err) => {
      console.warn('Could not delete the recipe on the backend:', err.message)
      setRecipes(previousRecipes)
    })
  }

  if (status === 'loading') {
    return <p className="recipes-page__status">Loading your recipes…</p>
  }

  if (status === 'error') {
    return (
      <p className="recipes-page__status recipes-page__status--error">
        Couldn't load your recipes: {error}
      </p>
    )
  }

  return (
    <div className="recipes-page">
      <h1 className="recipes-page__title">My Recipes</h1>
      <RecipeList recipes={recipes} onDelete={handleDelete} />
    </div>
  )
}

export default RecipesPage
