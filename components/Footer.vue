<template>
  <footer role="contentinfo" class="bg-gray-900 text-white mt-10">
    <div class="container mx-auto px-4 py-8">
      
      <!-- Top row -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <!-- Brand / description -->
        <div>
          <h2 class="text-xl font-semibold">{{ $t('footer_title') }}</h2>
          <p class="text-sm text-gray-400 mt-1">{{ $t('footer_description') }}</p>
        </div>

        <!-- Links -->
        <nav aria-label="Footer" class="flex flex-wrap items-center gap-4">
          <NuxtLink to="/" class="text-sm hover:text-gray-300">{{ $t('footer_home') }}</NuxtLink>
          <NuxtLink to="/about" class="text-sm hover:text-gray-300">{{ $t('footer_about') }}</NuxtLink>
          <NuxtLink to="/contact" class="text-sm hover:text-gray-300">{{ $t('footer_contact') }}</NuxtLink>
        </nav>
      </div>

      <!-- Bottom row -->
      <div class="mt-8 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
        © {{ year }} · {{ $t('footer_rights') }}
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const { $t } = useNuxtApp()
const year = new Date().getFullYear()
</script>
