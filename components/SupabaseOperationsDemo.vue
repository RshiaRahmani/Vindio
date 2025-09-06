<template>
  <div class="space-y-8 p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
      Complete Supabase Profiles Operations
    </h1>

    <!-- READ Operations -->
    <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold mb-4 text-blue-600">READ Operations</h2>
      
      <div class="grid md:grid-cols-2 gap-4">
        <button @click="loadCurrentProfile" class="btn-primary">
          Load Current User Profile
        </button>
        <button @click="loadAllProfiles" class="btn-primary">
          Load All Profiles
        </button>
        <button @click="loadProfilesPaginated" class="btn-primary">
          Load Profiles (Paginated)
        </button>
        <button @click="loadSpecificColumns" class="btn-primary">
          Load Specific Columns Only
        </button>
      </div>

      <div v-if="readResult" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
        <h4 class="font-semibold">Read Result:</h4>
        <pre class="text-sm overflow-auto">{{ JSON.stringify(readResult, null, 2) }}</pre>
      </div>
    </section>

    <!-- UPDATE Operations -->
    <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold mb-4 text-green-600">UPDATE Operations</h2>
      
      <div class="space-y-4">
        <!-- Update GitHub URL -->
        <div class="flex gap-2">
          <input
            v-model="newGithubUrl"
            placeholder="https://github.com/username"
            class="form-input flex-1"
          />
          <button @click="updateGithubUrl" class="btn-secondary">
            Update GitHub URL
          </button>
        </div>

        <!-- Update Profile -->
        <div class="grid md:grid-cols-3 gap-2">
          <input
            v-model="updateData.full_name"
            placeholder="Full Name"
            class="form-input"
          />
          <input
            v-model="updateData.bio"
            placeholder="Bio"
            class="form-input"
          />
          <input
            v-model="updateData.website"
            placeholder="Website"
            class="form-input"
          />
        </div>
        <button @click="updateProfile" class="btn-secondary">
          Update Current User Profile
        </button>

        <!-- Update by Name -->
        <div class="flex gap-2">
          <input
            v-model="targetName"
            placeholder="Target user's full name"
            class="form-input flex-1"
          />
          <input
            v-model="updateByNameData.bio"
            placeholder="New bio"
            class="form-input flex-1"
          />
          <button @click="updateByName" class="btn-secondary">
            Update User by Name
          </button>
        </div>
      </div>

      <div v-if="updateResult" class="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded">
        <h4 class="font-semibold">Update Result:</h4>
        <pre class="text-sm overflow-auto">{{ JSON.stringify(updateResult, null, 2) }}</pre>
      </div>
    </section>

    <!-- DELETE Operations -->
    <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold mb-4 text-red-600">DELETE Operations</h2>
      
      <div class="space-y-4">
        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded">
          <p class="text-red-600 text-sm mb-2">⚠️ Destructive operations - use with caution!</p>
          
          <div class="flex gap-2">
            <button @click="deleteCurrentUser" class="btn-danger">
              Delete Current User Profile
            </button>
            
            <input
              v-model="deleteTargetName"
              placeholder="Full name to delete"
              class="form-input flex-1"
            />
            <button @click="deleteByName" class="btn-danger">
              Delete by Name
            </button>
          </div>
        </div>
      </div>

      <div v-if="deleteResult" class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded">
        <h4 class="font-semibold">Delete Result:</h4>
        <pre class="text-sm overflow-auto">{{ JSON.stringify(deleteResult, null, 2) }}</pre>
      </div>
    </section>

    <!-- REALTIME Subscriptions -->
    <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
      <h2 class="text-xl font-semibold mb-4 text-purple-600">REALTIME Subscriptions</h2>
      
      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <button @click="subscribeAll" :class="subscriptions.all ? 'btn-active' : 'btn-secondary'">
          {{ subscriptions.all ? '✓' : '' }} All Changes
        </button>
        <button @click="subscribeInserts" :class="subscriptions.inserts ? 'btn-active' : 'btn-secondary'">
          {{ subscriptions.inserts ? '✓' : '' }} Inserts Only
        </button>
        <button @click="subscribeUpdates" :class="subscriptions.updates ? 'btn-active' : 'btn-secondary'">
          {{ subscriptions.updates ? '✓' : '' }} Updates Only
        </button>
        <button @click="subscribeDeletes" :class="subscriptions.deletes ? 'btn-active' : 'btn-secondary'">
          {{ subscriptions.deletes ? '✓' : '' }} Deletes Only
        </button>
        <button @click="subscribeCurrentUser" :class="subscriptions.currentUser ? 'btn-active' : 'btn-secondary'">
          {{ subscriptions.currentUser ? '✓' : '' }} Current User Only
        </button>
        <button @click="unsubscribeAll" class="btn-danger">
          Unsubscribe All
        </button>
      </div>

      <!-- Real-time Events Log -->
      <div class="bg-gray-50 dark:bg-gray-700 rounded p-4">
        <h4 class="font-semibold mb-2">Real-time Events Log:</h4>
        <div class="max-h-40 overflow-y-auto space-y-1">
          <div
            v-for="(event, index) in realtimeEvents"
            :key="index"
            class="text-sm p-2 bg-white dark:bg-gray-600 rounded"
          >
            <span class="font-medium">{{ event.event }}</span>
            <span class="text-gray-500 ml-2">{{ event.timestamp }}</span>
            <pre class="text-xs mt-1">{{ JSON.stringify(event.payload, null, 2) }}</pre>
          </div>
        </div>
        <button @click="clearEvents" class="mt-2 text-xs text-gray-500 hover:text-gray-700">
          Clear Events
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  // Read operations
  readAllProfiles,
  readSpecificColumns,
  readCurrentUserProfile,
  readProfilesWithPagination,
  // Update operations
  updateCurrentUserProfile,
  updateProfilesByName,
  // Delete operations
  deleteCurrentUserProfile,
  deleteProfilesByName,
  // Realtime subscriptions
  subscribeToAllProfileChanges,
  subscribeToProfileInserts,
  subscribeToProfileUpdates,
  subscribeToProfileDeletes,
  subscribeToCurrentUserProfile
} from '~/utils/supabase-profiles'

