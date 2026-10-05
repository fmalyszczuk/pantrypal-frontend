import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecipesPage from './RecipesPage.jsx'
import { listRecipes, deleteRecipe } from '../api/recipes.js'

vi.mock('../api/recipes.js', () => ({
  listRecipes: vi.fn(),
  deleteRecipe: vi.fn(),
}))

const recipes = [
  { id: 1, title: 'Pancakes', sourceType: 'MANUAL', createdAt: null, ingredients: [] },
  { id: 2, title: 'Soup', sourceType: 'URL', createdAt: null, ingredients: [] },
]

beforeEach(() => {
  vi.clearAllMocks()
  listRecipes.mockResolvedValue(recipes)
  deleteRecipe.mockResolvedValue(null)
  vi.spyOn(window, 'confirm').mockReturnValue(true)
})

test('loads and displays saved recipes', async () => {
  render(<RecipesPage />)

  expect(await screen.findByText(/pancakes/i)).toBeInTheDocument()
  expect(screen.getByText(/soup/i)).toBeInTheDocument()
})

test('shows an error message when recipes fail to load', async () => {
  listRecipes.mockRejectedValue(new Error('backend is down'))

  render(<RecipesPage />)

  expect(await screen.findByText(/backend is down/i)).toBeInTheDocument()
})

test('deleting a recipe asks for confirmation twice, then deletes it', async () => {
  const user = userEvent.setup()
  render(<RecipesPage />)

  await screen.findByText(/pancakes/i)
  await user.click(screen.getByRole('button', { name: /delete pancakes/i }))

  expect(window.confirm).toHaveBeenCalledTimes(2)
  expect(deleteRecipe).toHaveBeenCalledWith(1, { removeFromShoppingList: true })
  expect(screen.queryByText(/pancakes/i)).not.toBeInTheDocument()
  expect(screen.getByText(/soup/i)).toBeInTheDocument()
})

test('skipping the "remove from shopping list" confirmation still deletes the recipe', async () => {
  window.confirm.mockReturnValueOnce(true).mockReturnValueOnce(false)
  const user = userEvent.setup()
  render(<RecipesPage />)

  await screen.findByText(/pancakes/i)
  await user.click(screen.getByRole('button', { name: /delete pancakes/i }))

  expect(deleteRecipe).toHaveBeenCalledWith(1, { removeFromShoppingList: false })
})

test('declining the first confirmation leaves the recipe untouched', async () => {
  window.confirm.mockReturnValue(false)
  const user = userEvent.setup()
  render(<RecipesPage />)

  await screen.findByText(/pancakes/i)
  await user.click(screen.getByRole('button', { name: /delete pancakes/i }))

  expect(deleteRecipe).not.toHaveBeenCalled()
  expect(screen.getByText(/pancakes/i)).toBeInTheDocument()
})

test('restores the recipe if deleting fails on the backend', async () => {
  deleteRecipe.mockRejectedValue(new Error('backend is down'))
  const user = userEvent.setup()
  render(<RecipesPage />)

  await screen.findByText(/pancakes/i)
  await user.click(screen.getByRole('button', { name: /delete pancakes/i }))

  expect(await screen.findByText(/pancakes/i)).toBeInTheDocument()
})

test('shows an empty state when there are no saved recipes', async () => {
  listRecipes.mockResolvedValue([])

  render(<RecipesPage />)

  expect(await screen.findByText(/no saved recipes/i)).toBeInTheDocument()
})
