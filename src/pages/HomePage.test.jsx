import { render, screen } from '@testing-library/react'
import HomePage from './HomePage.jsx'

test('shows the app title and all four ways to add a recipe', () => {
  render(<HomePage />)

  expect(screen.getByRole('heading', { level: 1, name: /pantrypal/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /paste a link/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /type it in/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /search by name/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /upload a file/i })).toBeInTheDocument()
})

test('marks the not-yet-wired ways as unavailable, and only those', () => {
  render(<HomePage />)

  expect(screen.getAllByText(/not yet available/i)).toHaveLength(1)

  const pasteALink = screen.getByRole('heading', { name: /paste a link/i }).closest('li')
  expect(pasteALink).not.toHaveTextContent(/not yet available/i)

  const typeItIn = screen.getByRole('heading', { name: /type it in/i }).closest('li')
  expect(typeItIn).not.toHaveTextContent(/not yet available/i)

  const uploadAFile = screen.getByRole('heading', { name: /upload a file/i }).closest('li')
  expect(uploadAFile).not.toHaveTextContent(/not yet available/i)
})
