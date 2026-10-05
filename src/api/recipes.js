import { postJson, request, deleteResource } from './client.js'

export function listRecipes() {
  return request('/recipes')
}

// DELETE /recipes/{id}: 204 on success, 404 if the id doesn't exist.
// removeFromShoppingList also subtracts the recipe's ingredients from the
// shopping list; left off (the default), the recipe is deleted but the
// shopping list is untouched.
export function deleteRecipe(id, { removeFromShoppingList = false } = {}) {
  const query = removeFromShoppingList ? '?removeFromShoppingList=true' : ''
  return deleteResource(`/recipes/${id}${query}`)
}

export function extractFromUrl(url) {
  return postJson('/recipes/from-url', { url })
}

// POST /recipes: manual entry, no LLM/scraping involved. ingredients is a
// list of { name, quantity, unit } — quantity/unit are optional per item.
export function createManualRecipe({ title, ingredients }) {
  return postJson('/recipes', { title, ingredients })
}

export function extractFromText(query) {
  return postJson('/recipes/from-text', { query })
}

export function extractFromFile(file) {
  const body = new FormData()
  body.append('file', file)
  // No Content-Type header: the browser sets the multipart boundary itself.
  return request('/recipes/from-file', { method: 'POST', body })
}
