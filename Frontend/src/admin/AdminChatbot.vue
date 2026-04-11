<template>
  <div class="chatbot-wrapper">
    <!-- Collapsed toggle button -->
    <button v-if="!open" class="chatbot-toggle" @click="toggleOpen" title="ASSISTANT">
      <span class="toggle-face">[^_^]</span>
      <span class="toggle-label">ASSISTANT</span>
    </button>

    <!-- Expanded terminal window -->
    <div v-else class="chatbot-window">
      <div class="chat-header">
        <span class="chat-title">╔══ VINAYBOT v1.0 ══╗</span>
        <button class="chat-close" @click="toggleOpen">✕</button>
      </div>

      <div class="chat-mascot">
        <pre class="ascii-mascot">  ┌──────────┐
  │  (^_^)   │
  │ &lt;HELPER&gt; │
  └──────────┘</pre>
      </div>

      <div ref="messageList" class="chat-messages">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="chat-bubble"
          :class="msg.from === 'user' ? 'bubble-user' : 'bubble-bot'"
        >
          <span class="bubble-prefix">{{ msg.from === 'user' ? '&gt;' : '$' }}</span>
          {{ msg.text }}
        </div>
        <div v-if="typing" class="chat-bubble bubble-bot">
          <span class="bubble-prefix">$</span>
          <span class="typing-dots">. . .</span>
        </div>
      </div>

      <div class="chat-input-row">
        <input
          v-model="inputText"
          class="chat-input"
          placeholder="TYPE YOUR QUERY..."
          @keydown.enter="sendMessage"
          :disabled="typing"
        />
        <button class="chat-send" @click="sendMessage" :disabled="typing">[SEND]</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { authFetch } from './useAdminAuth'

interface Message {
  from: 'user' | 'bot'
  text: string
}

interface StatsData {
  visitors?: { total: number; today: number }
  posts?: { total: number; published: number }
  users?: { total: number }
  guestbook?: { total: number }
  contacts?: { total: number }
}

const open = ref(false)
const inputText = ref('')
const typing = ref(false)
const messages = ref<Message[]>([])
const messageList = ref<HTMLElement | null>(null)
let cachedStats: StatsData | null = null

function toggleOpen() {
  open.value = !open.value
  if (open.value && messages.value.length === 0) {
    addBot('GREETINGS, ADMIN. I AM VINAYBOT. ASK ME ABOUT YOUR SITE STATS!')
  }
}

function addBot(text: string) {
  messages.value.push({ from: 'bot', text })
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

async function fetchStats(): Promise<StatsData> {
  if (cachedStats) return cachedStats
  try {
    const res = await authFetch('/admin/stats')
    const data = await res.json()
    if (data.success) {
      cachedStats = data
      return data
    }
  } catch { /* ignore */ }
  return {}
}

async function getBotResponse(input: string): Promise<string> {
  const lower = input.toLowerCase()
  const stats = await fetchStats()

  if (/hello|hi|hey/.test(lower)) {
    return 'HEY DUDE! WELCOME TO CONTROL ROOM 1996. HOW CAN I HELP?'
  }
  if (/visitor|traffic|hits/.test(lower)) {
    const total = stats.visitors?.total ?? '?'
    const today = stats.visitors?.today ?? '?'
    return `YOUR SITE HAS ${total} TOTAL VISITORS! ${today} VISITED TODAY. RAD!`
  }
  if (/post|content|blog/.test(lower)) {
    const total = stats.posts?.total ?? '?'
    const published = stats.posts?.published ?? '?'
    return `YOU HAVE ${total} POSTS (${published} PUBLISHED). KEEP WRITING!`
  }
  if (/user|account/.test(lower)) {
    const total = stats.users?.total ?? '?'
    return `THERE ARE ${total} USERS IN THE SYSTEM.`
  }
  if (/guestbook|sign/.test(lower)) {
    const total = stats.guestbook?.total ?? '?'
    return `${total} PEOPLE HAVE SIGNED YOUR GUESTBOOK!`
  }
  if (/contact|message|email/.test(lower)) {
    const total = stats.contacts?.total ?? '?'
    return `YOU HAVE ${total} CONTACT MESSAGES.`
  }
  if (/help|\?|what/.test(lower)) {
    return 'I CAN TELL YOU ABOUT: VISITORS, POSTS, USERS, GUESTBOOK, CONTACTS. JUST ASK!'
  }
  if (/logout|exit|bye/.test(lower)) {
    return 'CATCH YOU ON THE FLIP SIDE! LOGGING OFF... [■■■░░░]'
  }
  return 'DOES NOT COMPUTE. TRY ASKING ABOUT: visitors, posts, users, guestbook, contacts'
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || typing.value) return

  messages.value.push({ from: 'user', text })
  inputText.value = ''
  scrollToBottom()

  typing.value = true
  await new Promise(r => setTimeout(r, 300))

  const response = await getBotResponse(text)
  typing.value = false
  addBot(response)
}

