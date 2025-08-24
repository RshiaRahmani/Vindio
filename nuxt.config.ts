// Minimal Nuxt 4 configuration
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-08-24',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    storageKey: 'nuxt-color-mode'
  },
  runtimeConfig: { jwtSecret: process.env.JWT_SECRET || 'dev-secret' }
})
