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
        <!-- Chat interface -->
    <div v-else-if="isAuthenticated" class="h-full flex flex-col">
      <section class="h-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors flex flex-col opacity-0 animate-scale-in">
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
              id="new"
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
          id="chatpane"
          class="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900/50 transition-colors px-4 sm:px-8 md:px-16 lg:px-24 py-6"
          role="log" 
          aria-live="polite" 
          :aria-label="$t('chatTranscript')"
        >
          <!-- Messages will be dynamically added here by vanilla JS -->
        </div>

        <!-- Composer -->
        <div class="flex gap-4 items-end border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors flex-shrink-0">
          <div class="px-4 sm:px-8 md:px-16 lg:px-24 py-6 flex gap-4 items-end w-full animate-fade-in-prompt">
            <div class="flex-1 flex gap-3 items-center bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-3xl px-5 py-4 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors shadow-sm">
            <textarea
              id="q"
              rows="1"
              :placeholder="$t('aiChatPlaceholder')"
              class="flex-1 border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none min-h-6 max-h-32"
            />
          </div>
          <button 
            id="send"
            class="w-14 h-14 rounded-full border-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-xl flex items-center justify-center cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            :title="$t('send')"
          >
            <span id="spin" style="display: none;">⏳</span>
            <span id="sendLabel">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </span>
          </button>
          </div>
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
// Import Python AI server configuration
import { PYTHON_AI_CONFIG } from '~/utils/python-ai-config.js'

// Get the translate function
const { $t } = useNuxtApp()

// Authentication check
const user = useSupabaseUser()
const isLoading = ref(true)
const isAuthenticated = ref(false)

// Chat functionality using vanilla JS approach
onMounted(async () => {
  console.log('AI Chat mounted, checking auth...')
  
  // Wait for one tick to let reactive refs stabilize
  await nextTick()
  
  // Simple timeout-based check
  setTimeout(() => {
    if (user.value) {
      console.log('User authenticated:', user.value.email)
      isAuthenticated.value = true
      
      // Initialize vanilla JS chat functionality
      initVanillaChat()
      
    } else {
      console.log('No user found, redirecting to login')
      navigateTo('/login')
    }
    isLoading.value = false
  }, 200)
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser && !isLoading.value) {
    console.log('User state changed, authenticated:', newUser.email)
    isAuthenticated.value = true
    initVanillaChat()
  } else if (!newUser && !isLoading.value) {
    console.log('User logged out, redirecting')
    navigateTo('/login')
  }
}, { immediate: false })

