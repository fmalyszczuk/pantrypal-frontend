import { useState } from 'react'
import RecipeUrlForm from '../components/RecipeUrlForm/RecipeUrlForm.jsx'
import ManualRecipeForm from '../components/ManualRecipeForm/ManualRecipeForm.jsx'
import FileRecipeForm from '../components/FileRecipeForm/FileRecipeForm.jsx'
import RecipeTextForm from '../components/RecipeTextForm/RecipeTextForm.jsx'
import IngredientList from '../components/IngredientList/IngredientList.jsx'
import './AddRecipePage.css'

const MODES = {
  url: { label: 'From URL', component: RecipeUrlForm },
  manual: { label: 'Type it in', component: ManualRecipeForm },
  file: { label: 'Upload a file', component: FileRecipeForm },
  text: { label: 'Search by name', component: RecipeTextForm },
}

function AddRecipePage() {
  const [mode, setMode] = useState('url')
  const [recipe, setRecipe] = useState(null)
  const ModeForm = MODES[mode].component

  return (
    <div className="add-recipe-page">
      <h1 className="add-recipe-page__title">Add a Recipe</h1>

      <div className="add-recipe-page__mode-switch" role="tablist" aria-label="Recipe entry method">
        {Object.entries(MODES).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            className={`add-recipe-page__mode-button${mode === key ? ' add-recipe-page__mode-button--active' : ''}`}
            onClick={() => setMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ModeForm onExtracted={setRecipe} />

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
