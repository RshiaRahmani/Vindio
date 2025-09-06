<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
    <!-- Desktop Header -->
    <header class="hidden md:flex flex-wrap justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 px-24 bg-white dark:bg-gray-800 animate-slide-down relative z-50">
      <div class="flex items-center gap-4">
         <NuxtLink to="/" class="font-semibold font-2xl">Vindio</NuxtLink>
         <template v-if="authed">
           <NuxtLink to="/dashboard">{{$t('dashboard')}}</NuxtLink>
           <NuxtLink to="/datasets">{{$t('datasets.title')}}</NuxtLink>
        <NuxtLink to="/ai-chat">{{$t('aiChat')}}</NuxtLink>
      </template>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <select
            v-model="selectedLocale"
            @change="changeLocale"
            class="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white text-sm rounded-full px-3 py-2 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option
              value="en"
              class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              EN
            </option>
            <option
              value="tr"
              class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              TR
            </option>
            <option
              value="ru"
              class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
            >
              RU
            </option>
          </select>
          </div>
      
      <template v-if="authed">
        <!-- User Profile Dropdown -->
        <div class="relative" ref="profileDropdown">
          <button 
            @click="toggleProfileDropdown" 
            class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :aria-expanded="isProfileDropdownOpen"
            aria-label="User menu"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ userInitials }}
            </div>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-[9999]"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {{ userInitials }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-gray-900 dark:text-white truncate">{{ userDisplayName }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>
            
            <!-- Menu Items -->
            <div class="py-1">
              <NuxtLink 
                to="/profile" 
                @click="closeProfileDropdown"
                class="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                {{ $t('profile') }}
              </NuxtLink>
              
              <button 
                @click="toggleColorMode" 
                class="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
              >
                <svg v-if="$colorMode.value === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                {{ $colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}
              </button>
              
              <hr class="my-1 border-gray-200 dark:border-gray-700">
              
              <button 
                @click="logout" 
                class="flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                {{ $t('logout') }}
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <button @click="toggleColorMode" class="border px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          {{ $colorMode.value === 'dark' ? ' Light' : ' Dark' }}
        </button>
        <NuxtLink to="/login" class="border px-2 py-1 bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">{{$t('login')}}</NuxtLink>
        <NuxtLink to="/signup" class="border px-2 py-1 bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-800 transition-colors">{{$t('signup')}}</NuxtLink>
      </template>
      </div>
    </header>

    <!-- Mobile Header -->
    <header class="md:hidden flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-slide-down relative z-50">
      <NuxtLink to="/" class="font-semibold text-xl">Vindio</NuxtLink>
      <button 
        @click="toggleMobileSidebar" 
        class="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        :aria-expanded="isMobileSidebarOpen"
        aria-label="Toggle navigation menu"
      >
        <svg 
          v-if="!isMobileSidebarOpen"
          class="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg 
          v-else
          class="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Mobile Sidebar -->
    <MobileSidebar 
      :isOpen="isMobileSidebarOpen" 
      @close="closeMobileSidebar"
    />

    <main class="animate-fade-in">
      <slot />
    </main>

    <!-- Floating AI Chat (show on all pages except AI chat page) -->
    <FloatingAIChat v-if="authed && !isAIChatPage" />
    <!-- ⬇️ Global Footer -->
<Footer />
  </div>
</template>

<style>
/* Page Load Animations */
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-slide-down {
  animation: slide-down 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}
</style>

<script setup>
const { $t } = useNuxtApp()
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const localeCookie = useCookie('locale')
const locale = computed({ get:()=> localeCookie.value || 'en', set:v=> (localeCookie.value=v) })

// Language selector functionality
const selectedLocale = ref(localeCookie.value || 'en')

const changeLocale = () => {
  localeCookie.value = selectedLocale.value
  // The translations will update automatically since $t is reactive to the locale cookie
}

// Watch for locale changes and sync selectedLocale
watch(localeCookie, (newValue) => {
  selectedLocale.value = newValue || 'en'
}, { immediate: true })

// Use Supabase authentication instead of custom token
const user = useSupabaseUser()

// Improved auth state management
const authInitialized = ref(false)
const authed = computed(() => {
  const isAuthenticated = !!user.value && authInitialized.value
  return isAuthenticated
})

// Initialize auth state properly
onMounted(async () => {
  // Wait for Supabase to initialize
  await nextTick()
  
  // Give a short time for auth to stabilize
  setTimeout(() => {
    authInitialized.value = true
  }, 100)
})

// Check if we're on the AI chat page
const route = useRoute()
const isAIChatPage = computed(() => route.path === '/ai-chat')

// Use Supabase logout
const { signOut } = useAuth()
const logout = async () => {
  try {
    closeProfileDropdown()
    // Call signOut and handle the result
    const result = await signOut()
    
    if (result.error) {
      console.error('Logout error:', result.error)
      return
    }
    
    // Navigate to main page after successful logout
    await navigateTo('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Mobile sidebar state
const isMobileSidebarOpen = ref(false)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// Profile dropdown state
const isProfileDropdownOpen = ref(false)
const profileDropdown = ref(null)

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false
}

// User display data
const userInitials = computed(() => {
  if (!user.value?.email) return 'U'
  const email = user.value.email
  const parts = email.split('@')[0].split('.')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email[0].toUpperCase()
})

const userDisplayName = computed(() => {
  if (!user.value?.email) return 'User'
  const emailPart = user.value.email.split('@')[0]
  return emailPart.split('.').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' ')
})

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event) => {
    if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
      closeProfileDropdown()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

// Close sidebar when route changes
watch(() => useRoute().path, () => {
  isMobileSidebarOpen.value = false
  closeProfileDropdown()
})

// Close sidebar when clicking outside (handled by the MobileSidebar component)
</script>


