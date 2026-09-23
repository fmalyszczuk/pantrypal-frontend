import './IngredientList.css'

function formatIngredient(ingredient) {
  return [ingredient.quantity, ingredient.unit, ingredient.name].filter(Boolean).join(' ')
}

function IngredientList({ ingredients }) {
  if (!ingredients || ingredients.length === 0) {
    return <p className="ingredient-list__empty">No ingredients found.</p>
  }

  return (
    <ul className="ingredient-list">
      {ingredients.map((ingredient, index) => (
        <li key={ingredient.id ?? `${ingredient.name}-${index}`} className="ingredient-list__item">
          {formatIngredient(ingredient)}
        </li>
      ))}
    </ul>
  )
}

export default IngredientList