onMounted(async () => {
  // Pre-fetch stats silently
  await fetchStats()
})
</script>

<style scoped>
.chatbot-wrapper {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9000;
  font-family: 'Courier New', monospace;
}

.chatbot-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #0d0d0d;
  border: 1px solid #00ff41;
  color: #00ff41;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
  animation: pulse-glow 2s ease-in-out infinite;
}

.chatbot-toggle:hover {
  background: #0a1a0a;
  box-shadow: 0 0 18px rgba(0, 255, 65, 0.6);
}

.toggle-face {
  font-size: 1rem;
  letter-spacing: 2px;
}

.toggle-label {
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: #226622;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 65, 0.3); }
  50%       { box-shadow: 0 0 18px rgba(0, 255, 65, 0.7); }
}

.chatbot-window {
  width: 300px;
  height: 380px;
  background: #0a0a0a;
  border: 1px solid #00ff41;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.4);
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.6rem;
  border-bottom: 1px solid #1a1a1a;
  background: #0d0d0d;
}

.chat-title {
  color: #00ffff;
  font-size: 0.72rem;
  letter-spacing: 1px;
  text-shadow: 0 0 6px #00ffff;
}

.chat-close {
  background: transparent;
  border: none;
  color: #ff0040;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0 0.2rem;
}

.chat-close:hover { color: #ff4466; }

.chat-mascot {
  padding: 0.2rem 0.5rem 0;
  border-bottom: 1px solid #111;
}

.ascii-mascot {
  margin: 0;
  font-size: 0.6rem;
  color: #226622;
  line-height: 1.4;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-track { background: #111; }
.chat-messages::-webkit-scrollbar-thumb { background: #00ff41; }

.chat-bubble {
  font-size: 0.72rem;
  line-height: 1.4;
  padding: 0.3rem 0.5rem;
  border-left: 2px solid;
  word-break: break-word;
}

.bubble-user {
  color: #00ffff;
  border-color: #00ffff;
  background: #051515;
  align-self: flex-end;
  max-width: 85%;
}

.bubble-bot {
  color: #00ff41;
  border-color: #00ff41;
  background: #051005;
  align-self: flex-start;
  max-width: 90%;
}

.bubble-prefix {
  color: #226622;
  margin-right: 0.3rem;
}

.typing-dots {
  animation: blink 1s step-end infinite;
  letter-spacing: 3px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
}

.chat-input-row {
  display: flex;
  border-top: 1px solid #1a1a1a;
}

.chat-input {
  flex: 1;
  background: #0d0d0d;
  border: none;
  color: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  padding: 0.4rem 0.5rem;
  outline: none;
}

.chat-input::placeholder { color: #226622; }

.chat-send {
  background: transparent;
  border: none;
  border-left: 1px solid #1a1a1a;
  color: #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  white-space: nowrap;
}

.chat-send:hover:not(:disabled) {
  background: #0d1a0d;
  color: #00ffff;
}

.chat-send:disabled,
.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
