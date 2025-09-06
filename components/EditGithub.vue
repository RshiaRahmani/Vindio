<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { getCurrentProfile, updateUserProfile } = useDatabase()
const user = useSupabaseUser()

const githubUrl = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

// Load the current GitHub URL when the component mounts
async function loadCurrent() {
  loading.value = true
  error.value = ''
  
  try {
    const profile = await getCurrentProfile()
    if (profile) {
      githubUrl.value = profile.github_link || ''
    }
  } catch (e) {
    console.error('Error loading GitHub URL:', e)
    error.value = 'Failed to load current GitHub URL'
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!user.value) {
    error.value = 'You must be logged in to update your GitHub URL'
    return
  }

  saving.value = true
  error.value = ''
  success.value = ''
  
  try {
    await updateUserProfile(user.value.id, {
      github_link: githubUrl.value || null
    })
    success.value = 'GitHub URL updated successfully!'
  } catch (e) {
    console.error('Error updating GitHub URL:', e)
    error.value = 'Failed to update GitHub URL. Please try again.'
  } finally {
    saving.value = false
  }
}

// Validate GitHub URL format
const isValidGithubUrl = (url: string): boolean => {
  if (!url) return true // Empty is valid
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname === 'github.com' && parsedUrl.pathname.length > 1
  } catch {
    return false
  }
}

const isUrlValid = computed(() => isValidGithubUrl(githubUrl.value))

onMounted(loadCurrent)
</script>

<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading current GitHub URL...</p>
    </div>

    <!-- Form -->
    <div v-else class="space-y-4">
      <div>
        <label 
          for="github" 
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          GitHub Profile URL
        </label>
        <input
          id="github"
          v-model="githubUrl"
          placeholder="https://github.com/yourusername"
          type="url"
          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-colors"
          :class="{
            'border-red-500 focus:ring-red-500 focus:border-red-500': githubUrl && !isUrlValid
          }"
        />
        
        <!-- URL Validation Message -->
        <p v-if="githubUrl && !isUrlValid" class="text-sm text-red-600 dark:text-red-400 mt-1">
          Please enter a valid GitHub URL (e.g., https://github.com/username)
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <p class="text-sm text-green-600 dark:text-green-400">{{ success }}</p>
      </div>

      <!-- Save Button -->
      <button 
        @click="save" 
        :disabled="saving || (githubUrl && !isUrlValid)"
        class="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg
               hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               disabled:bg-gray-400 disabled:cursor-not-allowed
               transition-colors"
      >
        <span v-if="saving" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
        <span v-else>Save GitHub URL</span>
      </button>

      <!-- Current URL Display -->
      <div v-if="githubUrl && isUrlValid" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
        <a 
          :href="githubUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
        >
          {{ githubUrl }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
