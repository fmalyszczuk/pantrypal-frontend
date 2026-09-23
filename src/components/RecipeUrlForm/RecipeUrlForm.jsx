import { useState } from 'react'
import { extractFromUrl } from '../../api/recipes.js'
import './RecipeUrlForm.css'

function RecipeUrlForm({ onExtracted }) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) return

    setStatus('loading')
    setError(null)

    try {
      const recipe = await extractFromUrl(trimmed)
      onExtracted(recipe)
      setUrl('')
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="recipe-url-form" onSubmit={handleSubmit}>
      <label className="recipe-url-form__label" htmlFor="recipe-url">
        Recipe URL
      </label>
      <div className="recipe-url-form__row">
        <input
          id="recipe-url"
          type="url"
          className="recipe-url-form__input"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/recipe"
          disabled={status === 'loading'}
          required
        />
        <button type="submit" className="recipe-url-form__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Extracting…' : 'Extract'}
        </button>
      </div>
      {status === 'error' && (
        <p className="recipe-url-form__error">Couldn't extract that recipe: {error}</p>
      )}
    </form>
  )
}

export default RecipeUrlForm
