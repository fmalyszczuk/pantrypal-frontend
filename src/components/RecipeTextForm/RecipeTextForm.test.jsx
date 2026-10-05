import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecipeTextForm from './RecipeTextForm.jsx'
import { extractFromText } from '../../api/recipes.js'

vi.mock('../../api/recipes.js', () => ({
  extractFromText: vi.fn(),
}))

test('submits the dish name and calls onExtracted with the result', async () => {
  const recipe = { title: 'Carbonara', ingredients: [{ name: 'Pasta' }] }
  extractFromText.mockResolvedValue(recipe)
  const onExtracted = vi.fn()
  const user = userEvent.setup()

  render(<RecipeTextForm onExtracted={onExtracted} />)

  await user.type(screen.getByLabelText(/dish name/i), 'spaghetti carbonara')
  await user.click(screen.getByRole('button', { name: /search/i }))

  expect(extractFromText).toHaveBeenCalledWith('spaghetti carbonara')
  await screen.findByLabelText(/dish name/i)
  expect(onExtracted).toHaveBeenCalledWith(recipe)
})

test('shows an error message when the search fails', async () => {
  extractFromText.mockRejectedValue(new Error('no such dish'))
  const user = userEvent.setup()

  render(<RecipeTextForm onExtracted={() => {}} />)

  await user.type(screen.getByLabelText(/dish name/i), 'nonsense dish')
  await user.click(screen.getByRole('button', { name: /search/i }))

  expect(await screen.findByText(/no such dish/i)).toBeInTheDocument()
})
