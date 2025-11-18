export default defineNuxtRouteMiddleware((to, from) => {
  const route = useRoute()
  if (route.path === '/verify-email') {
    const token = route.query?.token
    if (!token) {
      return navigateTo('/')
    }
  }
})
