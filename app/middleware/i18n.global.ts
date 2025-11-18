import { CommonLanguage } from "~/types/common"

export default defineNuxtRouteMiddleware(() => {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  i18n.setLocale(CommonLanguage.EN) // Default locale
})
