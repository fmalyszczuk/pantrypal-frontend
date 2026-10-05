import RecipeListItem from './RecipeListItem.jsx'
import './RecipeList.css'

function RecipeList({ recipes, onDelete }) {
  if (recipes.length === 0) {
    return <p className="recipe-list__empty">No saved recipes yet.</p>
  }

  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeListItem key={recipe.id} recipe={recipe} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default RecipeList
