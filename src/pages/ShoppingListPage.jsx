import { useEffect, useState } from 'react'
import ShoppingList from '../components/ShoppingList/ShoppingList.jsx'
import {
  getShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
  clearShoppingList,
} from '../api/shoppingList.js'
import './ShoppingListPage.css'

function ShoppingListPage() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getShoppingList()
      .then((list) => {
        if (cancelled) return
        setItems(list ?? [])
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleTogglePurchased(itemId) {
    const target = items.find((item) => item.id === itemId)
    if (!target) return

    const nextPurchased = !target.purchased
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, purchased: nextPurchased } : item)),
    )

    // The backend matches by name, not id.
    updateShoppingListItem(target.name, { purchased: nextPurchased }).catch((err) => {
      console.warn('Could not persist purchased state:', err.message)
    })
  }

  function handleUnitChange(itemId, newUnit) {
    const target = items.find((item) => item.id === itemId)
    if (!target || target.unit === newUnit) return

    // No optimistic update here: when both units are in the same group
    // (weight or volume — see ../../README.md's "Unit conversion" note),
    // the backend recalculates `quantity` itself, so the resulting value is
    // only known once the response comes back. Crossing groups (or using a
    // custom unit) just relabels with the quantity untouched. On failure
    // the select just reverts, since local state was never changed.
    updateShoppingListItem(target.name, { unit: newUnit })
      .then((updated) => {
        setItems((current) => current.map((item) => (item.id === itemId ? updated : item)))
      })
      .catch((err) => {
        console.warn('Could not update unit:', err.message)
      })
  }

  function handleDelete(itemId) {
    const target = items.find((item) => item.id === itemId)
    if (!target) return

    setItems((current) => current.filter((item) => item.id !== itemId))

    // The backend deletes by name, not id.
    deleteShoppingListItem(target.name).catch((err) => {
      console.warn('Could not delete item on the backend:', err.message)
    })
  }

  function handleClearAll() {
    if (items.length === 0) return

    const confirmed = window.confirm(
      "Clear the entire shopping list? This can't be undone.",
    )
    if (!confirmed) return

    // Unlike a single toggle/delete, this wipes everything — worth rolling
    // back on failure rather than leaving the user thinking it's gone when
    // the backend still has it.
    const previousItems = items
    setItems([])

    clearShoppingList().catch((err) => {
      console.warn('Could not clear the shopping list on the backend:', err.message)
      setItems(previousItems)
    })
  }

  if (status === 'loading') {
    return <p className="shopping-list-page__status">Loading your shopping list…</p>
  }

  if (status === 'error') {
    return (
      <p className="shopping-list-page__status shopping-list-page__status--error">
        Couldn't load your shopping list: {error}
      </p>
    )
  }

  return (
    <div className="shopping-list-page">
      <div className="shopping-list-page__header">
        <h1 className="shopping-list-page__title">Shopping List</h1>
        {items.length > 0 && (
          <button
            type="button"
            className="shopping-list-page__clear"
            onClick={handleClearAll}
          >
            Clear list
          </button>
        )}
      </div>
      <ShoppingList
        items={items}
        onTogglePurchased={handleTogglePurchased}
        onDelete={handleDelete}
        onChangeUnit={handleUnitChange}
      />
    </div>
  )
}

export default ShoppingListPage
