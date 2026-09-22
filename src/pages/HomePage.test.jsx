import { render, screen } from '@testing-library/react'
import HomePage from './HomePage.jsx'

test('shows the app title and all three ways to add a recipe', () => {
  render(<HomePage />)

  expect(screen.getByRole('heading', { level: 1, name: /pantrypal/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /paste a link/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /search by name/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /upload a file/i })).toBeInTheDocument()
})
