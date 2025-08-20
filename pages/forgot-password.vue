<template>
  <div class="min-h-screen gradient-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <form class="glass rounded-2xl p-8 space-y-6 fade-in scale-hover" @submit.prevent="submit">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-primary mb-2">Forgot Password</h2>
          <p class="text-secondary">Enter your email to reset your password</p>
        </div>

        <!-- Email Input -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-primary">{{$t('email')}}</label>
          <input 
            v-model="email" 
            type="email" 
            :placeholder="$t('email')" 
            class="w-full px-4 py-3 rounded-xl border border-custom bg-primary/50 text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-accent-green/10 border border-accent-green/20 text-accent-green px-4 py-3 rounded-xl text-sm">
          Password reset email sent! Check your inbox.
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-accent-red/10 border border-accent-red/20 text-accent-red px-4 py-3 rounded-xl text-sm">
          {{error}}
        </div>

        <!-- Reset Button -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-accent-blue hover-accent-blue text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Send Reset Email</span>
          <span v-else>Sending...</span>
        </button>

        <!-- Back to Login -->
        <div class="text-center pt-4 border-t border-custom">
          <p class="text-secondary">
            Remember your password? 
            <NuxtLink to="/login" class="text-accent-blue hover:text-accent-blue-hover font-semibold transition-colors ml-1">
              {{$t('login')}}
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { $t } = useNuxtApp()
const email = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

const submit = async () => {
  error.value = ''
  success.value = false
  loading.value = true
  
  try {
    // TODO: Implement password reset API
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    success.value = true
  } catch (err) {
    error.value = 'Failed to send reset email. Please try again.'
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: false })
</script>
