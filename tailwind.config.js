/**** Tailwind Config ****/ 
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
  ],
  theme: { extend: {} },
  /* Safelist arbitrary variable-based utilities and common semantic classes */
  safelist: [
    // Literal common semantic classes
    'bg-ui-primary', 'bg-ui-accent', 'bg-ui-bg', 'bg-ui-elevated', 'bg-ui-accented',
    'bg-ui-success', 'bg-ui-warning', 'bg-ui-error', 'bg-ui-info',
    'text-ui-primary', 'text-ui-text', 'text-ui-heading',
    // Regex for arbitrary var(...) utilities like bg-[var(--ui-success)]
    { pattern: /^bg-\[var\(--ui-[a-z-]+\)\]$/ },
    { pattern: /^text-\[var\(--ui-[a-z-]+\)\]$/ }
  ],
  plugins: []
}
