import { useState } from 'react'
import RecipeUrlForm from '../components/RecipeUrlForm/RecipeUrlForm.jsx'
import IngredientList from '../components/IngredientList/IngredientList.jsx'
import './AddRecipePage.css'

function AddRecipePage() {
  const [recipe, setRecipe] = useState(null)

  return (
    <div className="add-recipe-page">
      <h1 className="add-recipe-page__title">Add a Recipe</h1>
      <RecipeUrlForm onExtracted={setRecipe} />
      {recipe && (
        <section className="add-recipe-page__result">
          <h2 className="add-recipe-page__result-title">{recipe.title ?? 'Ingredients'}</h2>
          <IngredientList ingredients={recipe.ingredients} />
        </section>
      )}
    </div>
  )
}

export default AddRecipePage
