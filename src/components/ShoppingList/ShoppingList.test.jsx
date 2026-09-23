import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ShoppingList from './ShoppingList.jsx'

const items = [
  { id: '1', name: 'Milk', quantity: 1, unit: 'l', purchased: false },
  { id: '2', name: 'Eggs', quantity: 12, unit: '', purchased: true },
]

const noop = () => {}

test('renders every item', () => {
  render(
    <ShoppingList items={items} onTogglePurchased={noop} onDelete={noop} onChangeUnit={noop} />,
  )

  expect(screen.getByText(/milk/i)).toBeInTheDocument()
  expect(screen.getByText(/eggs/i)).toBeInTheDocument()
})

test('shows purchased items as checked', () => {
  render(
    <ShoppingList items={items} onTogglePurchased={noop} onDelete={noop} onChangeUnit={noop} />,
  )

  const [milkCheckbox, eggsCheckbox] = screen.getAllByRole('checkbox')
  expect(milkCheckbox).not.toBeChecked()
  expect(eggsCheckbox).toBeChecked()
})

test('calls onTogglePurchased with the item id when its checkbox is clicked', async () => {
  const onTogglePurchased = vi.fn()
  const user = userEvent.setup()

  render(
    <ShoppingList
      items={items}
      onTogglePurchased={onTogglePurchased}
      onDelete={noop}
      onChangeUnit={noop}
    />,
  )

  await user.click(screen.getAllByRole('checkbox')[0])

  expect(onTogglePurchased).toHaveBeenCalledWith('1')
})

test('calls onDelete with the item id when delete is clicked', async () => {
  const onDelete = vi.fn()
  const user = userEvent.setup()

  render(
    <ShoppingList items={items} onTogglePurchased={noop} onDelete={onDelete} onChangeUnit={noop} />,
  )

  await user.click(screen.getByRole('button', { name: /delete milk/i }))

  expect(onDelete).toHaveBeenCalledWith('1')
})

test('calls onChangeUnit with the item id and the newly selected unit', async () => {
  const onChangeUnit = vi.fn()
  const user = userEvent.setup()

  render(
    <ShoppingList
      items={items}
      onTogglePurchased={noop}
      onDelete={noop}
      onChangeUnit={onChangeUnit}
    />,
  )

  await user.selectOptions(screen.getAllByRole('combobox')[0], 'kg')

  expect(onChangeUnit).toHaveBeenCalledWith('1', 'kg')
})

test('shows an empty state message when there are no items', () => {
  render(<ShoppingList items={[]} onTogglePurchased={noop} onDelete={noop} onChangeUnit={noop} />)

  expect(screen.getByText(/empty/i)).toBeInTheDocument()
})
