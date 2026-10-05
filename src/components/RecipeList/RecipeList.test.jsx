import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecipeList from './RecipeList.jsx'

const recipes = [
  {
    id: 1,
    title: 'Pancakes',
    sourceType: 'MANUAL',
    createdAt: '2026-01-01T00:00:00Z',
    ingredients: [{ id: 1, name: 'Flour', quantity: 200, unit: 'g' }],
  },
  {
    id: 2,
    title: 'Soup',
    sourceType: 'URL',
    createdAt: '2026-01-02T00:00:00Z',
    ingredients: [{ id: 2, name: 'Water', quantity: 1, unit: 'l' }],
  },
]

const noop = () => {}

test('renders every recipe with its ingredients', () => {
  render(<RecipeList recipes={recipes} onDelete={noop} />)

  expect(screen.getByText(/pancakes/i)).toBeInTheDocument()
  expect(screen.getByText(/flour/i)).toBeInTheDocument()
  expect(screen.getByText(/soup/i)).toBeInTheDocument()
  expect(screen.getByText(/water/i)).toBeInTheDocument()
})

test('calls onDelete with the recipe id when delete is clicked', async () => {
  const onDelete = vi.fn()
  const user = userEvent.setup()

  render(<RecipeList recipes={recipes} onDelete={onDelete} />)

  await user.click(screen.getByRole('button', { name: /delete pancakes/i }))

  expect(onDelete).toHaveBeenCalledWith(1)
})

test('shows an empty state message when there are no recipes', () => {
  render(<RecipeList recipes={[]} onDelete={noop} />)

  expect(screen.getByText(/no saved recipes/i)).toBeInTheDocument()
})
