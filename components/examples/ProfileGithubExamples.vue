<!-- Example: How to use the EditGithub components in your profile page -->

<template>
  <div class="profile-page">
    <h1>Profile Settings</h1>
    
    <!-- Option 1: Use the original EditGithub component (recommended) -->
    <section class="github-section">
      <h2>GitHub Profile</h2>
      <EditGithub />
    </section>
    
    <!-- Option 2: Use the simple utility-based version -->
    <section class="github-section-simple">
      <h2>GitHub Profile (Simple Version)</h2>
      <EditGithubSimple />
    </section>
    
    <!-- Option 3: Use utility function directly in your component -->
    <section class="custom-github">
      <h2>Custom GitHub Editor</h2>
      <div class="space-y-4">
        <input 
          v-model="customGithubUrl" 
          placeholder="https://github.com/username"
          class="w-full p-3 border rounded-lg"
        />
        <button @click="saveCustomGithub" :disabled="saving" class="px-4 py-2 bg-blue-600 text-white rounded">
          {{ saving ? 'Saving...' : 'Save GitHub URL' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { updateGithubUrl } from '~/utils/profile'

// For the custom implementation
const customGithubUrl = ref('')
const saving = ref(false)

const saveCustomGithub = async () => {
  saving.value = true
  try {
    await updateGithubUrl(customGithubUrl.value)
    alert('GitHub URL saved successfully!')
  } catch (error) {
    console.error('Error saving GitHub URL:', error)
    alert('Failed to save GitHub URL')
  } finally {
    saving.value = false
  }
}
</script>
