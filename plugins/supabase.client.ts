export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Listen for auth state changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      // User signed in, create or update profile
      await handleUserProfile(session.user)
    } else if (event === 'SIGNED_OUT') {
      // User signed out, clear any local data if needed
      console.log('User signed out')
    }
  })

  // Function to handle user profile creation/update
  const handleUserProfile = async (authUser: any) => {
    const { createUserProfile, getUserProfile } = useDatabase()
    
    try {
      // Check if profile exists
      const { data: existingProfile } = await getUserProfile(authUser.id)
      
      if (!existingProfile || existingProfile.length === 0) {
        // Create new profile
        const profileData = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          avatar_url: authUser.user_metadata?.avatar_url || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        await createUserProfile(profileData)
      }
    } catch (error) {
      console.error('Error handling user profile:', error)
    }
  }
})
