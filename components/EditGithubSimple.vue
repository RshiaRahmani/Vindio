<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateGithubUrl } from '~/utils/profile'

const githubUrl = ref('')
const loading = ref(false)
const saving = ref(false)

// Load the current value when the component mounts
async function loadCurrent() {
  loading.value = true
  const supabase = useSupabaseClient()
  
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()
  if (sessErr) {
    console.error(sessErr)
    loading.value = false
    return
  }

  // Read specific columns using standard Supabase pattern
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('website')
    .eq('id', session.user.id)
    .single()

  if (error) {
    console.error(error)
  } else {
    githubUrl.value = profiles?.website ?? ''
  }
  loading.value = false
}

async function save() {
  saving.value = true
  try {
    await updateGithubUrl(githubUrl.value)
    alert('GitHub URL updated!')
  } catch (e) {
    console.error(e)
    alert('Failed to update.')
  } finally {
    saving.value = false
  }
}

onMounted(loadCurrent)
</script>
</script>

<template>
  <div class="space-y-4">
    <div>
      <label 
        for="github" 
        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        GitHub profile URL:
      </label>
      <input
        id="github"
        v-model="githubUrl"
        placeholder="https://github.com/username"
        type="url"
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               transition-colors"
      />
    </div>
    
    <button 
      @click="save" 
      :disabled="loading"
      class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg
             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             disabled:bg-gray-400 disabled:cursor-not-allowed
             transition-colors"
    >
      {{ loading ? 'Saving…' : 'Save' }}
    </button>
  </div>
</template>
