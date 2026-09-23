import './ShoppingListItem.css'

// Matches the backend's unit groups (see ../../README.md's "Unit conversion"
// note under PATCH /shopping-list/items/{name}): the quantity only
// auto-converts when moving within a group, never across. Notably `oz` here
// means *fluid* ounce (volume), not weight ounce — the backend doesn't
// recognize a weight ounce at all.
const WEIGHT_UNITS = ['mg', 'g', 'kg', 'lb']
const VOLUME_UNITS = ['ml', 'l', 'pint', 'oz', 'tsp', 'tbsp', 'cup']

function getUnitGroup(unit) {
  if (WEIGHT_UNITS.includes(unit)) return 'weight'
  if (VOLUME_UNITS.includes(unit)) return 'volume'
  return 'other'
}

function formatQuantity(quantity) {
  return quantity === null || quantity === undefined ? '' : String(quantity)
}

function ShoppingListItem({ item, onTogglePurchased, onDelete, onChangeUnit }) {
  // Only offer units from the item's own group — switching group (e.g.
  // weight -> volume) wouldn't convert the quantity, just relabel it, which
  // the dropdown shouldn't invite. Items with no recognized weight/volume
  // unit (pcs, box, a custom unit, or no unit at all) have nothing safe to
  // convert to, so the control is locked instead of offering a dropdown.
  const group = getUnitGroup(item.unit)
  const groupUnits = group === 'weight' ? WEIGHT_UNITS : group === 'volume' ? VOLUME_UNITS : null

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
        {groupUnits ? (
          <select
            className="shopping-item__unit"
            value={item.unit}
            onChange={(event) => onChangeUnit(item.id, event.target.value)}
            aria-label={`Unit for ${item.name}`}
          >
            {groupUnits.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        ) : (
          <span
            className="shopping-item__unit shopping-item__unit--locked"
            title="Only weight (mg/g/kg/lb) or volume (ml/l/pint/oz/tsp/tbsp/cup) units can be changed here"
          >
            {item.unit || '–'} 🔒
          </span>
        )}
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
