import { postJson, deleteResource } from './client.js'

// conversationId is optional: omit it to start a new conversation, pass the
// one the backend returned to continue it (see ../../README.md's "/chat").
export function sendChatMessage(message, conversationId) {
  return postJson('/chat', conversationId ? { message, conversationId } : { message })
}

export function forgetConversation(conversationId) {
  return deleteResource(`/chat/${conversationId}`)
}
