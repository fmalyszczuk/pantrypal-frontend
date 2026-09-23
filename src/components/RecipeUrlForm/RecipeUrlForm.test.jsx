import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RecipeUrlForm from './RecipeUrlForm.jsx'
import { extractFromUrl } from '../../api/recipes.js'

vi.mock('../../api/recipes.js', () => ({
  extractFromUrl: vi.fn(),
}))

test('submits the url and calls onExtracted with the result', async () => {
  const recipe = { title: 'Soup', ingredients: [{ name: 'Water' }] }
  extractFromUrl.mockResolvedValue(recipe)
  const onExtracted = vi.fn()
  const user = userEvent.setup()

  render(<RecipeUrlForm onExtracted={onExtracted} />)

  await user.type(screen.getByLabelText(/recipe url/i), 'https://example.com/soup')
  await user.click(screen.getByRole('button', { name: /extract/i }))

  expect(extractFromUrl).toHaveBeenCalledWith('https://example.com/soup')
  await screen.findByLabelText(/recipe url/i)
  expect(onExtracted).toHaveBeenCalledWith(recipe)
})

test('shows an error message when extraction fails', async () => {
  extractFromUrl.mockRejectedValue(new Error('bad url'))
  const user = userEvent.setup()

  render(<RecipeUrlForm onExtracted={() => {}} />)

  await user.type(screen.getByLabelText(/recipe url/i), 'https://example.com/broken')
  await user.click(screen.getByRole('button', { name: /extract/i }))

  expect(await screen.findByText(/bad url/i)).toBeInTheDocument()
})
