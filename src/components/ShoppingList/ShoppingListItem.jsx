import './ShoppingListItem.css'

function formatQuantity(item) {
  return [item.quantity, item.unit].filter(Boolean).join(' ')
}

function ShoppingListItem({ item, onTogglePurchased, onDelete }) {
  const quantity = formatQuantity(item)

  return (
    <li className={`shopping-item${item.purchased ? ' shopping-item--purchased' : ''}`}>
      <label className="shopping-item__label">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={() => onTogglePurchased(item.id)}
        />
        <span className="shopping-item__name">
          {quantity ? `${quantity} ` : ''}
          {item.name}
        </span>
      </label>
      <button
        type="button"
        className="shopping-item__delete"
        onClick={() => onDelete(item.id)}
        aria-label={`Delete ${item.name}`}
      >
        ✕
      </button>
    </li>
  )
}

export default ShoppingListItem
