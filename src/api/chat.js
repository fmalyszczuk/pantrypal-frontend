import { postJson } from './client.js'

// NOTE: no chat endpoint is documented in CLAUDE.md's backend contract yet.
// This assumes POST /chat { message } -> { reply }. Confirm the real
// path and response shape with the backend before shipping this.
export function sendChatMessage(message) {
  return postJson('/chat', { message })
}
