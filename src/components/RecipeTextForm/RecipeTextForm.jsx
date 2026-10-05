import { useState } from 'react'
import { extractFromText } from '../../api/recipes.js'
import './RecipeTextForm.css'

// Backend caps this at 200 chars (see CreateRecipeFromTextRequest).
const MAX_LENGTH = 200

function RecipeTextForm({ onExtracted }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setStatus('loading')
    setError(null)

    try {
      const recipe = await extractFromText(trimmed)
      onExtracted(recipe)
      setText('')
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="recipe-text-form" onSubmit={handleSubmit}>
      <label className="recipe-text-form__label" htmlFor="recipe-text">
        Dish name
      </label>
      <div className="recipe-text-form__row">
        <input
          id="recipe-text"
          type="text"
          className="recipe-text-form__input"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="chicken tikka masala"
          maxLength={MAX_LENGTH}
          disabled={status === 'loading'}
          required
        />
        <button type="submit" className="recipe-text-form__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </div>
      {status === 'error' && (
        <p className="recipe-text-form__error">Couldn't find that recipe: {error}</p>
      )}
    </form>
  )
}

export default RecipeTextForm
