import ChatMessage from './ChatMessage.jsx'
import './ChatWindow.css'

function ChatWindow({ messages, isLoading }) {
  if (messages.length === 0 && !isLoading) {
    return <p className="chat-window__empty">Ask a question to get started.</p>
  }

  return (
    <ul className="chat-window">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <li className="chat-message chat-message--assistant chat-message--pending">
          <span className="chat-message__bubble">Thinking…</span>
        </li>
      )}
    </ul>
  )
}

export default ChatWindow
