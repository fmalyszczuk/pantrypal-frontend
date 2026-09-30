import { useState } from 'react'
import { extractFromFile } from '../../api/recipes.js'
import './FileRecipeForm.css'

// Backend accepts PDF, DOCX, TXT, or an image (screenshot/photo read by a
// local vision model) — see ../../../README.md's "POST /recipes/from-file".
const ACCEPT = '.pdf,.docx,.txt,image/*'

function FileRecipeForm({ onExtracted }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) return

    setStatus('loading')
    setError(null)

    try {
      const recipe = await extractFromFile(file)
      onExtracted(recipe)
      setFile(null)
      event.target.reset()
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <form className="file-recipe-form" onSubmit={handleSubmit}>
      <label className="file-recipe-form__label" htmlFor="recipe-file">
        Recipe file
      </label>
      <div className="file-recipe-form__row">
        <input
          id="recipe-file"
          type="file"
          className="file-recipe-form__input"
          accept={ACCEPT}
          onChange={(event) => setFile(event.target.files[0] ?? null)}
          disabled={status === 'loading'}
        />
        <button type="submit" className="file-recipe-form__submit" disabled={status === 'loading' || !file}>
          {status === 'loading' ? 'Extracting…' : 'Extract'}
        </button>
      </div>
      <p className="file-recipe-form__hint">PDF, DOCX, TXT, or a photo/screenshot of a recipe.</p>
      {status === 'error' && (
        <p className="file-recipe-form__error">Couldn't extract that recipe: {error}</p>
      )}
    </form>
  )
}

export default FileRecipeForm