// Import the new fetch-based method
import { patchGithubUrl } from '~/utils/profile'

// Reactive state
const readResult = ref(null)
const updateResult = ref(null)
const deleteResult = ref(null)

// Form data
const newGithubUrl = ref('')
const updateData = ref({
  full_name: '',
  bio: '',
  website: ''
})
const targetName = ref('')
const updateByNameData = ref({
  bio: ''
})
const deleteTargetName = ref('')

// Realtime state
const subscriptions = ref({
  all: false,
  inserts: false,
  updates: false,
  deletes: false,
  currentUser: false
})
const channels = ref<any[]>([])
const realtimeEvents = ref<any[]>([])

// READ Operations
const loadCurrentProfile = async () => {
  const result = await readCurrentUserProfile()
  readResult.value = result
}

const loadAllProfiles = async () => {
  const result = await readAllProfiles()
  readResult.value = result
}

const loadProfilesPaginated = async () => {
  const result = await readProfilesWithPagination(0, 4) // First 5
  readResult.value = result
}

const loadSpecificColumns = async () => {
  const result = await readSpecificColumns()
  readResult.value = result
}

// UPDATE Operations
const updateGithubUrl = async () => {
  const result = await patchGithubUrl(newGithubUrl.value)
  updateResult.value = result
  newGithubUrl.value = ''
}

const updateProfile = async () => {
  const result = await updateCurrentUserProfile(updateData.value)
  updateResult.value = result
  updateData.value = { full_name: '', bio: '', website: '' }
}

const updateByName = async () => {
  const result = await updateProfilesByName(targetName.value, updateByNameData.value)
  updateResult.value = result
  targetName.value = ''
  updateByNameData.value = { bio: '' }
}

// DELETE Operations
const deleteCurrentUser = async () => {
  if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
    const result = await deleteCurrentUserProfile()
    deleteResult.value = result
  }
}

const deleteByName = async () => {
  if (confirm(`Are you sure you want to delete profile for "${deleteTargetName.value}"?`)) {
    const result = await deleteProfilesByName(deleteTargetName.value)
    deleteResult.value = result
    deleteTargetName.value = ''
  }
}

// REALTIME Operations
const addRealtimeEvent = (event: string, payload: any) => {
  realtimeEvents.value.unshift({
    event,
    payload,
    timestamp: new Date().toLocaleTimeString()
  })
  // Keep only last 10 events
  if (realtimeEvents.value.length > 10) {
    realtimeEvents.value = realtimeEvents.value.slice(0, 10)
  }
}

const subscribeAll = () => {
  if (!subscriptions.value.all) {
    const channel = subscribeToAllProfileChanges((payload) => {
      addRealtimeEvent('ALL_CHANGES', payload)
    })
    channels.value.push(channel)
    subscriptions.value.all = true
  }
}

const subscribeInserts = () => {
  if (!subscriptions.value.inserts) {
    const channel = subscribeToProfileInserts((payload) => {
      addRealtimeEvent('INSERT', payload)
    })
    channels.value.push(channel)
    subscriptions.value.inserts = true
  }
}

const subscribeUpdates = () => {
  if (!subscriptions.value.updates) {
    const channel = subscribeToProfileUpdates((payload) => {
      addRealtimeEvent('UPDATE', payload)
    })
    channels.value.push(channel)
    subscriptions.value.updates = true
  }
}

const subscribeDeletes = () => {
  if (!subscriptions.value.deletes) {
    const channel = subscribeToProfileDeletes((payload) => {
      addRealtimeEvent('DELETE', payload)
    })
    channels.value.push(channel)
    subscriptions.value.deletes = true
  }
}

const subscribeCurrentUser = () => {
  if (!subscriptions.value.currentUser) {
    const channel = subscribeToCurrentUserProfile((payload) => {
      addRealtimeEvent('CURRENT_USER', payload)
    })
    channels.value.push(channel)
    subscriptions.value.currentUser = true
  }
}

const unsubscribeAll = () => {
  channels.value.forEach(channel => {
    if (channel && channel.unsubscribe) {
      channel.unsubscribe()
    }
  })
  channels.value = []
  subscriptions.value = {
    all: false,
    inserts: false,
    updates: false,
    deletes: false,
    currentUser: false
  }
}

const clearEvents = () => {
  realtimeEvents.value = []
}

// Cleanup on unmount
onUnmounted(() => {
  unsubscribeAll()
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors;
}

.btn-active {
  @apply px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors;
}

.btn-danger {
  @apply px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors;
}

.form-input {
  @apply px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white;
}
</style>
