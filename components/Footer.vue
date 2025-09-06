<template>
  <footer role="contentinfo" class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 mt-10 transition-colors">
    <div class="container mx-auto px-4 py-8">
      
      <!-- Top row -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <!-- Brand / description -->
        <div>
          <h2 class="text-xl font-semibold">{{ $t('footer_title') }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t('footer_description') }}</p>
        </div>

        <!-- Links -->
        <nav aria-label="Footer" class="flex flex-wrap items-center gap-4">
          <NuxtLink to="/" class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">{{ $t('footer_home') }}</NuxtLink>
          
          <a
            href="https://www.linkedin.com/company/vindio-ai-software-ltd/posts/?feedView=all"
            target="_blank"
            class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {{ $t('footer_about') }}
          </a>
          
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=melike@example.com&cc=cemdir@metu.edu.tr&su=Hello%20Vindio&body=Hi%20there,%0A%0AI%20would%20like%20to%20get%20in%20touch%20with%20you.%0A%0ARegards,"
            target="_blank"
            class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {{ $t('footer_contact') }}
          </a>
        </nav>
      </div>

      <!-- Bottom row -->
      <div class="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        © {{ year }} · {{ $t('footer_rights') }}
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const { $t } = useI18n()
const year = new Date().getFullYear()
</script>
