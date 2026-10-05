import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ChatMessage from './ChatMessage.jsx'

test('renders a plain message with no actions', () => {
  render(<ChatMessage message={{ id: '1', role: 'assistant', text: 'Hi there' }} />)

  expect(screen.getByText('Hi there')).toBeInTheDocument()
  expect(screen.queryByText(/✓ shopping list updated/i)).not.toBeInTheDocument()
})

test('shows a note when the shopping list changed', () => {
  render(
    <ChatMessage
      message={{ id: '1', role: 'assistant', text: 'Added eggs.', shoppingListChanged: true }}
    />,
  )

  expect(screen.getByText(/shopping list updated/i)).toBeInTheDocument()
})

test('lists each action with its status', () => {
  const message = {
    id: '1',
    role: 'assistant',
    text: 'Done.',
    actions: [
      { tool: 'add_item', arguments: {}, status: 'ok', result: {} },
      { tool: 'clear_list', arguments: {}, status: 'error', result: 'boom' },
    ],
  }

  render(<ChatMessage message={message} />)

  expect(screen.getByText(/add item.*done/i)).toBeInTheDocument()
  expect(screen.getByText(/clear list.*failed/i)).toBeInTheDocument()
})

test('marks an incomplete reply distinctly', () => {
  render(
    <ChatMessage message={{ id: '1', role: 'assistant', text: 'Sorry, I gave up.', incomplete: true }} />,
  )

  expect(screen.getByText(/sorry, i gave up/i)).toHaveClass('chat-message__bubble--incomplete')
})

test('offers quick yes/no replies when an action needs confirmation', async () => {
  const onQuickReply = vi.fn()
  const user = userEvent.setup()
  const message = {
    id: '1',
    role: 'assistant',
    text: 'Clear the whole list?',
    actions: [{ tool: 'clear_list', arguments: {}, status: 'confirmation_required', result: null }],
  }

  render(<ChatMessage message={message} onQuickReply={onQuickReply} />)

  await user.click(screen.getByRole('button', { name: /yes/i }))
  expect(onQuickReply).toHaveBeenCalledWith('yes')

  await user.click(screen.getByRole('button', { name: /no/i }))
  expect(onQuickReply).toHaveBeenCalledWith('no')
})

test('does not offer quick replies when no action needs confirmation', () => {
  const message = {
    id: '1',
    role: 'assistant',
    text: 'Added eggs.',
    actions: [{ tool: 'add_item', arguments: {}, status: 'ok', result: {} }],
  }

  render(<ChatMessage message={message} onQuickReply={() => {}} />)

  expect(screen.queryByRole('button', { name: /yes/i })).not.toBeInTheDocument()
})
