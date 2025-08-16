<template>
  <div class="p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
    <h1 class="text-2xl font-bold mb-2">{{$t('dashboard')}}</h1>
    <p class="text-gray-600 dark:text-gray-400">Protected test dashboard. You are successfully authenticated!</p>
    <div class="mt-4 p-4 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded">
      <p class="text-green-700 dark:text-green-300">✅ Authentication working</p>
      <p class="text-green-700 dark:text-green-300">✅ Dark mode working</p>
      <p class="text-green-700 dark:text-green-300">✅ Translation working</p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout:'default' })
</script>
