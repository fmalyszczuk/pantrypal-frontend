import { useState } from 'react'
import './AddItemForm.css'

function AddItemForm({ onAdd }) {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'error'
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return

    setStatus('loading')
    setError(null)

    try {
      await onAdd({
        name: trimmedName,
        quantity: quantity.trim() ? Number(quantity) : null,
        unit: unit.trim() || null,
      })
      setName('')
      setQuantity('')
      setUnit('')
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <div className="add-item-form__row">
        <input
          type="text"
          className="add-item-form__name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Item name"
          aria-label="Item name"
          disabled={isLoading}
          required
        />
        <input
          type="number"
          className="add-item-form__quantity-input"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="Qty"
          aria-label="Item quantity"
          disabled={isLoading}
        />
        <input
          type="text"
          className="add-item-form__unit-input"
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
          placeholder="Unit"
          aria-label="Item unit"
          disabled={isLoading}
        />
        <button type="submit" className="add-item-form__submit" disabled={isLoading}>
          {isLoading ? 'Adding…' : 'Add item'}
        </button>
      </div>
      {status === 'error' && (
        <p className="add-item-form__error">Couldn't add that item: {error}</p>
      )}
    </form>
  )
}

export default AddItemForm
