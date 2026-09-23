import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ShoppingListPage from './ShoppingListPage.jsx'
import {
  getShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
} from '../api/shoppingList.js'

vi.mock('../api/shoppingList.js', () => ({
  getShoppingList: vi.fn(),
  updateShoppingListItem: vi.fn(),
  deleteShoppingListItem: vi.fn(),
}))

const items = [
  { id: 1, name: 'eggs', quantity: 2, unit: 'pcs', purchased: false },
  { id: 2, name: 'flour', quantity: 200, unit: 'g', purchased: false },
]

beforeEach(() => {
  getShoppingList.mockResolvedValue(items)
  updateShoppingListItem.mockResolvedValue({})
  deleteShoppingListItem.mockResolvedValue(null)
})

test('loads and displays the shopping list', async () => {
  render(<ShoppingListPage />)

  expect(await screen.findByText(/eggs/i)).toBeInTheDocument()
  expect(screen.getByText(/flour/i)).toBeInTheDocument()
})

test('shows an error message when the list fails to load', async () => {
  getShoppingList.mockRejectedValue(new Error('backend is down'))

  render(<ShoppingListPage />)

  expect(await screen.findByText(/backend is down/i)).toBeInTheDocument()
})

test('toggling purchased calls the API with the item name, not id', async () => {
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)
  await user.click(screen.getAllByRole('checkbox')[0])

  expect(updateShoppingListItem).toHaveBeenCalledWith('eggs', { purchased: true })
})

test('deleting an item calls the API with the item name, not id', async () => {
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)
  await user.click(screen.getByRole('button', { name: /delete eggs/i }))

  expect(deleteShoppingListItem).toHaveBeenCalledWith('eggs')
  expect(screen.queryByText(/eggs/i)).not.toBeInTheDocument()
})
