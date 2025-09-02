<template>
    <div class="h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
    <!-- Loading state -->
    <div v-if="isLoading" class="h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('loading') || 'Loading...' }}</p>
      </div>
    </div>
    
    <!-- Chat interface -->
    <div v-else-if="isAuthenticated" class="h-full flex flex-col">
      <section class="h-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors flex flex-col">
        <!-- Header -->
        <header class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors flex-shrink-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-xl shadow-sm">
              🤖
            </div>
            <div>
              <div class="font-semibold text-lg text-gray-900 dark:text-white">{{ $t('aiChatTitle') }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"></span>
                {{ $t('aiChatSubtitle') }}
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button 
              @click="resetChat" 
              class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center transition-all shadow-sm hover:shadow-md"
              :title="$t('newChat')"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>
        </header>

        <!-- Chat Area -->
        <div 
          ref="chatContainer"
          class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900/50 p-6 transition-colors"
          role="log" 
          aria-live="polite" 
          :aria-label="$t('chatTranscript')"
        >
          <!-- Day indicator (if needed) -->
          <div v-if="showDateSeparator" class="sticky top-2 z-10 text-center mb-6">
            <span class="inline-block px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 shadow-sm">
              {{ currentDate }}
            </span>
          </div>

          <!-- Messages -->
          <div 
            v-for="(message, index) in messages" 
            :key="index"
            class="flex gap-4 mb-6 items-end"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- Avatar (for assistant messages) -->
            <div 
              v-if="message.role === 'assistant'"
              class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
            >
              🤖
            </div>

            <!-- Message bubble -->
            <div 
              class="max-w-[75%] px-5 py-4 rounded-3xl whitespace-pre-wrap break-words shadow-sm"
              :class="message.role === 'user' ? 
                'bg-blue-600 dark:bg-blue-600 text-white rounded-br-lg' : 
                'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-lg'"
            >
              {{ message.content }}
            </div>

            <!-- Avatar (for user messages) -->
            <div 
              v-if="message.role === 'user'"
              class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
            >
              👤
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex gap-4 mb-6 items-end justify-start">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-lg shadow-sm">
              🤖
            </div>
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm">
              <span class="flex gap-1.5 items-center">
                <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></i>
                <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.15s"></i>
                <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.3s"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Composer -->
        <div class="flex gap-4 items-end p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors flex-shrink-0">
          <div class="flex-1 flex gap-3 items-center bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-3xl px-5 py-4 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors shadow-sm">
            <textarea
              ref="messageInput"
              v-model="currentMessage"
              rows="1"
              :placeholder="$t('aiChatPlaceholder')"
              class="flex-1 border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-6 max-h-32"
              @keydown="handleKeyDown"
              @input="adjustTextareaHeight"
            />
          </div>
          <button 
            @click="sendMessage"
            :disabled="!currentMessage.trim() || isSendingMessage"
            class="w-14 h-14 rounded-full border-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            :title="$t('send')"
          >
            <span v-if="isSendingMessage">⏳</span>
            <span v-else>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </span>
          </button>
        </div>

        <!-- Footer -->
        <footer class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900/30 transition-colors flex-shrink-0">
          {{ $t('aiChatFooter') }}
        </footer>
      </section>
    </div>
    
    <!-- Unauthorized state -->
    <div v-else class="h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('unauthorized') || 'Unauthorized' }}</h1>
        <p class="text-gray-600 dark:text-gray-400">{{ $t('pleaseLogin') || 'Please log in to access the AI chat.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get the translate function
const { $t } = useNuxtApp()

// Make sure $t is available in template
const t = $t

// Authentication check (simplified approach)
const user = useSupabaseUser()

// Handle authentication state
const isLoading = ref(true)
const isAuthenticated = ref(false)
const isSendingMessage = ref(false)

// Reactive data - must be declared before the watcher
const messages = ref([])
const currentMessage = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)
const messageInput = ref(null)

// Constants
const MAX_TURNS = 20
const LS_KEY = 'vindio.chat.history.v3'

// Simple auth initialization
onMounted(async () => {
  console.log('AI Chat mounted, checking auth...')
  
  // Wait for one tick to let reactive refs stabilize
  await nextTick()
  
  // Simple timeout-based check
  setTimeout(() => {
    if (user.value) {
      console.log('User authenticated:', user.value.email)
      isAuthenticated.value = true
      
      // Initialize chat after auth
      loadHistory()
      
      // Add welcome message if no history
      if (messages.value.length === 0) {
        addMessage('assistant', $t('aiWelcomeMessage'))
      }
      
      nextTick(() => {
        messageInput.value?.focus()
        scrollToBottom()
      })
    } else {
      console.log('No user found, redirecting to login')
      navigateTo('/login')
    }
    isLoading.value = false
  }, 200)
})

// Watch for user changes to handle navigation back/forth
watch(user, (newUser) => {
  if (newUser && !isLoading.value) {
    console.log('User state changed, authenticated:', newUser.email)
    isAuthenticated.value = true
    
    // Initialize chat
    loadHistory()
    if (messages.value.length === 0) {
      addMessage('assistant', $t('aiWelcomeMessage'))
    }
    
    nextTick(() => {
      messageInput.value?.focus()
      scrollToBottom()
    })
  } else if (!newUser && !isLoading.value) {
    console.log('User logged out, redirecting')
    navigateTo('/login')
  }
}, { immediate: false })

// Computed
const showDateSeparator = computed(() => messages.value.length > 0)
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
})

