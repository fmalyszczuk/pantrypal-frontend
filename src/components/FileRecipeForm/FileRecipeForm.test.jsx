import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import FileRecipeForm from './FileRecipeForm.jsx'
import { extractFromFile } from '../../api/recipes.js'

vi.mock('../../api/recipes.js', () => ({
  extractFromFile: vi.fn(),
}))

function makeFile(name = 'recipe.pdf', type = 'application/pdf') {
  return new File(['recipe content'], name, { type })
}

test('submits the selected file and calls onExtracted with the result', async () => {
  const recipe = { title: 'Soup', ingredients: [{ name: 'Water' }] }
  extractFromFile.mockResolvedValue(recipe)
  const onExtracted = vi.fn()
  const user = userEvent.setup()
  const file = makeFile()

  render(<FileRecipeForm onExtracted={onExtracted} />)

  await user.upload(screen.getByLabelText(/recipe file/i), file)
  await user.click(screen.getByRole('button', { name: /extract/i }))

  expect(extractFromFile).toHaveBeenCalledWith(file)
  await screen.findByLabelText(/recipe file/i)
  expect(onExtracted).toHaveBeenCalledWith(recipe)
})

test('disables the submit button until a file is chosen', () => {
  render(<FileRecipeForm onExtracted={() => {}} />)
  expect(screen.getByRole('button', { name: /extract/i })).toBeDisabled()
})

test('shows an error message when extraction fails', async () => {
  extractFromFile.mockRejectedValue(new Error('unsupported file type'))
  const user = userEvent.setup()

  render(<FileRecipeForm onExtracted={() => {}} />)

  await user.upload(screen.getByLabelText(/recipe file/i), makeFile())
  await user.click(screen.getByRole('button', { name: /extract/i }))

  expect(await screen.findByText(/unsupported file type/i)).toBeInTheDocument()
})
