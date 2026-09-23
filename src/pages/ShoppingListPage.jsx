import { useEffect, useState } from 'react'
import ShoppingList from '../components/ShoppingList/ShoppingList.jsx'
import {
  getShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
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

    // No optimistic update here: when both units are recognized mass units,
    // the backend recalculates `quantity` itself (see ../../README.md's
    // "Unit conversion" note), so the resulting value is only known once the
    // response comes back. On failure the select just reverts, since local
    // state was never changed.
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
      <h1 className="shopping-list-page__title">Shopping List</h1>
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
