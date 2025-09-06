<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
      🚀 Edge Function Test: Profile GitHub URL Update
    </h1>

    <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h2 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
        ✅ Edge Function Deployed Successfully!
      </h2>
      <p class="text-blue-700 dark:text-blue-300 text-sm">
        Function: <code class="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">profile-update</code><br>
        Status: <span class="font-semibold text-green-600">ACTIVE</span><br>
        Endpoint: <code class="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">/functions/v1/profile-update</code>
      </p>
    </div>

    <!-- Current Profile Info -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border">
      <h2 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Current Profile</h2>
      
      <div v-if="loading" class="text-gray-500">
        <div class="animate-pulse">Loading profile...</div>
      </div>
      
      <div v-else-if="profile" class="space-y-2">
        <p><strong>Name:</strong> {{ profile.full_name || 'Not set' }}</p>
        <p><strong>Bio:</strong> {{ profile.bio || 'Not set' }}</p>
        <p><strong>Website/GitHub:</strong> 
          <span v-if="profile.website" class="font-mono text-blue-600 dark:text-blue-400">{{ profile.website }}</span>
          <span v-else class="text-gray-500">Not set</span>
        </p>
        <p><strong>Created:</strong> {{ formatDate(profile.created_at) }}</p>
      </div>
      
      <div v-else class="text-red-500">
        <p>❌ Failed to load profile</p>
        <pre class="text-xs mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded">{{ error }}</pre>
      </div>
    </div>

    <!-- GitHub URL Update Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border">
      <h2 class="text-lg font-semibold mb-4 text-green-600">🔧 Test Edge Function</h2>
      
      <div class="space-y-4">
        <div>
          <label for="github-url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub URL (will be stored in 'website' column)
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
          @click="testEdgeFunction"
          :disabled="!newGithubUrl || updating"
          class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {{ updating ? '🔄 Testing Edge Function...' : '🚀 Test Edge Function' }}
        </button>
      </div>

      <!-- Update Result -->
      <div v-if="updateResult" class="mt-4 p-4 rounded-md" :class="updateSuccess ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
        <h4 class="font-semibold" :class="updateSuccess ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
          {{ updateSuccess ? '✅ Success!' : '❌ Error' }}
        </h4>
        <pre class="text-sm mt-2 overflow-auto" :class="updateSuccess ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">{{ JSON.stringify(updateResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="text-center">
      <button
        @click="loadProfile"
        :disabled="loading"
        class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {{ loading ? '🔄 Loading...' : '🔄 Refresh Profile' }}
      </button>
    </div>

    <!-- Edge Function Info -->
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">🔍 How this works:</h3>
      <ol class="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
        <li>Uses fetch() to call the deployed Edge Function</li>
        <li>Sends PATCH request to <code>/functions/v1/profile-update</code></li>
        <li>Includes JWT token in Authorization header</li>
        <li>Edge Function validates token and updates database</li>
        <li>Returns success response with updated data</li>
      </ol>
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

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

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

// Test the Edge Function
const testEdgeFunction = async () => {
  if (!newGithubUrl.value) return
  
  updating.value = true
  updateResult.value = null
  updateSuccess.value = false
  
  try {
    console.log('🚀 Testing Edge Function with URL:', newGithubUrl.value)
    const result = await patchGithubUrl(newGithubUrl.value)
    console.log('✅ Edge Function response:', result)
    
    updateResult.value = result
    updateSuccess.value = true
    
    // Clear the input and refresh the profile
    newGithubUrl.value = ''
    await loadProfile()
    
  } catch (err) {
    console.error('❌ Edge Function error:', err)
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
