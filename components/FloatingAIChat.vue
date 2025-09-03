<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Button -->
    <button 
      v-if="!isChatOpen" 
      @click="openChat"
      class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center animate-float-in"
      :title="$t('aiAssistant') || 'AI Assistant'"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      </svg>
    </button>

    <!-- Chat Window -->
    <div 
      v-if="isChatOpen"
      class="w-80 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-up"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
            🤖
          </div>
          <div>
            <div class="font-medium text-gray-900 dark:text-white text-sm">{{ $t('aiAssistant') || 'AI Assistant' }}</div>
          </div>
        </div>
        <div class="flex gap-1">
          <button 
            @click="clearChat"
            class="w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400"
            :title="$t('clearChat') || 'Clear Chat'"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
          <button 
            @click="closeChat"
            class="w-6 h-6 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400"
            :title="$t('close') || 'Close'"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div 
        ref="chatContainer"
        class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900/30 p-3"
      >
        <!-- Messages -->
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="flex gap-2 mb-3 items-end"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Avatar (for assistant messages) -->
          <div 
            v-if="message.role === 'assistant'"
            class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs flex-shrink-0"
          >
            🤖
          </div>

          <!-- Message bubble -->
          <div 
            class="max-w-[75%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words"
            :class="message.role === 'user' ? 
              'bg-blue-600 text-white rounded-br-md' : 
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-md'"
          >
            {{ message.content }}
          </div>

          <!-- Avatar (for user messages) -->
          <div 
            v-if="message.role === 'user'"
            class="w-6 h-6 rounded-full bg-gray-600 dark:bg-gray-400 flex items-center justify-center text-white font-medium text-xs flex-shrink-0"
          >
            {{ userInitials }}
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex gap-2 mb-3 items-end justify-start">
          <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs">
            🤖
          </div>
          <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl rounded-bl-md px-3 py-2">
            <span class="flex gap-1 items-center">
              <i class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></i>
              <i class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.15s"></i>
              <i class="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.3s"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="flex gap-2 items-center p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex-1 flex items-center bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 focus-within:border-gray-400 dark:focus-within:border-gray-500 transition-colors">
          <input
            ref="messageInput"
            v-model="currentMessage"
            type="text"
            :placeholder="$t('typeMessage') || 'Type a message...'"
            class="flex-1 border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
            @keydown="handleKeyDown"
          />
        </div>
        <button 
          @click="sendMessage"
          :disabled="!currentMessage.trim() || isSending"
          class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :title="$t('send') || 'Send'"
        >
          <span v-if="isSending" class="text-xs">⏳</span>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $t } = useNuxtApp()

// Get user data
const user = useSupabaseUser()

// Component state
const isChatOpen = ref(false)
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const isSending = ref(false)
const chatContainer = ref(null)
const messageInput = ref(null)

// Storage key for floating chat
const LS_KEY = 'vindio.floating.chat.history.v1'

// User initials (same logic as layout)
const userInitials = computed(() => {
  if (!user.value?.email) return 'U'
  const email = user.value.email
  const parts = email.split('@')[0].split('.')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email[0].toUpperCase()
})

// Chat functions
const openChat = () => {
  isChatOpen.value = true
  loadMessages()
  
  // Add welcome message if no history
  if (messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content: $t('aiWelcomeMessage') || 'Hello! How can I help you today?',
      timestamp: new Date().toISOString()
    })
  }
  
  nextTick(() => {
    messageInput.value?.focus()
    scrollToBottom()
  })
}

const closeChat = () => {
  isChatOpen.value = false
}

const clearChat = () => {
  messages.value = []
  localStorage.removeItem(LS_KEY)
  
  // Add welcome message
  messages.value.push({
    role: 'assistant',
    content: $t('aiWelcomeMessage') || 'Hello! How can I help you today?',
    timestamp: new Date().toISOString()
  })
  
  nextTick(() => {
    scrollToBottom()
  })
}

const loadMessages = () => {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        messages.value = parsed.filter(msg => 
          msg && (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string'
        )
      }
    }
  } catch (error) {
    console.warn('Failed to load floating chat history:', error)
    messages.value = []
  }
}

const saveMessages = () => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(messages.value))
  } catch (error) {
    console.warn('Failed to save floating chat history:', error)
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  const text = currentMessage.value.trim()
  if (!text || isSending.value) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: new Date().toISOString()
  })

  currentMessage.value = ''
  saveMessages()
  
  // Show typing indicator
  isSending.value = true
  isTyping.value = true
  
  nextTick(() => {
    scrollToBottom()
  })

  try {
    const response = await $fetch('/api/chat/ask', {
      method: 'POST',
      body: { query: text }
    })
    
    isTyping.value = false
    
    messages.value.push({
      role: 'assistant',
      content: response.answer || 'Sorry, I didn\'t get a response. Please try again.',
      timestamp: new Date().toISOString()
    })
    
    saveMessages()
    
    nextTick(() => {
      scrollToBottom()
    })
    
  } catch (error) {
    isTyping.value = false
    console.error('Floating chat error:', error)
    
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, something went wrong. Please try again.',
      timestamp: new Date().toISOString()
    })
    
    saveMessages()
    
    nextTick(() => {
      scrollToBottom()
    })
  } finally {
    isSending.value = false
    nextTick(() => {
      messageInput.value?.focus()
    })
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>

<style scoped>
/* Floating Button Animation */
@keyframes float-in {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) rotate(-90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}

.animate-float-in {
  animation: float-in 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.5s both;
}

.animate-slide-up {
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-bounce {
  animation: bounce 1.2s infinite ease-in-out;
}

/* Floating button pulse effect on hover */
.animate-float-in:hover {
  animation-play-state: paused;
}
</style>
