import ChatMessage from './ChatMessage.jsx'
import './ChatWindow.css'

function ChatWindow({ messages, isLoading, onQuickReply }) {
  if (messages.length === 0 && !isLoading) {
    return <p className="chat-window__empty">Ask a question to get started.</p>
  }

  return (
    <ul className="chat-window">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          // Only the latest message's confirmation prompt is still actionable —
          // once the conversation has moved on, an older "needs confirmation"
          // action no longer reflects what a "yes" would actually confirm.
          onQuickReply={index === messages.length - 1 ? onQuickReply : undefined}
          disabled={isLoading}
        />
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
