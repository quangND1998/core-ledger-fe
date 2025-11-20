import { getHeader } from 'h3'
import authMiddleware from '../middleware/auth'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'

export default defineNuxtPlugin(async nuxtApp => {
  const authStore = useAuthStore()
//   const profileStore = useProfileStore()
  const config = useRuntimeConfig()

//   // Load tokens from localStorage on app startup
  authStore.loadTokens()

  // Skip auth if we're prerendering
  let nitroPrerender = false
  if (nuxtApp.ssrContext) {
    nitroPrerender = getHeader(nuxtApp.ssrContext.event, 'x-nitro-prerender') !== undefined
  }

//   // Only fetch session if it was not yet initialized server-side
//   if (authStore.accessToken && !profileStore.profile && !nitroPrerender) {
//     await profileStore.fetchProfile()
//   }

  const { enableRefreshOnWindowFocus } = config.app.auth.session

//   // Listen for when the page is visible, if the user switches tabs
//   // and makes our tab visible again, re-fetch the session, but only if
//   // this feature is not disabled.
//   const visibilityHandler = () => {
//     if (enableRefreshOnWindowFocus && document.visibilityState === 'visible') {
//       if (authStore.accessToken && !nitroPrerender) {
//         profileStore.fetchProfile()
//       }
//     }
//   }

//   nuxtApp.hook('app:mounted', e => {
//     document.addEventListener('visibilitychange', visibilityHandler, false)
//   })

//   const _unmount = nuxtApp.vueApp.unmount
//   nuxtApp.vueApp.unmount = function () {
//     // Clear visibility handler
//     document.removeEventListener('visibilitychange', visibilityHandler, false)

//     profileStore.resetProfile()
//     // Call original unmount
//     _unmount()
//   }

  // 3. Enable the middleware, either globally or as a named `auth` option
  if (config.app.auth.globalAppMiddleware === true) {
    addRouteMiddleware('auth', authMiddleware, {
      global: true,
    })
  }
})
