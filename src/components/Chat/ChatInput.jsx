import { useState } from 'react'
import './ChatInput.css'

function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input__field"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about your recipes or shopping list…"
        disabled={disabled}
        aria-label="Chat message"
      />
      <button type="submit" className="chat-input__send" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  )
}

export default ChatInput
