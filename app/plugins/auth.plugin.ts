import { getHeader } from 'h3'
import authMiddleware from '../middleware/auth'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'

export default defineNuxtPlugin(async nuxtApp => {
  const authStore = useAuthStore()
  const profileStore = useProfileStore()
  const config = useRuntimeConfig()

  // Load tokens from localStorage on app startup
  authStore.loadTokens()

  // Load profile data from localStorage on app startup
  profileStore.loadUserData()

  // Skip auth if we're prerendering
  let nitroPrerender = false
  if (nuxtApp.ssrContext) {
    nitroPrerender = getHeader(nuxtApp.ssrContext.event, 'x-nitro-prerender') !== undefined
  }

  // If we have tokens but no profile data, try to fetch profile
  // Note: Since login now sets user data directly, this is mainly for page refreshes
  if (authStore.accessToken && !profileStore.profile && !nitroPrerender) {
    // Try to fetch profile if endpoint exists, otherwise user data should be in localStorage
    // For now, we'll skip this since login sets user data directly
    // await profileStore.fetchProfile()
  }

  const { enableRefreshOnWindowFocus } = config.app.auth.session

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session, but only if
  // this feature is not disabled.
  const visibilityHandler = () => {
    if (enableRefreshOnWindowFocus && document.visibilityState === 'visible') {
      if (authStore.accessToken && !nitroPrerender) {
        // Optionally refresh profile data when tab becomes visible
        // profileStore.fetchProfile()
      }
    }
  }

  nuxtApp.hook('app:mounted', () => {
    if (process.client) {
      document.addEventListener('visibilitychange', visibilityHandler, false)
    }
  })

  const _unmount = nuxtApp.vueApp.unmount
  nuxtApp.vueApp.unmount = function () {
    // Clear visibility handler
    if (process.client) {
      document.removeEventListener('visibilitychange', visibilityHandler, false)
    }

    profileStore.resetProfile()
    // Call original unmount
    _unmount()
  }

  // Enable the middleware, either globally or as a named `auth` option
  if (config.app.auth.globalAppMiddleware === true) {
    addRouteMiddleware('auth', authMiddleware, {
      global: true,
    })
  }
})
