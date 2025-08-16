<template>
  <div class="p-8 text-center">
    <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{$t('welcome')}}</h1>
    <p class="text-gray-500 dark:text-gray-400 mb-6">Landing page (public)</p>
    <div class="space-x-4">
      <NuxtLink to="/login" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
        {{$t('login')}}
      </NuxtLink>
      <NuxtLink to="/signup" class="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
        {{$t('signup')}}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout:'default' })
</script>
