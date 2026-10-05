import IngredientList from '../IngredientList/IngredientList.jsx'
import './RecipeListItem.css'

const SOURCE_LABELS = {
  URL: 'From URL',
  TEXT: 'From dish name',
  FILE: 'From file',
  MANUAL: 'Typed in',
}

function formatDate(createdAt) {
  if (!createdAt) return null
  return new Date(createdAt).toLocaleDateString()
}

function RecipeListItem({ recipe, onDelete }) {
  const createdAt = formatDate(recipe.createdAt)

  return (
    <li className="recipe-list-item">
      <div className="recipe-list-item__header">
        <div>
          <h3 className="recipe-list-item__title">{recipe.title}</h3>
          <p className="recipe-list-item__meta">
            {SOURCE_LABELS[recipe.sourceType] ?? recipe.sourceType}
            {createdAt ? ` · added ${createdAt}` : ''}
          </p>
        </div>
        <button
          type="button"
          className="recipe-list-item__delete"
          onClick={() => onDelete(recipe.id)}
          aria-label={`Delete ${recipe.title}`}
        >
          Delete
        </button>
      </div>
      <IngredientList ingredients={recipe.ingredients} />
    </li>
  )
}

export default RecipeListItem
