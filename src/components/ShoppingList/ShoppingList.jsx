import ShoppingListItem from './ShoppingListItem.jsx'
import './ShoppingList.css'

function ShoppingList({ items, onTogglePurchased, onDelete, onChangeUnit }) {
  if (items.length === 0) {
    return <p className="shopping-list__empty">Your shopping list is empty.</p>
  }

  return (
    <ul className="shopping-list">
      {items.map((item) => (
        <ShoppingListItem
          key={item.id}
          item={item}
          onTogglePurchased={onTogglePurchased}
          onDelete={onDelete}
          onChangeUnit={onChangeUnit}
        />
      ))}
    </ul>
  )
}

export default ShoppingList
