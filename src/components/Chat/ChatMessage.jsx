import './ChatMessage.css'

const STATUS_LABELS = {
  ok: 'done',
  error: 'failed',
  confirmation_required: 'needs confirmation',
  not_confirmed: 'cancelled',
}

function formatTool(tool) {
  return tool.replace(/_/g, ' ')
}

function ChatMessage({ message, onQuickReply, disabled }) {
  const isUser = message.role === 'user'
  const actions = message.actions ?? []
  const needsConfirmation = actions.some((action) => action.status === 'confirmation_required')

  return (
    <li className={`chat-message chat-message--${isUser ? 'user' : 'assistant'}`}>
      <div className="chat-message__content">
        <span
          className={`chat-message__bubble${message.incomplete ? ' chat-message__bubble--incomplete' : ''}`}
        >
          {message.text}
        </span>

        {actions.length > 0 && (
          <ul className="chat-message__actions">
            {actions.map((action, index) => (
              <li
                key={`${action.tool}-${index}`}
                className={`chat-message__action chat-message__action--${action.status}`}
              >
                {formatTool(action.tool)} — {STATUS_LABELS[action.status] ?? action.status}
              </li>
            ))}
          </ul>
        )}

        {message.shoppingListChanged && (
          <span className="chat-message__note">✓ Shopping list updated</span>
        )}

        {needsConfirmation && onQuickReply && (
          <div className="chat-message__confirm">
            <button
              type="button"
              className="chat-message__confirm-button chat-message__confirm-button--yes"
              onClick={() => onQuickReply('yes')}
              disabled={disabled}
            >
              Yes
            </button>
            <button
              type="button"
              className="chat-message__confirm-button chat-message__confirm-button--no"
              onClick={() => onQuickReply('no')}
              disabled={disabled}
            >
              No
            </button>
          </div>
        )}
      </div>
    </li>
  )
}

export default ChatMessage