// Vanilla JS chat implementation
function initVanillaChat() {
  nextTick(() => {
    const $ = (sel) => document.querySelector(sel);
    const chatEl = $('#chatpane');
    const q = $('#q');
    const sendBtn = $('#send');
    const spin = $('#spin');
    const sendLabel = $('#sendLabel');
    const newBtn = $('#new');

    if (!chatEl || !q || !sendBtn || !newBtn) {
      console.error('Chat elements not found, retrying...');
      setTimeout(initVanillaChat, 100);
      return;
    }

    // Disable send until there's text, and toggle on input
    sendBtn.disabled = true;
    q.addEventListener('input', () => { 
      sendBtn.disabled = !q.value.trim(); 
    });

    const LS_KEY = 'vindio.chat.history.v3';
    const MAX_TURNS = 20;
    let convo = [];

    function isMsg(m) {
      return m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string';
    }

    function saveHistory() {
      try { 
        localStorage.setItem(LS_KEY, JSON.stringify(convo)); 
      } catch(_) {}
    }

    function loadHistory() {
      try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        convo = Array.isArray(raw) ? raw.filter(isMsg) : [];
      } catch(_) { 
        convo = []; 
      }
    }

    function addMessage(role, text, ctxItems = null) {
      const isUser = role === 'user';
      const row = document.createElement('div');
      row.className = `flex gap-4 mb-6 items-end animate-fade-in-message ${isUser ? 'justify-end' : 'justify-start'}`;
      
      const avatar = document.createElement('div');
      avatar.className = `w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 shadow-sm ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm' 
          : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700'
      }`;
      avatar.textContent = isUser ? getUserInitials() : '🤖';
      
      const bubble = document.createElement('div');
      bubble.className = `max-w-[75%] px-5 py-4 rounded-3xl whitespace-pre-wrap break-words shadow-sm ${
        isUser 
          ? 'bg-blue-600 dark:bg-blue-600 text-white rounded-br-lg' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-lg'
      }`;
      bubble.textContent = text || '';
      
      if (isUser) {
        row.appendChild(bubble);
        row.appendChild(avatar);
      } else {
        row.appendChild(avatar);
        row.appendChild(bubble);
      }
      
      chatEl.appendChild(row);
      
      if (!isUser && Array.isArray(ctxItems) && ctxItems.length) {
        const details = document.createElement('details');
        details.className = 'mt-2 ml-14 text-sm text-gray-600 dark:text-gray-400';
        const summary = document.createElement('summary');
        summary.textContent = `Sources (${ctxItems.length})`;
        summary.className = 'cursor-pointer hover:text-gray-800 dark:hover:text-gray-200';
        details.appendChild(summary);
        
        ctxItems.forEach((line, i) => {
          const d = document.createElement('div');
          d.textContent = `[${i + 1}] ${line}`;
          d.className = 'mt-1 pl-4 text-xs';
          details.appendChild(d);
        });
        
        chatEl.appendChild(details);
      }
      
      chatEl.scrollTop = chatEl.scrollHeight;
    }

    function getUserInitials() {
      if (!user.value?.email) return 'U';
      const email = user.value.email;
      const parts = email.split('@')[0].split('.');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return email[0].toUpperCase();
    }

    function renderFromHistory() {
      chatEl.innerHTML = '';
      if (convo.length === 0) {
        addMessage('assistant', $t('aiWelcomeMessage') || "Hello, I'm Vindio AI Software's AI assistant. How can I help you today?");
        return;
      }
      for (const m of convo) { 
        addMessage(m.role, m.content); 
      }
    }

    function setSending(sending) {
      sendBtn.disabled = sending;
      if (spin) spin.style.display = sending ? 'inline' : 'none';
      if (sendLabel) sendLabel.style.display = sending ? 'none' : 'inline';
    }

    function showTyping() {
      const row = document.createElement('div');
      row.className = 'flex gap-4 mb-6 items-end justify-start animate-fade-in-message';
      row.dataset.typing = '1';
      
      const avatar = document.createElement('div');
      avatar.className = 'w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-lg shadow-sm';
      avatar.textContent = '🤖';
      
      const bubble = document.createElement('div');
      bubble.className = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-3xl rounded-bl-lg px-5 py-4 shadow-sm';
      
      const dots = document.createElement('span');
      dots.className = 'flex gap-1.5 items-center';
      dots.innerHTML = `
        <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></i>
        <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.15s"></i>
        <i class="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style="animation-delay: 0.3s"></i>
      `;
      
      bubble.appendChild(dots);
      row.appendChild(avatar);
      row.appendChild(bubble);
      chatEl.appendChild(row);
      chatEl.scrollTop = chatEl.scrollHeight;
      return row;
    }

    function hideTyping(row) {
      if (row && row.parentNode) row.parentNode.removeChild(row);
    }

    async function send() {
      const text = q.value.trim();
      if (!text) { 
        q.focus(); 
        return; 
      }

      // Show user's turn and append to in-memory transcript
      addMessage('user', text);
      convo.push({ role: 'user', content: text });
      saveHistory();

      q.value = '';
      setSending(true);
      const typingRow = showTyping();

      try {
        // Use Python AI server configuration
        const body = { query: text };
        const resp = await fetch(PYTHON_AI_CONFIG.getUrl('chat'), {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(PYTHON_AI_CONFIG.timeout)
        });

        const raw = await (resp.headers.get('content-type')?.includes('json') ? resp.json() : resp.text());
        if (!resp.ok) {
          console.error('POST /ask failed:', raw);
          const msg = typeof raw === 'string' ? raw : (raw.detail || JSON.stringify(raw));
          throw new Error(msg.slice(0, 300));
        }

        const answer = raw.answer || raw.response || '(no answer)';
        hideTyping(typingRow);
        addMessage('assistant', answer, Array.isArray(raw.context) ? raw.context : []);
        convo.push({ role: 'assistant', content: answer });
        saveHistory();
      } catch (err) {
        hideTyping(typingRow);
        console.error(err);
        const msg = (err && err.message) ? err.message : String(err);
        addMessage('assistant', `⚠️ Error: ${msg}`);
        convo.push({ role: 'assistant', content: `⚠️ Error: ${msg}` });
        saveHistory();
      } finally {
        setSending(false);
        q.dispatchEvent(new Event('input'));
        q.focus();
      }
    }

    async function resetChat() {
      convo = [];
      try { 
        localStorage.removeItem(LS_KEY); 
      } catch(_) {}
      
      // Tell the Python server to clear chat history
      try { 
        await fetch(PYTHON_AI_CONFIG.getUrl('reset'), { 
          method: 'POST', 
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.value?.id || 'anonymous',
            session_id: user.value?.email || 'session_' + Date.now()
          })
        }); 
      } catch(_) {}
      
      renderFromHistory();
      q.value = '';
      q.dispatchEvent(new Event('input'));
      q.focus();
    }

    // Event listeners
    sendBtn.addEventListener('click', send);
    newBtn.addEventListener('click', resetChat);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    // Initialize
    loadHistory();
    renderFromHistory();
    q.focus();
  });
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

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.2s infinite ease-in-out;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}

@keyframes fade-in-message {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-prompt {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-message {
  animation: fade-in-message 0.4s ease-out forwards;
}

.animate-fade-in-prompt {
  animation: fade-in-prompt 0.6s ease-out forwards;
}
</style>
