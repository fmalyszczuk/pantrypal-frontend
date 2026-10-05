import { useState } from 'react'
import ChatWindow from '../components/Chat/ChatWindow.jsx'
import ChatInput from '../components/Chat/ChatInput.jsx'
import { sendChatMessage, forgetConversation } from '../api/chat.js'
import { useLocalStorageState } from '../hooks/useLocalStorageState.js'
import './ChatPage.css'

// The displayed messages are a frontend-only convenience (see ../../README.md:
// the backend has no endpoint to fetch history back). The conversationId is
// what actually gives the backend memory: send back the id it returned so
// follow-ups like "make it 3 kg" resolve against the same conversation.
const HISTORY_KEY = 'pantrypal:chat-history'
const CONVERSATION_ID_KEY = 'pantrypal:chat-conversation-id'

function ChatPage() {
  const [messages, setMessages] = useLocalStorageState(HISTORY_KEY, [])
  const [conversationId, setConversationId] = useLocalStorageState(CONVERSATION_ID_KEY, null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleSend(text) {
    const userMessage = { id: crypto.randomUUID(), role: 'user', text }
    setMessages((current) => [...current, userMessage])
    setError(null)
    setIsLoading(true)

    sendChatMessage(text, conversationId)
      .then((response) => {
        setConversationId(response.conversationId)
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: response.reply,
            actions: response.actions,
            incomplete: response.incomplete,
            shoppingListChanged: response.shoppingListChanged,
          },
        ])
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => setIsLoading(false))
  }

  function handleClear() {
    setMessages([])
    // Best-effort: the visible history is already gone either way, since it
    // only ever lived in localStorage. This just tells the backend to drop
    // its memory of the conversation too, so a stale conversationId isn't
    // reused by accident.
    if (conversationId) {
      forgetConversation(conversationId).catch((err) => {
        console.warn('Could not forget the conversation on the backend:', err.message)
      })
    }
    setConversationId(null)
  }

  return (
    <div className="chat-page">
      <div className="chat-page__header">
        <h1 className="chat-page__title">Chat</h1>
        {messages.length > 0 && (
          <button
            type="button"
            className="chat-page__clear"
            onClick={handleClear}
          >
            Clear chat
          </button>
        )}
      </div>
      <ChatWindow messages={messages} isLoading={isLoading} onQuickReply={handleSend} />
      {error && <p className="chat-page__error">Couldn't get a response: {error}</p>}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  )
}

export default ChatPage
