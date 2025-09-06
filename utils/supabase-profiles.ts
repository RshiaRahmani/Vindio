// utils/supabase-profiles.ts
// Following the official Supabase documentation patterns

export async function readAllProfiles() {
  const supabase = useSupabaseClient()
  
  // Read all rows
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    
  return { data: profiles, error }
}

export async function readSpecificColumns() {
  const supabase = useSupabaseClient()
  
  // Read specific columns
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('full_name,bio,website')
    
  return { data: profiles, error }
}

export async function readCurrentUserProfile() {
  const supabase = useSupabaseClient()
  
  // Get current user
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) return { data: null, error: sessErr }
  if (!session?.user) return { data: null, error: new Error('No authenticated user') }

  // Read specific columns for current user
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('full_name,bio,website,created_at')
    .eq('id', session.user.id)
    .single()
    
  return { data: profiles, error }
}

export async function readProfilesWithPagination(start = 0, end = 9) {
  const supabase = useSupabaseClient()
  
  // With pagination
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .range(start, end)
    
  return { data: profiles, error }
}

// UPDATE OPERATIONS (Following Supabase Documentation)

export async function updateCurrentUserGithub(newUrl: string) {
  const supabase = useSupabaseClient()
  
  // Get current user
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr
  if (!session?.user) throw new Error('No authenticated user')

  // Update matching rows - returns the updated values
  const { data, error } = await supabase
    .from('profiles')
    .update({ website: newUrl })
    .eq('id', session.user.id)
    .select()

  return { data, error }
}

export async function updateCurrentUserProfile(updates: { full_name?: string, bio?: string, website?: string }) {
  const supabase = useSupabaseClient()
  
  // Get current user
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr
  if (!session?.user) throw new Error('No authenticated user')

  // Update matching rows - returns the updated values
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()

  return { data, error }
}

export async function updateProfilesByName(targetName: string, updates: { bio?: string, website?: string }) {
  const supabase = useSupabaseClient()
  
  // Update matching rows
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('full_name', targetName)
    .select()

  return { data, error }
}

// DELETE OPERATIONS (Following Supabase Documentation)

export async function deleteCurrentUserProfile() {
  const supabase = useSupabaseClient()
  
  // Get current user
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr
  if (!session?.user) throw new Error('No authenticated user')

  // Delete matching rows
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', session.user.id)

  return { error }
}

export async function deleteProfilesByName(targetName: string) {
  const supabase = useSupabaseClient()
  
  // Delete matching rows
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('full_name', targetName)

  return { error }
}

// REALTIME SUBSCRIPTIONS (Following Supabase Documentation)

export function subscribeToAllProfileChanges(callback: (payload: any) => void) {
  const supabase = useSupabaseClient()
  
  // Subscribe to all events
  const channels = supabase.channel('custom-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('Change received!', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channels
}

export function subscribeToProfileInserts(callback: (payload: any) => void) {
  const supabase = useSupabaseClient()
  
  // Subscribe to inserts
  const channels = supabase.channel('custom-insert-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('Insert received!', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channels
}

export function subscribeToProfileUpdates(callback: (payload: any) => void) {
  const supabase = useSupabaseClient()
  
  // Subscribe to updates
  const channels = supabase.channel('custom-update-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('Update received!', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channels
}

export function subscribeToProfileDeletes(callback: (payload: any) => void) {
  const supabase = useSupabaseClient()
  
  // Subscribe to deletes
  const channels = supabase.channel('custom-delete-channel')
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('Delete received!', payload)
        callback(payload)
      }
    )
    .subscribe()

  return channels
}

export function subscribeToCurrentUserProfile(callback: (payload: any) => void) {
  const supabase = useSupabaseClient()
  
  // Get current user ID first
  const getCurrentUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id
  }

  getCurrentUserId().then(userId => {
    if (userId) {
      // Subscribe to specific rows (current user's profile)
      const channels = supabase.channel('custom-filter-channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          (payload) => {
            console.log('Current user profile change received!', payload)
            callback(payload)
          }
        )
        .subscribe()

      return channels
    }
  })
}
