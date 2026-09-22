import { request } from './client.js'

export function getShoppingList() {
  return request('/shopping-list')
}
