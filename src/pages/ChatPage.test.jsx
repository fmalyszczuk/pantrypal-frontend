import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ChatPage from './ChatPage.jsx'
import { sendChatMessage, forgetConversation } from '../api/chat.js'

vi.mock('../api/chat.js', () => ({
  sendChatMessage: vi.fn(),
  forgetConversation: vi.fn(),
}))

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
  forgetConversation.mockResolvedValue(null)
})

test('sends the first message with no conversationId, then reuses the id the backend returns', async () => {
  sendChatMessage.mockResolvedValue({ reply: 'Added eggs.', conversationId: 'abc-123' })
  const user = userEvent.setup()

  render(<ChatPage />)

  await user.type(screen.getByLabelText(/chat message/i), 'add eggs')
  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(await screen.findByText(/added eggs/i)).toBeInTheDocument()
  expect(sendChatMessage).toHaveBeenCalledWith('add eggs', null)

  sendChatMessage.mockResolvedValue({ reply: 'Added milk.', conversationId: 'abc-123' })
  await user.type(screen.getByLabelText(/chat message/i), 'and milk')
  await user.click(screen.getByRole('button', { name: /send/i }))

  await screen.findByText(/added milk/i)
  expect(sendChatMessage).toHaveBeenLastCalledWith('and milk', 'abc-123')
})

test('clearing the chat forgets the conversation on the backend and resets locally', async () => {
  sendChatMessage.mockResolvedValue({ reply: 'Added eggs.', conversationId: 'abc-123' })
  const user = userEvent.setup()

  render(<ChatPage />)

  await user.type(screen.getByLabelText(/chat message/i), 'add eggs')
  await user.click(screen.getByRole('button', { name: /send/i }))
  await screen.findByText(/added eggs/i)

  await user.click(screen.getByRole('button', { name: /clear chat/i }))

  expect(forgetConversation).toHaveBeenCalledWith('abc-123')
  expect(screen.queryByText(/added eggs/i)).not.toBeInTheDocument()

  sendChatMessage.mockResolvedValue({ reply: 'Hi again.', conversationId: 'def-456' })
  await user.type(screen.getByLabelText(/chat message/i), 'hello')
  await user.click(screen.getByRole('button', { name: /send/i }))

  await screen.findByText(/hi again/i)
  expect(sendChatMessage).toHaveBeenLastCalledWith('hello', null)
})

test('shows an error message when the backend call fails', async () => {
  sendChatMessage.mockRejectedValue(new Error('backend is down'))
  const user = userEvent.setup()

  render(<ChatPage />)

  await user.type(screen.getByLabelText(/chat message/i), 'add eggs')
  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(await screen.findByText(/backend is down/i)).toBeInTheDocument()
})
