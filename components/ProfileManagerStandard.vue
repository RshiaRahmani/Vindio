<template>
  <div class="space-y-6 p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
      Profile Management (Supabase Standard Patterns)
    </h2>

    <!-- Current User Profile Display -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 class="text-lg font-semibold mb-4">Current Profile</h3>
      
      <div v-if="profileLoading" class="text-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading profile...</p>
      </div>
      
      <div v-else-if="profileError" class="text-red-600 bg-red-50 p-4 rounded">
        Error: {{ profileError }}
      </div>
      
      <div v-else-if="currentProfile" class="space-y-3">
        <div><strong>Name:</strong> {{ currentProfile.full_name || 'Not set' }}</div>
        <div><strong>Bio:</strong> {{ currentProfile.bio || 'Not set' }}</div>
        <div><strong>Website:</strong> {{ currentProfile.website || 'Not set' }}</div>
        <div><strong>Created:</strong> {{ formatDate(currentProfile.created_at) }}</div>
      </div>
    </div>

    <!-- GitHub URL Editor -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 class="text-lg font-semibold mb-4">Edit GitHub URL</h3>
      
      <div class="space-y-4">
        <div>
          <label for="github" class="block text-sm font-medium mb-2">
            GitHub Profile URL
          </label>
          <input
            id="github"
            v-model="githubUrl"
            type="url"
            placeholder="https://github.com/yourusername"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          @click="updateGithub"
          :disabled="updating"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ updating ? 'Updating...' : 'Update GitHub URL' }}
        </button>
        
        <div v-if="updateMessage" :class="updateError ? 'text-red-600' : 'text-green-600'" class="text-sm">
          {{ updateMessage }}
        </div>
      </div>
    </div>

    <!-- All Profiles (with pagination) -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h3 class="text-lg font-semibold mb-4">All Profiles (Paginated)</h3>
      
      <div class="space-y-4">
        <div class="flex gap-2">
          <button
            @click="loadProfiles(0, 9)"
            class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Load First 10
          </button>
          <button
            @click="loadProfiles(10, 19)"
            class="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Load Next 10
          </button>
        </div>
        
        <div v-if="allProfilesLoading" class="text-gray-600">Loading profiles...</div>
        
        <div v-else-if="allProfiles?.length" class="space-y-2">
          <div
            v-for="profile in allProfiles"
            :key="profile.id"
            class="p-3 border border-gray-200 rounded-lg"
          >
            <div class="font-medium">{{ profile.full_name || 'Anonymous' }}</div>
            <div class="text-sm text-gray-600">{{ profile.bio || 'No bio' }}</div>
          </div>
        </div>
        
        <div v-else class="text-gray-600">No profiles found</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  readCurrentUserProfile, 
  readProfilesWithPagination, 
  updateCurrentUserGithub 
} from '~/utils/supabase-profiles'

// Reactive state
const currentProfile = ref(null)
const profileLoading = ref(false)
const profileError = ref(null)

const githubUrl = ref('')
const updating = ref(false)
const updateMessage = ref('')
const updateError = ref(false)

const allProfiles = ref([])
const allProfilesLoading = ref(false)

// Load current user profile
const loadCurrentProfile = async () => {
  profileLoading.value = true
  profileError.value = null
  
  try {
    const { data, error } = await readCurrentUserProfile()
    
    if (error) {
      profileError.value = error.message || 'Failed to load profile'
    } else {
      currentProfile.value = data
      githubUrl.value = data?.website || ''
    }
  } catch (err) {
    profileError.value = 'Failed to load profile'
  } finally {
    profileLoading.value = false
  }
}

// Update GitHub URL
const updateGithub = async () => {
  updating.value = true
  updateMessage.value = ''
  updateError.value = false
  
  try {
    await updateCurrentUserGithub(githubUrl.value)
    updateMessage.value = 'GitHub URL updated successfully!'
    updateError.value = false
    
    // Reload current profile to show changes
    await loadCurrentProfile()
  } catch (err) {
    updateMessage.value = err.message || 'Failed to update GitHub URL'
    updateError.value = true
  } finally {
    updating.value = false
  }
}

// Load profiles with pagination
const loadProfiles = async (start: number, end: number) => {
  allProfilesLoading.value = true
  
  try {
    const { data, error } = await readProfilesWithPagination(start, end)
    
    if (error) {
      console.error('Error loading profiles:', error)
    } else {
      allProfiles.value = data || []
    }
  } catch (err) {
    console.error('Failed to load profiles:', err)
  } finally {
    allProfilesLoading.value = false
  }
}

// Utility function
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  loadCurrentProfile()
  loadProfiles(0, 9) // Load first 10 profiles
})
</script>
