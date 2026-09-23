import './ShoppingListItem.css'

// Units the backend's converter recognizes as mass units (see ../../README.md's
// "Unit conversion" note under PATCH /shopping-list/items/{name}), plus a few
// common non-mass units so the dropdown covers ordinary items too. The backend
// decides whether a conversion actually happens — the frontend just sends the
// desired unit.
const UNIT_OPTIONS = ['mg', 'g', 'kg', 'oz', 'lb', 'pcs', 'box', 'ml', 'l', 'tsp', 'tbsp', 'cups']

function formatQuantity(quantity) {
  return quantity === null || quantity === undefined ? '' : String(quantity)
}

function ShoppingListItem({ item, onTogglePurchased, onDelete, onChangeUnit }) {
  const unitOptions =
    item.unit && !UNIT_OPTIONS.includes(item.unit) ? [item.unit, ...UNIT_OPTIONS] : UNIT_OPTIONS

  return (
    <li className={`shopping-item${item.purchased ? ' shopping-item--purchased' : ''}`}>
      <label className="shopping-item__label">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={() => onTogglePurchased(item.id)}
        />
        <span className="shopping-item__name">{item.name}</span>
      </label>

      <div className="shopping-item__quantity">
        {item.quantity != null && (
          <span className="shopping-item__quantity-value">{formatQuantity(item.quantity)}</span>
        )}
        <select
          className="shopping-item__unit"
          value={item.unit ?? ''}
          onChange={(event) => onChangeUnit(item.id, event.target.value)}
          aria-label={`Unit for ${item.name}`}
        >
          {!item.unit && <option value="">–</option>}
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

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
