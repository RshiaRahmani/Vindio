
<template>
  <div class="min-h-screen border bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <header class="glass-container mx-10 mt-4 rounded-2xl p-4 backdrop-blur-lg">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{$t('welcome')}}</NuxtLink>
          <template v-if="authed">
            <NuxtLink to="/dashboard" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{$t('dashboard')}}</NuxtLink>
            <NuxtLink to="/profile" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{$t('profile')}}</NuxtLink>
          </template>
        </div>
        
        <div class="flex items-center gap-3">
          <select v-model="locale" class="glass-container px-3 py-2 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
            <option value="en" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">EN</option>
            <option value="tr" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">TR</option>
            <option value="ru" class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">RU</option>
          </select>
          
          <button @click="toggleColorMode" class="glass-container px-3 py-2 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors bg-white/50 dark:bg-gray-700/50">
            <svg v-if="$colorMode.value === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>
          
          <template v-if="authed">
            <button @click="logout" class="glass-container px-4 py-2 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors bg-white/50 dark:bg-gray-700/50">
              {{$t('logout')}}
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="glass-container px-4 py-2 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors bg-white/50 dark:bg-gray-700/50">
              {{$t('login')}}
            </NuxtLink>
            <NuxtLink to="/signup" class="glass-container px-4 py-2 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors bg-white/50 dark:bg-gray-700/50">
              {{$t('signup')}}
            </NuxtLink>
          </template>
        </div>
      </div>
    </header>
    <main class="p-4">
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
const token = useCookie('auth_token')
const authed = computed(()=>!!token.value)
const logout = () => { token.value=null; navigateTo('/login') }
</script>
