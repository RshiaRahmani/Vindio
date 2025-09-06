<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      Profile GitHub URL Update Test
    </h1>

    <!-- Current Profile Info -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-lg font-semibold mb-4 text-blue-600">Current Profile</h2>
      
      <div v-if="loading" class="text-gray-500">Loading profile...</div>
      
      <div v-else-if="profile" class="space-y-2">
        <p><strong>Name:</strong> {{ profile.full_name || 'Not set' }}</p>
        <p><strong>Bio:</strong> {{ profile.bio || 'Not set' }}</p>
        <p><strong>Website/GitHub:</strong> {{ profile.website || 'Not set' }}</p>
        <p><strong>Created:</strong> {{ new Date(profile.created_at).toLocaleDateString() }}</p>
      </div>
      
      <div v-else class="text-red-500">
        Failed to load profile: {{ error }}
      </div>
    </div>

    <!-- GitHub URL Update Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-lg font-semibold mb-4 text-green-600">Update GitHub URL</h2>
      
      <div class="space-y-4">
        <div>
          <label for="github-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub URL
          </label>
          <input
            id="github-url"
            v-model="newGithubUrl"
            type="url"
            placeholder="https://github.com/yourusername"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <button
          @click="updateGithubUrl"
          :disabled="!newGithubUrl || updating"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ updating ? 'Updating...' : 'Update GitHub URL' }}
        </button>
      </div>

      <!-- Update Result -->
      <div v-if="updateResult" class="mt-4 p-4 rounded-md" :class="updateSuccess ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'">
        <h4 class="font-semibold">{{ updateSuccess ? 'Success!' : 'Error' }}</h4>
        <pre class="text-sm mt-2 overflow-auto">{{ JSON.stringify(updateResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="text-center">
      <button
        @click="loadProfile"
        class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        Refresh Profile
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { patchGithubUrl, getCurrentUserProfile } from '~/utils/profile'

// State
const profile = ref(null)
const loading = ref(true)
const error = ref(null)
const newGithubUrl = ref('')
const updating = ref(false)
const updateResult = ref(null)
const updateSuccess = ref(false)

// Load current profile
const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await getCurrentUserProfile()
    if (result.error) {
      error.value = result.error
      profile.value = null
    } else {
      profile.value = result.data
      error.value = null
    }
  } catch (err) {
    error.value = err.message || 'Failed to load profile'
    profile.value = null
  } finally {
    loading.value = false
  }
}

// Update GitHub URL using the new fetch-based method
const updateGithubUrl = async () => {
  if (!newGithubUrl.value) return
  
  updating.value = true
  updateResult.value = null
  updateSuccess.value = false
  
  try {
    const result = await patchGithubUrl(newGithubUrl.value)
    updateResult.value = result
    updateSuccess.value = true
    
    // Clear the input and refresh the profile
    newGithubUrl.value = ''
    await loadProfile()
    
  } catch (err) {
    updateResult.value = { error: err.message }
    updateSuccess.value = false
  } finally {
    updating.value = false
  }
}

// Load profile on mount
onMounted(() => {
  loadProfile()
})
</script>
