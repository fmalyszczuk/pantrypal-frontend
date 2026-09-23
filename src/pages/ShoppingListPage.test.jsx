import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ShoppingListPage from './ShoppingListPage.jsx'
import {
  getShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
  clearShoppingList,
} from '../api/shoppingList.js'

vi.mock('../api/shoppingList.js', () => ({
  getShoppingList: vi.fn(),
  updateShoppingListItem: vi.fn(),
  deleteShoppingListItem: vi.fn(),
  clearShoppingList: vi.fn(),
}))

const items = [
  { id: 1, name: 'eggs', quantity: 2, unit: 'pcs', purchased: false },
  { id: 2, name: 'flour', quantity: 200, unit: 'g', purchased: false },
]

beforeEach(() => {
  vi.clearAllMocks()
  getShoppingList.mockResolvedValue(items)
  updateShoppingListItem.mockResolvedValue({})
  deleteShoppingListItem.mockResolvedValue(null)
  clearShoppingList.mockResolvedValue(null)
  vi.spyOn(window, 'confirm').mockReturnValue(true)
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

test('changing a unit sends only the unit and displays the converted quantity from the response', async () => {
  // eggs is `pcs` (locked, no dropdown); flour is `g` (weight, editable).
  updateShoppingListItem.mockResolvedValue({
    id: 2,
    name: 'flour',
    quantity: 0.2,
    unit: 'kg',
    purchased: false,
  })
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/flour/i)
  await user.selectOptions(screen.getAllByRole('combobox')[0], 'kg')

  expect(updateShoppingListItem).toHaveBeenCalledWith('flour', { unit: 'kg' })
  expect(await screen.findByText('0.2')).toBeInTheDocument()
})

test('locks the unit control for items with no weight/volume unit', async () => {
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)

  // eggs is `pcs`, so it has no editable unit control — only flour's does.
  expect(screen.getAllByRole('combobox')).toHaveLength(1)
})

test('clicking "Clear list" asks for confirmation, then clears everything', async () => {
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)
  await user.click(screen.getByRole('button', { name: /clear list/i }))

  expect(window.confirm).toHaveBeenCalled()
  expect(clearShoppingList).toHaveBeenCalled()
  expect(screen.queryByText(/eggs/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/flour/i)).not.toBeInTheDocument()
  expect(screen.getByText(/empty/i)).toBeInTheDocument()
})

test('declining the confirmation leaves the list untouched', async () => {
  window.confirm.mockReturnValue(false)
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)
  await user.click(screen.getByRole('button', { name: /clear list/i }))

  expect(clearShoppingList).not.toHaveBeenCalled()
  expect(screen.getByText(/eggs/i)).toBeInTheDocument()
})

test('restores the list if clearing fails on the backend', async () => {
  clearShoppingList.mockRejectedValue(new Error('backend is down'))
  const user = userEvent.setup()
  render(<ShoppingListPage />)

  await screen.findByText(/eggs/i)
  await user.click(screen.getByRole('button', { name: /clear list/i }))

  expect(await screen.findByText(/eggs/i)).toBeInTheDocument()
  expect(screen.getByText(/flour/i)).toBeInTheDocument()
})

test('the clear button is not shown when the list is already empty', async () => {
  getShoppingList.mockResolvedValue([])
  render(<ShoppingListPage />)

  await screen.findByText(/empty/i)

  expect(screen.queryByRole('button', { name: /clear list/i })).not.toBeInTheDocument()
})
