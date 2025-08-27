<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
    <header class="flex flex-wrap gap-4 items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <NuxtLink to="/" class="font-semibold">{{$t('welcome')}}</NuxtLink>
      <NuxtLink to="/dashboard">{{$t('dashboard')}}</NuxtLink>
      <select v-model="locale" class="border px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded">
        <option value="en">EN</option>
        <option value="tr">TR</option>
        <option value="ru">RU</option>
      </select>
      <button @click="toggleColorMode" class="border px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        {{ $colorMode.value === 'dark' ? ' Light' : ' Dark' }}
      </button>
      <template v-if="authed">
        <button @click="logout" class="border px-2 py-1 bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-800 transition-colors">{{$t('logout')}}</button>
      </template>
      <template v-else>
        <NuxtLink to="/login" class="border px-2 py-1 bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">{{$t('login')}}</NuxtLink>
        <NuxtLink to="/signup" class="border px-2 py-1 bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-800 transition-colors">{{$t('signup')}}</NuxtLink>
      </template>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
const { $t } = useNuxtApp()
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
const localeCookie = useCookie('locale')
const locale = computed({ get:()=> localeCookie.value || 'en', set:v=> (localeCookie.value=v) })

// Use Supabase authentication instead of custom token
const user = useSupabaseUser()
const authed = computed(() => !!user.value)

// Use Supabase logout
const { signOut } = useAuth()
const logout = async () => {
  await signOut()
}
</script>
