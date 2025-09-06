<!-- Example usage in pages/profile.vue or any other component -->

<template>
  <div class="max-w-md mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Edit GitHub Profile
    </h2>
    
    <!-- Use the EditGithub component -->
    <EditGithub />
    
    <!-- Or integrate it in a larger form -->
    <div class="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 class="text-lg font-semibold mb-4">Update Your GitHub URL</h3>
      <EditGithub />
    </div>
  </div>
</template>

<script setup>
// No additional imports needed - the EditGithub component handles everything
</script>
