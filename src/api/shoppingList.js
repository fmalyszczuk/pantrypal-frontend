import { request, postJson, patchJson, deleteResource } from './client.js'

// GET /shopping-list returns a plain array of ShoppingListItem, not a
// wrapper object — confirmed against ../../README.md (backend context doc).
export function getShoppingList() {
  return request('/shopping-list')
}

export function addShoppingListItem({ name, quantity, unit }) {
  return postJson('/shopping-list/items', { name, quantity, unit })
}

// Matched by NAME (case-insensitive), not id — confirmed in ../../README.md.
// PATCH semantics: pass only the fields to change (e.g. { purchased: true }),
// fields left out are unchanged. 404s (plain text body) if the name no
// longer exists.
export function updateShoppingListItem(name, updates) {
  return patchJson(`/shopping-list/items/${encodeURIComponent(name)}`, updates)
}

// Deletes by NAME (case-insensitive), not id — this is how the backend
// route is defined (DELETE /shopping-list/items/{name}), confirmed in
// ../../README.md. No-op (still 204) if the name doesn't exist.
export function deleteShoppingListItem(name) {
  return deleteResource(`/shopping-list/items/${encodeURIComponent(name)}`)
}

// Wipes every item on the list in one call. Per ../../README.md, this is a
// hard delete with no confirmation or undo at the API level — the frontend
// is responsible for confirming with the user before calling this.
export function clearShoppingList() {
  return deleteResource('/shopping-list')
}
