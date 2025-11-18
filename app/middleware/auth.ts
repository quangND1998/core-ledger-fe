import { navigateTo, defineNuxtRouteMiddleware } from '#imports'
import { useProfileStore } from '~/stores/profile'
type MiddlewareMetaObject = {
  /** Whether to only allow unauthenticated users to access this page.
   *
   * Authenticated users will be redirected to `/` or the route defined in `navigateAuthenticatedTo`
   *
   * @default undefined
   */
  unauthenticatedOnly?: boolean
  /** Where to redirect authenticated users if `unauthenticatedOnly` is set to true
   *
   * @default undefined
   */
  navigateAuthenticatedTo?: string
  /** Where to redirect unauthenticated users if this page is protected
   *
   * @default undefined
   */
  navigateUnauthenticatedTo?: string
}
type MiddlewareMeta = boolean | MiddlewareMetaObject

declare module '#app' {
  interface PageMeta {
    auth?: MiddlewareMeta
  }
}

export default defineNuxtRouteMiddleware(to => {
  const metaAuth =
    typeof to.meta.auth === 'object'
      ? {
          unauthenticatedOnly: true,
          ...to.meta.auth,
        }
      : to.meta.auth

  if (metaAuth === false) {
    return
  }

  metaAuth as MiddlewareMeta

  const config = useRuntimeConfig()
  const nuxt = useNuxtApp()
  const profileStore = useProfileStore()
  const isGuestMode = typeof metaAuth === 'object' && (metaAuth as MiddlewareMetaObject).unauthenticatedOnly
  // Guest mode happy path 1: Unauthenticated user is allowed to view page
  if (isGuestMode && !profileStore.profile) {
    return
  }

  // Guest mode edge-case: Developer used guest-mode config style but set `unauthenticatedOnly` to `false`
  if (typeof metaAuth === 'object' && !(metaAuth as MiddlewareMetaObject).unauthenticatedOnly) {
    return
  }

  if (!!profileStore.profile) {
    // Guest mode happy path 2: Authenticated user should be directed to another page
    if (isGuestMode) {
      return navigateTo(
        nuxt.$localePath((metaAuth as MiddlewareMetaObject).navigateAuthenticatedTo ?? config.app.auth.pages.home),
      )
    }
    return
  }

  // We do not want to block the login page when the local provider is used
  if (to.path == config.app.auth.pages.signIn) {
    return
  }

  if (config.app.auth.globalAppMiddleware === true) {
    const matchedRoute = to.matched.length > 0
    if (!matchedRoute) {
      // Hands control back to `vue-router`, which will direct to the `404` page
      return
    }
  }

  return navigateTo(nuxt.$localePath(config.app.auth.pages.signIn))
})
