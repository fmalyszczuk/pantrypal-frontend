import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import AddItemForm from './AddItemForm.jsx'

test('submits the name, quantity, and unit and clears the form on success', async () => {
  const onAdd = vi.fn().mockResolvedValue()
  const user = userEvent.setup()

  render(<AddItemForm onAdd={onAdd} />)

  await user.type(screen.getByLabelText(/item name/i), 'Milk')
  await user.type(screen.getByLabelText(/item quantity/i), '2')
  await user.type(screen.getByLabelText(/item unit/i), 'l')
  await user.click(screen.getByRole('button', { name: /add item/i }))

  expect(onAdd).toHaveBeenCalledWith({ name: 'Milk', quantity: 2, unit: 'l' })
  expect(await screen.findByLabelText(/item name/i)).toHaveValue('')
})

test('submits with null quantity and unit when they are left blank', async () => {
  const onAdd = vi.fn().mockResolvedValue()
  const user = userEvent.setup()

  render(<AddItemForm onAdd={onAdd} />)

  await user.type(screen.getByLabelText(/item name/i), 'Eggs')
  await user.click(screen.getByRole('button', { name: /add item/i }))

  expect(onAdd).toHaveBeenCalledWith({ name: 'Eggs', quantity: null, unit: null })
})

test('shows an error message when adding fails and keeps the entered values', async () => {
  const onAdd = vi.fn().mockRejectedValue(new Error('backend is down'))
  const user = userEvent.setup()

  render(<AddItemForm onAdd={onAdd} />)

  await user.type(screen.getByLabelText(/item name/i), 'Milk')
  await user.click(screen.getByRole('button', { name: /add item/i }))

  expect(await screen.findByText(/backend is down/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/item name/i)).toHaveValue('Milk')
})
