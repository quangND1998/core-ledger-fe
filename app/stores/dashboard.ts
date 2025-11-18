import type { IUserProfile } from '~/types/user'
import { userService } from '~/services/user.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const authStore = useAuthStore()
  const commonStore = useCommonStore()
  const userProfile = ref<IUserProfile>()
  const toast = useToast()
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n
  const { t } = useI18n()

  const isOpenWalletTopupModal = ref(false)
  const balance_histories = ref([])

  function toggleWalletTopupModal(state: boolean) {
    isOpenWalletTopupModal.value = state
  }

  const isOpenTransactionDetailSlideover = ref(false)

  function toggleTransactionDetailSlideover(state: boolean) {
    isOpenTransactionDetailSlideover.value = state
  }

  const fetchBalanceHistory = async(payload : any)=>{
    let result = {
      success:true
    }
    const response = await userService.getBalanceHistory(payload)
    if (response.success) {
      balance_histories.value = response.data.items
      return result
    }
    return {
      success:false,
      message: response.message ||  t('common.toast.error')
    }
  }

  function resetUser() {
    userProfile.value = undefined
  }

  return {
    userProfile,
    resetUser,
    isOpenWalletTopupModal,
    toggleWalletTopupModal,
    isOpenTransactionDetailSlideover,
    toggleTransactionDetailSlideover,
    fetchBalanceHistory,
    balance_histories,
  }
})
