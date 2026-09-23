import { useState } from 'react'
import ChatWindow from '../components/Chat/ChatWindow.jsx'
import ChatInput from '../components/Chat/ChatInput.jsx'
import { sendChatMessage } from '../api/chat.js'
import { useLocalStorageState } from '../hooks/useLocalStorageState.js'
import './ChatPage.css'

// Confirmed against ../../README.md: POST /chat is real and matches this
// shape. Its reply text isn't always accurate about the resulting shopping-
// list state (the backend can under/over-describe what it changed), so once
// this page shares state with the shopping list, re-fetch GET /shopping-list
// after a reply rather than trusting response.reply for the list contents.

// The backend has no chat-history storage (each /chat call is just
// { message } -> { reply }, no history param), so this is purely a
// frontend convenience: it persists to this browser only, not synced with
// the backend or other devices.
const HISTORY_KEY = 'pantrypal:chat-history'

function ChatPage() {
  const [messages, setMessages] = useLocalStorageState(HISTORY_KEY, [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleSend(text) {
    const userMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((current) => [...current, userMessage])
    setError(null)
    setIsLoading(true)

    sendChatMessage(text)
      .then((response) => {
        setMessages((current) => [
          ...current,
          { id: crypto.randomUUID(), role: 'assistant', text: response.reply },
        ])
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="chat-page">
      <div className="chat-page__header">
        <h1 className="chat-page__title">Chat</h1>
        {messages.length > 0 && (
          <button
            type="button"
            className="chat-page__clear"
            onClick={() => setMessages([])}
          >
            Clear chat
          </button>
        )}
      </div>
      <ChatWindow messages={messages} isLoading={isLoading} />
      {error && <p className="chat-page__error">Couldn't get a response: {error}</p>}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}

export default ChatPage
