<template>
  <div class="min-h-screen flex items-center justify-center p-4 dark:bg-gray-800">
    <!-- Top Navigation -->
    <div
      class="absolute top-4 left-4 right-4 flex justify-between items-center z-20"
    >
      <!-- Logo/Brand -->
      <div class="flex items-center space-x-2">
        <div
          class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4h4v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z"
            />
          </svg>
        </div>
        <span class="text-lg font-semibold text-gray-800 dark:text-white">Vindio</span>
      </div>

      <!-- Right side controls -->
      <div class="flex items-center space-x-3">
        <!-- Language Selector -->
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
          <div
            class="absolute inset-y-0 right-2 flex items-center pointer-events-none"
          >
            <svg
              class="w-3 h-3 text-gray-600 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Dark/Light Mode Toggle -->
        <button
          @click="
            $colorMode.preference =
              $colorMode.value === 'dark' ? 'light' : 'dark'
          "
          class="w-10 h-10 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-600 hover:bg-white/20 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          <!-- Sun icon for light mode -->
          <svg
            v-if="$colorMode.value === 'dark'"
            class="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
          <!-- Moon icon for dark mode -->
          <svg
            v-else
            class="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-lg relative z-10">
      <!-- Main Container -->
      <div class=" rounded-3xl p-8 text-center">
        <!-- Hero Section -->
        <div class="mb-8">
          <!-- Redirect Message for unauthenticated users -->
          <div 
            v-if="showRedirectMessage" 
            class="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm"
          >
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <span>Please login or sign up to access that page.</span>
            </div>
          </div>
          
          <h1 class="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {{ $t("welcome") }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Welcome to Vindio
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Your modern platform for digital solutions
          </p>
        </div>

        <NuxtLink
          to="/login"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 block text-center"
        >
          {{ $t("login") }}
        </NuxtLink>

        <NuxtLink
          to="/signup"
          class="w-full bg-white mt-5 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-xl font-medium border border-gray-200 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 block text-center"
        >
          {{ $t("signup") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $t } = useNuxtApp()
const route = useRoute()

// Check if user was redirected from a protected page
const showRedirectMessage = ref(false)

// Language selector
const selectedLocale = useCookie("locale", { default: () => "en" })

const changeLocale = () => {
  // Save current color mode preference before reload
  const currentColorMode = $colorMode.preference
  localStorage.setItem('nuxt-color-mode', currentColorMode)
  
  // Refresh page to apply new locale
  window.location.reload()
}

// Check if user is already authenticated and redirect to dashboard
const user = useSupabaseUser()
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

// Show redirect message if user came from a protected route
onMounted(() => {
  // Check if there's a redirect parameter or if user was redirected
  if (route.query.redirected === 'true' || document.referrer.includes('/dashboard') || document.referrer.includes('/profile')) {
    showRedirectMessage.value = true
    
    // Hide the message after 5 seconds
    setTimeout(() => {
      showRedirectMessage.value = false
    }, 5000)
  }
})

definePageMeta({ layout: false }) // Use no layout for full-screen design
</script>
