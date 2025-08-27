<template>
  <div class="min-h-screen gradient-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <form class="glass rounded-2xl p-8 space-y-6 fade-in scale-hover" @submit.prevent="submit">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-primary mb-2">Reset Password</h2>
          <p class="text-secondary">Enter your new password</p>
        </div>

        <!-- Password Inputs -->
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-primary">New Password</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Enter new password" 
              class="w-full px-4 py-3 rounded-xl border border-custom bg-primary/50 text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              required
              minlength="8"
            />
          </div>
          
          <div>
            <label class="text-sm font-medium text-primary">Confirm Password</label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="Confirm new password" 
              class="w-full px-4 py-3 rounded-xl border border-custom bg-primary/50 text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              required
              minlength="8"
            />
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="bg-accent-green/10 border border-accent-green/20 text-accent-green px-4 py-3 rounded-xl text-sm">
          Password reset successful! You can now login with your new password.
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-accent-red/10 border border-accent-red/20 text-accent-red px-4 py-3 rounded-xl text-sm">
          {{ error }}
        </div>

        <!-- Reset Button -->
        <button 
          type="submit"
          :disabled="loading"
          class="w-full bg-accent-blue hover-accent-blue text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Update Password</span>
          <span v-else>Updating...</span>
        </button>

        <!-- Back to Login -->
        <div class="text-center pt-4 border-t border-custom">
          <p class="text-secondary">
            <NuxtLink to="/login" class="text-accent-blue hover:text-accent-blue-hover font-semibold transition-colors">
              Back to Login
            </NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const { updatePassword } = useAuth()

const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

const submit = async () => {
  if (loading.value) return
  
  error.value = ''
  success.value = false
  
  // Validation
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  loading.value = true
  
  try {
    const { data, error: authError } = await updatePassword(password.value)
    
    if (authError) {
      error.value = authError
    } else {
      success.value = true
      // Redirect to login after a delay
      setTimeout(() => {
        navigateTo('/login')
      }, 2000)
    }
  } catch (err) {
    error.value = 'Failed to update password. Please try again.'
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: false })
</script>
