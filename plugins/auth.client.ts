export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Handle auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state change:', event)
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user?.email)
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
      // Clear any cached user data
      await navigateTo('/login')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed for:', session?.user?.email)
    }
  })

  // Initialize session on app start
  if (process.client) {
    try {
      // Get the current session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session recovery error:', error)
      } else if (session) {
        console.log('Session recovered for:', session.user.email)
      } else {
        console.log('No existing session found')
      }
    } catch (error) {
      console.error('Error during session initialization:', error)
    }
  }
})