// Message management
function isValidMessage(msg) {
  return msg && (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string'
}

function saveHistory() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(messages.value))
  } catch (error) {
    console.warn('Failed to save chat history:', error)
  }
}

function loadHistory() {
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        messages.value = parsed.filter(isValidMessage)
      }
    }
  } catch (error) {
    console.warn('Failed to load chat history:', error)
    messages.value = []
  }
}

function addMessage(role, content) {
  messages.value.push({ role, content })
  saveHistory()
  nextTick(() => {
    scrollToBottom()
  })
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

function adjustTextareaHeight() {
  const textarea = messageInput.value
  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }
}

// Chat functionality
async function sendMessage() {
  const text = currentMessage.value.trim()
  if (!text || isSendingMessage.value) return

  // Add user message
  addMessage('user', text)
  currentMessage.value = ''
  adjustTextareaHeight()
  
  // Only show typing indicator, not page loading
  isSendingMessage.value = true
  isTyping.value = true

  try {
    const response = await $fetch('/api/chat/ask', {
      method: 'POST',
      body: { query: text }
    })
    
    isTyping.value = false
    addMessage('assistant', response.answer || 'Sorry, I didn\'t get a response. Please try again.')
    
  } catch (error) {
    isTyping.value = false
    console.error('Chat error:', error)
    const errorMessage = error.data?.message || error.message || 'Something went wrong. Please try again.'
    addMessage('assistant', `⚠️ Error: ${errorMessage}`)
  } finally {
    isSendingMessage.value = false
    nextTick(() => {
      messageInput.value?.focus()
    })
  }
}

async function resetChat() {
  messages.value = []
  try {
    localStorage.removeItem(LS_KEY)
    // Call the reset API
    await $fetch('/api/chat/reset', { method: 'POST' })
  } catch (error) {
    console.warn('Failed to clear chat history:', error)
  }
  
  // Add welcome message
  addMessage('assistant', $t('aiWelcomeMessage'))
  
  currentMessage.value = ''
  nextTick(() => {
    messageInput.value?.focus()
  })
}

function handleKeyDown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// SEO
useHead({
  title: 'AI Chat - Vindio',
  meta: [
    { name: 'description', content: 'Chat with Vindio AI assistant for help and support.' }
  ]
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.animate-bounce {
  animation: bounce 1.2s infinite ease-in-out;
}
</style>
