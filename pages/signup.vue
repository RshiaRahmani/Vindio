<template>
  <form class="max-w-sm mx-auto p-6 space-y-4 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" @submit.prevent="submit">
    <h2 class="text-xl font-semibold">{{$t("signup")}}</h2>
    <input v-model="email" type="email" :placeholder="$t(email)" class="w-full border px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded" />
    <input v-model="password" type="password" :placeholder="$t(password)" class="w-full border px-2 py-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded" />
    <button class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">{{$t("signup")}}</button>
    <p class="text-sm mt-2"><NuxtLink to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">{{$t("login")}}</NuxtLink></p>
  </form>
</template>

<script setup>
const email=ref("")
const password=ref("")
const submit = async () => {
  const { token } = await $fetch("/api/auth/register",{ method:"POST", body:{ email:email.value, password:password.value }})
  useCookie("auth_token",{ maxAge:60*60*24*7 }).value = token
  navigateTo("/dashboard")
}
definePageMeta({ layout:"default" })
</script>
