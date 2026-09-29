import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ManualRecipeForm from './ManualRecipeForm.jsx'
import { createManualRecipe } from '../../api/recipes.js'

vi.mock('../../api/recipes.js', () => ({
  createManualRecipe: vi.fn(),
}))

test('submits the title and ingredients and calls onExtracted with the result', async () => {
  const recipe = { title: 'Soup', ingredients: [{ name: 'Water', quantity: 2, unit: 'l' }] }
  createManualRecipe.mockResolvedValue(recipe)
  const onExtracted = vi.fn()
  const user = userEvent.setup()

  render(<ManualRecipeForm onExtracted={onExtracted} />)

  await user.type(screen.getByLabelText(/recipe title/i), 'Soup')
  await user.type(screen.getByLabelText(/ingredient 1 name/i), 'Water')
  await user.type(screen.getByLabelText(/ingredient 1 quantity/i), '2')
  await user.type(screen.getByLabelText(/ingredient 1 unit/i), 'l')
  await user.click(screen.getByRole('button', { name: /save recipe/i }))

  expect(createManualRecipe).toHaveBeenCalledWith({
    title: 'Soup',
    ingredients: [{ name: 'Water', quantity: 2, unit: 'l' }],
  })
  await screen.findByLabelText(/recipe title/i)
  expect(onExtracted).toHaveBeenCalledWith(recipe)
})

test('adds and removes ingredient rows', async () => {
  const user = userEvent.setup()
  render(<ManualRecipeForm onExtracted={() => {}} />)

  await user.click(screen.getByRole('button', { name: /add ingredient/i }))
  expect(screen.getByLabelText(/ingredient 2 name/i)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /remove ingredient 2/i }))
  expect(screen.queryByLabelText(/ingredient 2 name/i)).not.toBeInTheDocument()
})

test('shows an error message when saving fails', async () => {
  createManualRecipe.mockRejectedValue(new Error('title is required'))
  const user = userEvent.setup()

  render(<ManualRecipeForm onExtracted={() => {}} />)

  await user.type(screen.getByLabelText(/recipe title/i), 'Soup')
  await user.type(screen.getByLabelText(/ingredient 1 name/i), 'Water')
  await user.click(screen.getByRole('button', { name: /save recipe/i }))

  expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
})
