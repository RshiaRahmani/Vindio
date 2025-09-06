// utils/profile.ts
export async function updateGithubUrl(newUrl: string) {
  // Use Nuxt's built-in Supabase composable
  const supabase = useSupabaseClient()
  
  // Get the current session (user is already logged in)
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr
  if (!session?.user) throw new Error('No authenticated user')

  // Update only the row that matches the user's id
  const { error } = await supabase
    .from('profiles')
    .update({ website: newUrl })
    .eq('id', session.user.id)

  if (error) throw error
  return true
}

export async function patchGithubUrl(newUrl: string) {
  const supabase = useSupabaseClient()
  
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabase.url

  const res = await fetch(
    `${supabaseUrl}/functions/v1/profile-update`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ github_url: newUrl }),
    }
  );

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to update GitHub URL");
  }

  return await res.json(); // { success: true, github_url: "…" }
}

export async function getCurrentUserProfile() {
  const supabase = useSupabaseClient()
  
  // Get the current session
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) throw sessErr
  if (!session?.user) return { data: null, error: 'No authenticated user' }

  // Read specific columns for current user
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id,full_name,bio,website,created_at')
    .eq('id', session.user.id)
    .single()

  return { data: profiles, error }
}
