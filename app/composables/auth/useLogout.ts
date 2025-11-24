import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { showToast, ToastType } from '~/common/functions'
import { useHandleRequest } from '../common/useHandleRequest'

export const useLogout = () => {
  const { t } = useI18n()
  const { logout } = useAuthStore()
  const router = useRouter()
  const config = useRuntimeConfig()

  const { isLoading, handleRequest } = useHandleRequest(async () => {
    await logout()
    showToast(ToastType.SUCCESS, t('auth.logout.success') || 'Logout successful')
    router.push(config.app.auth.pages.signIn)
  })

  return {
    isLoading,
    logout: handleRequest,
  }
}

