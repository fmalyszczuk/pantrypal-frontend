import './ChatMessage.css'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <li className={`chat-message chat-message--${isUser ? 'user' : 'assistant'}`}>
      <span className="chat-message__bubble">{message.text}</span>
    </li>
  )
}

export default ChatMessage
