import { userService } from '~/services/user.service'
import { type IUserBalance, type IUserProfile } from '~/types/user'
import type { ProfileParam } from '~/types/profile'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const userProfile = ref<IUserProfile>()
  const userBalance = ref<IUserBalance>()

  function resetUser() {
    userProfile.value = undefined
  }

  async function getProfile() {
    const response = await userService.getProfile()
    if (response.success) {
      userProfile.value = response.data
    }
  }

  async function getBalance() {
    const response = await userService.getBalance()
    if (response.success) {
      const balance = response.data
      userBalance.value = balance
    }
  }

  async function updateProfile(data: Partial<ProfileParam>) {
    const response = await userService.updateProfile(data)
    if (!response.success) {
      return {
        success: false,
        message: response.message,
      }
    }
    return {
      success: true,
    }
  }

  return {
    userProfile,
    resetUser,
    getProfile,
    userBalance,
    getBalance,
    updateProfile,
  }
})
