<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden  bg-white dark:bg-gray-900">
    <!-- Threads WebGL Background -->
    <ThreadsBackground 
      :color="[0.3, 0.5, 1.0]" 
      :amplitude="1.2" 
      :distance="0.3" 
      :enableMouseInteraction="true" 
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br "></div>
    
    <!-- Top Navigation -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
      <!-- Back Button -->
      <NuxtLink to="/" class="flex items-center space-x-2 dark:text-white text-[--text-secondary] hover:text-grey transition-colors group">
        <div class="w-8 h-8  rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/40 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </div>
          <span class="text-sm font-medium">Back</span>
      </NuxtLink>
      
      <!-- Language Selector -->
      <div class="relative">
        <select 
          v-model="selectedLocale" 
          @change="changeLocale"
          class="bg-white/30 backdrop-blur-sm dark:text-[--text-secondary] text-[--text-secondary] text-sm rounded-full px-3 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="en" class="bg-gray-800 text-white">EN</option>
          <option value="tr" class="bg-gray-800 text-white">TR</option>
          <option value="ru" class="bg-gray-800 text-white">RU</option>
        </select>
        <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <svg class="w-3 h-3 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="w-full max-w-md relative z-10 bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors rounded-3xl shadow-sm border border-[--shadow-color]/10 dark:border-transparent border-1 p-6">
      <!-- Glass Container with Hard Blur -->
      <div class="glass-container rounded-3xl p-1 fade-in">
        <!-- Solid Form Inside Glass Container -->
        <div class="form-container rounded-[22px] p-6">
          <form class="space-y-4" @submit.prevent="submit">
            <!-- Minimal Header -->
            <div class="text-center mb-6">
              <div class="w-12 h-12 mx-auto bg-blue-500 rounded-xl flex items-center justify-center mb-3">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-1">{{$t('login')}}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Welcome back</p>
            </div>

          <!-- Compact Input Fields -->
          <div class="space-y-3">
            <input 
              v-model="email" 
              type="email" 
              :placeholder="$t('email')" 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <input 
              v-model="password" 
              type="password" 
              :placeholder="$t('password')" 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <!-- Forgot Password -->
          <div class="text-right">
            <NuxtLink to="/forgot-password" class="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
              Forgot password?
            </NuxtLink>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
            {{error}}
          </div>

          <!-- Compact Login Button -->
          <button 
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{$t('login')}}
          </button>

          <!-- Minimal Divider -->
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">or</span>
            </div>
          </div>

          <!-- Google Sign In -->
          <button 
            type="button"
            @click="signInWithGoogle"
            class="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Sign Up Link -->
          <div class="text-center pt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account? 
              <NuxtLink to="/signup" class="text-blue-500 hover:text-blue-600 font-medium transition-colors ml-1">
                {{$t('signup')}}
              </NuxtLink>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $t } = useNuxtApp()
const email = ref('')
const password = ref('')
const error = ref('')

// Language selector
const selectedLocale = useCookie('locale', { default: () => 'en' })

const changeLocale = () => {
  // Save current color mode preference before reload
  const currentColorMode = $colorMode.preference
  localStorage.setItem('nuxt-color-mode', currentColorMode)
  
  // Refresh page to apply new locale
  window.location.reload()
}

const submit = async () => {
  error.value = ''
  try {
    const { token } = await $fetch('/api/auth/login', { 
      method: 'POST', 
      body: { email: email.value, password: password.value }
    })
    useCookie('auth_token', { maxAge: 60*60*24*7 }).value = token
    navigateTo('/dashboard')
  } catch (err) { 
    error.value = 'Invalid credentials. Please try again.' 
  }
}

const signInWithGoogle = () => {
  // TODO: Implement Google OAuth
  console.log('Google sign in clicked')
  // For now, just show an alert
  alert('Google Sign In - To be implemented')
}

onMounted(() => { 
  if (useCookie('auth_token').value) navigateTo('/dashboard') 
})

definePageMeta({ layout: false }) // Use no layout for full-screen design
</script>
