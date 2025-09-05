import en from '@/locales/en.json'
import tr from '@/locales/tr.json'
import ru from '@/locales/ru.json'

export default defineNuxtPlugin(() => {
  const locale = useCookie<string>('locale', { default: () => 'en' })
  const messages: Record<string, Record<string, string>> = { en, tr, ru }
  const t = (key: string): string => messages[locale.value]?.[key] || key
  return { 
    provide: { 
      t,
      $t: t  // Also provide as $t for backward compatibility
    } 
  }
})