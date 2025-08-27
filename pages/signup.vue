<template>
  <div class="min-h-screen relative flex items-center justify-center p-4 overflow-hidden  bg-white dark:bg-gray-900">
    <!-- Threads WebGL Background -->
    <ThreadsBackground 
      :color="[0.3, 0.5, 1.0]" 
      :amplitude="1.2" 
      :distance="0.3" 
      :enableMouseInteraction="true" 
    />
    
    <!-- Background overlay for better effect -->
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
          class="bg-white/20 backdrop-blur-sm dark:text-white text-[--text-secondary] text-sm rounded-full px-3 py-2 border border-white/20 focus:outline-none  focus:border-white/40 transition-all duration-200 appearance-none cursor-pointer"
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
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </div>
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-1">{{$t('signup')}}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Create your account</p>
            </div>

          <!-- Compact Input Fields -->
          <div class="space-y-3">
            <input 
              v-model="name" 
              type="text" 
              placeholder="Full Name" 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
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
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start space-x-2">
            <input 
              v-model="acceptTerms" 
              type="checkbox" 
              id="terms" 
              class="mt-1 w-4 h-4 text-green-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 focus:ring-2"
              required
            />
            <label for="terms" class="text-xs text-gray-600 dark:text-gray-400 mt-1">
              I agree to the 
              <NuxtLink to="/terms" class="text-blue-500 hover:text-blue-600 underline">Terms</NuxtLink> 
              and 
              <NuxtLink to="/privacy" class="text-blue-500 hover:text-blue-600 underline">Privacy Policy</NuxtLink>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-sm">
            <div v-if="error.includes('already exists')" class="flex flex-col space-y-2">
              <p>{{ error }}</p>
              <NuxtLink 
                to="/login" 
                class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline inline-flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                <span>Go to Login Page</span>
              </NuxtLink>
            </div>
            <p v-else>{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-3 py-2 rounded-lg text-sm">
            {{success}}
          </div>

          <!-- Compact Signup Button -->
          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
            <span v-else>{{$t('signup')}}</span>
          </button>

          <!-- Minimal Divider -->
          <!-- <div class="relative my-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-white/70 dark:bg-gray-800 rounded-full  text-gray-500">or</span>
            </div>
          </div> -->

          <!-- Google Sign Up -->
          <button 
            type="button"
            @click="handleGoogleSignUp"
            :disabled="loading"
            class="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-medium border border-gray-200 dark:border-gray-600 transition-all duration-200 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <!-- Login Link -->
          <div class="text-center pt-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Already have an account? 
              <NuxtLink to="/login" class="text-blue-500 hover:text-blue-600 font-medium transition-colors ml-1">
                {{$t('login')}}
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
const { signUp, signInWithGoogle } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const error = ref('')
const success = ref('')
const loading = ref(false)

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
  if (loading.value) return
  
  error.value = ''
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  
  // Password validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  if (!acceptTerms.value) {
    error.value = 'Please accept the terms and conditions'
    return
  }
  
  loading.value = true
  
  try {
    const { data, error: authError } = await signUp(
      email.value, 
      password.value,
      {
        full_name: name.value,
        name: name.value
      }
    )
    
    if (authError) {
      // Handle specific error cases
      if (authError.includes('User already registered') || authError.includes('already registered') || authError.includes('email already exists')) {
        error.value = `An account with ${email.value} already exists. Please try logging in instead or use a different email address.`
      } else if (authError.includes('Invalid email')) {
        error.value = 'Please enter a valid email address.'
      } else if (authError.includes('Password should be at least')) {
        error.value = 'Password must be at least 6 characters long.'
      } else {
        error.value = authError
      }
    } else {
      // Show success message
      success.value = 'Registration successful! Please check your email to verify your account.'
    }
  } catch (err) {
    error.value = 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleGoogleSignUp = async () => {
  if (loading.value) return
  
  error.value = ''
  loading.value = true
  
  try {
    const { error: authError } = await signInWithGoogle()
    
    if (authError) {
      error.value = authError
    }
    // Note: Google OAuth will redirect automatically
  } catch (err) {
    error.value = 'Google sign up failed. Please try again.'
  } finally {
    loading.value = false
  }
}

// Check if user is already logged in
const user = useSupabaseUser()
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
})

definePageMeta({ layout: false }) // Use no layout for full-screen design
</script>
