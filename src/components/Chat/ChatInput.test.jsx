import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ChatInput from './ChatInput.jsx'

test('sends the trimmed message and clears the field', async () => {
  const onSend = vi.fn()
  const user = userEvent.setup()

  render(<ChatInput onSend={onSend} disabled={false} />)

  const input = screen.getByLabelText(/chat message/i)
  await user.type(input, '  hello  ')
  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(onSend).toHaveBeenCalledWith('hello')
  expect(input).toHaveValue('')
})

test('does not send an empty or whitespace-only message', async () => {
  const onSend = vi.fn()
  const user = userEvent.setup()

  render(<ChatInput onSend={onSend} disabled={false} />)

  await user.type(screen.getByLabelText(/chat message/i), '   ')
  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(onSend).not.toHaveBeenCalled()
})

test('disables the input and button while disabled is true', () => {
  render(<ChatInput onSend={() => {}} disabled />)

  expect(screen.getByLabelText(/chat message/i)).toBeDisabled()
  expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
})
