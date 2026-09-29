import { useState } from 'react'
import { createManualRecipe } from '../../api/recipes.js'
import './ManualRecipeForm.css'

const EMPTY_ROW = { name: '', quantity: '', unit: '' }

function ManualRecipeForm({ onExtracted }) {
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState([{ ...EMPTY_ROW }])
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  function updateRow(index, field, value) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    )
  }

  function addRow() {
    setRows((current) => [...current, { ...EMPTY_ROW }])
  }

  function removeRow(index) {
    setRows((current) => current.filter((_, i) => i !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const ingredients = rows
      .map((row) => ({
        name: row.name.trim(),
        quantity: row.quantity.trim() ? Number(row.quantity) : null,
        unit: row.unit.trim() || null,
      }))
      .filter((ingredient) => ingredient.name)

    if (!trimmedTitle || ingredients.length === 0) return

    setStatus('loading')
    setError(null)

    try {
      const recipe = await createManualRecipe({ title: trimmedTitle, ingredients })
      onExtracted(recipe)
      setTitle('')
      setRows([{ ...EMPTY_ROW }])
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="manual-recipe-form" onSubmit={handleSubmit}>
      <label className="manual-recipe-form__label" htmlFor="manual-recipe-title">
        Recipe title
      </label>
      <input
        id="manual-recipe-title"
        type="text"
        className="manual-recipe-form__title-input"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Grandma's soup"
        disabled={isLoading}
        required
      />

      <div className="manual-recipe-form__ingredients">
        <span className="manual-recipe-form__label">Ingredients</span>
        {rows.map((row, index) => (
          <div className="manual-recipe-form__row" key={index}>
            <input
              type="text"
              className="manual-recipe-form__name-input"
              value={row.name}
              onChange={(event) => updateRow(index, 'name', event.target.value)}
              placeholder="Ingredient name"
              aria-label={`Ingredient ${index + 1} name`}
              disabled={isLoading}
            />
            <input
              type="number"
              className="manual-recipe-form__quantity-input"
              value={row.quantity}
              onChange={(event) => updateRow(index, 'quantity', event.target.value)}
              placeholder="Qty"
              aria-label={`Ingredient ${index + 1} quantity`}
              disabled={isLoading}
            />
            <input
              type="text"
              className="manual-recipe-form__unit-input"
              value={row.unit}
              onChange={(event) => updateRow(index, 'unit', event.target.value)}
              placeholder="Unit"
              aria-label={`Ingredient ${index + 1} unit`}
              disabled={isLoading}
            />
            <button
              type="button"
              className="manual-recipe-form__remove"
              onClick={() => removeRow(index)}
              disabled={isLoading || rows.length === 1}
              aria-label={`Remove ingredient ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className="manual-recipe-form__add"
          onClick={addRow}
          disabled={isLoading}
        >
          + Add ingredient
        </button>
      </div>

      <button type="submit" className="manual-recipe-form__submit" disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save recipe'}
      </button>

      {status === 'error' && (
        <p className="manual-recipe-form__error">Couldn't save that recipe: {error}</p>
      )}
    </form>
  )
}

export default ManualRecipeForm
