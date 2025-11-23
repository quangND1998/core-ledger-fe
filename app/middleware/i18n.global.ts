export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  if (i18n) {
    i18n.setLocale('en') // Default locale
  }
})
