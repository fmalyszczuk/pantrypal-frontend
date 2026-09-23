import { request, postJson, deleteResource } from './client.js'

// GET /shopping-list returns a plain array of ShoppingListItem, not a
// wrapper object — confirmed against ../../README.md (backend context doc).
export function getShoppingList() {
  return request('/shopping-list')
}

export function addShoppingListItem({ name, quantity, unit }) {
  return postJson('/shopping-list/items', { name, quantity, unit })
}

// Deletes by NAME (case-insensitive), not id — this is how the backend
// route is defined (DELETE /shopping-list/items/{name}), confirmed in
// ../../README.md. No-op (still 204) if the name doesn't exist.
export function deleteShoppingListItem(name) {
  return deleteResource(`/shopping-list/items/${encodeURIComponent(name)}`)
}

// There is currently NO endpoint to toggle `purchased` — confirmed in
// ../../README.md under "What's NOT built yet". Until the backend adds a
// PATCH/PUT for this, ShoppingListPage toggles it locally only.
