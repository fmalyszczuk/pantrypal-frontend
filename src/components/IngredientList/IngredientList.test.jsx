import { render, screen } from '@testing-library/react'
import IngredientList from './IngredientList.jsx'

test('renders each ingredient with its quantity and unit', () => {
  const ingredients = [
    { name: 'Flour', quantity: 2, unit: 'cups' },
    { name: 'Salt', quantity: 1, unit: 'tsp' },
  ]

  render(<IngredientList ingredients={ingredients} />)

  expect(screen.getByText('2 cups Flour')).toBeInTheDocument()
  expect(screen.getByText('1 tsp Salt')).toBeInTheDocument()
})

test('renders ingredients missing quantity or unit without extra spaces', () => {
  render(<IngredientList ingredients={[{ name: 'Salt' }]} />)

  expect(screen.getByText('Salt')).toBeInTheDocument()
})

test('shows an empty state when there are no ingredients', () => {
  render(<IngredientList ingredients={[]} />)

  expect(screen.getByText(/no ingredients/i)).toBeInTheDocument()
})
