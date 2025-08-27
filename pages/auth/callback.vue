<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 class="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('authenticating') || 'Authenticating...' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t('pleaseWait') || 'Please wait while we sign you in' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// This page handles OAuth callbacks from Google
const supabase = useSupabaseClient()
const user = useSupabaseUser()

onMounted(async () => {
  try {
    // Get the session from the URL hash (OAuth callback)
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('OAuth callback error:', error)
      await navigateTo('/login?error=oauth-failed')
      return
    }
    
    if (data.session) {
      console.log('OAuth success, user:', data.session.user.email)
      // Redirect to dashboard after successful OAuth
      await navigateTo('/dashboard')
    } else {
      console.log('No session found in callback')
      await navigateTo('/login')
    }
  } catch (error) {
    console.error('Callback processing error:', error)
    await navigateTo('/login?error=callback-failed')
  }
})

// Also watch for user changes
watch(user, async (newUser) => {
  if (newUser) {
    console.log('User authenticated via OAuth:', newUser.email)
    await navigateTo('/dashboard')
  }
}, { immediate: true })
</script>
