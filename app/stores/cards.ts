import { normalize, showToast, ToastType } from '~/common/functions'
import { cardService } from '~/services/cards.service'
import { commonService } from '~/services/common.service'
import { otpService } from '~/services/otp.service'
import {
  CardCategory,
  CardStatus,
  CardUsageType,
  type IIssueCardParams,
  type IGetCardListParams,
  type ICardDetail,
  type ITopupCardParams,
  type IEditCardParams,
  type ICardSensitiveDetail,
} from '~/types/cards'
import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCardStore = defineStore('card', () => {
  const cardCount = ref(0)
  const totalCreatedCard = ref(0)
  const totalBalanceCard = ref(0)
  const activeCardCount  = ref(0)
  const { t } = useI18n()
  const commonStore = useCommonStore()
  const payload = ref<IGetCardListParams>({
    page: 1,
    limit: 10,
    keyword: undefined,
    card_type: undefined,
    card_status: [] as CardStatus[],
    category: [] as CardCategory[],
    start_date: undefined,
    end_date: undefined,
  })

  const isOpenCardTopupModal = ref(false)
  const isVisibleConfirmFreeze = ref(false)
  const isVisibleConfirmCancel = ref(false)
  const isVisibleConfirmUnfreeze = ref(false)
  const isPreventClose = ref(false)

  const isLoading = ref({
    issueCard: false,
    cardTable: false,
    topupCard: false,
    freezeCard: false,
    cancelCard: false,
    unfreezeCard: false,
    editCard: false,
    generateWallet:false,
  })

  const cardList = ref<ICardDetail[]>([])

  const activeCardList = computed(() =>
    cardList.value.filter((card: ICardDetail) => card.card_status === CardStatus.ACTIVE),
  )

  const isShowCardSensitiveDetail = ref(false)
  const cardSensitiveDetail = ref<ICardSensitiveDetail>()

  function setPayload(_payload: IGetCardListParams) {
    payload.value = { ..._payload }
  }

  function setPayloadPage(page: number) {
    payload.value.page = page
  }

  function toggleCardTopupModal(state: boolean) {
    isOpenCardTopupModal.value = state
  }

  function toggleCardFreeze(state: boolean) {
    isVisibleConfirmFreeze.value = state
  }

  function toggleCardUnFreeze(state: boolean) {
    isVisibleConfirmUnfreeze.value = state
  }

  function toggleCardCancel(state: boolean) {
    isVisibleConfirmCancel.value = state
  }

  const isOpenSensitiveOTPModal = ref(false)
  function toggleSensitiveOTPModal(state: boolean) {
    isOpenSensitiveOTPModal.value = state
  }

  const isOpenCardDetailSlideover = ref(false)
  function toggleCardDetailSlideover(state: boolean) {
    isOpenCardDetailSlideover.value = state
    isShowCardSensitiveDetail.value = false
  }

  const isOpenCardEditModal = ref(false)
  function toggleCardEditModal(state: boolean) {
    isOpenCardEditModal.value = state
  }

  const selectedCardDetail = ref<ICardDetail>()

  function setSelectedCardDetail(card?: ICardDetail) {
    selectedCardDetail.value = card
  }

  const selectedCardForTopup = ref<IDropdownCardData | undefined>()

  function setSelectedCardForTopup(card?: ICardDetail) {
    if (card?.id) {
      selectedCardForTopup.value = {
        id: card.id,
        card_name: card?.card_name,
        last_four: card?.last_four,
        balance: card?.balance,
        crypto_wallets:card?.crypto_wallets
      }
    } else {
      selectedCardForTopup.value = undefined
    }
  }

  async function getCardList(payload: IGetCardListParams) {
    isLoading.value.cardTable = true
    cardList.value = []
    const response = await cardService.getCardList(payload)
    if (response.success) {
      cardList.value = response.data.items
      cardCount.value = response.data.total_items
      activeCardCount.value =  response.data.total_active
      totalCreatedCard.value = response.data.total_created
      totalBalanceCard.value = response.data.total_balance
    }
    isLoading.value.cardTable = false
    return response
  }

  async function issueCard(params: IIssueCardParams) {

    isLoading.value.issueCard = true
    commonStore.toggleProcessingModal(true)
    params.card_usage_type = CardUsageType.BUSINESS
    const response = await cardService.issueCard(params)
    commonStore.toggleProcessingModal(false)
    isLoading.value.issueCard = false

    if (response.success) {
      const id = response.data.id
      navigateTo('/cards')
      showToast(ToastType.SUCCESS, t('common.toast.success.issueCard'))
      await getCardList(payload.value)
      selectedCardDetail.value = response.data
      cardSensitiveDetail.value = response.data
      setSelectedCardForTopup(selectedCardDetail.value)
      toggleCardDetailSlideover(true)
      isShowCardSensitiveDetail.value = true
    } else {
      showToast(ToastType.FAILED, response.message || t('common.toast.error'))
    }

    return response
  }

  async function generateCryptoWallet(cardID:string) {
    isLoading.value.generateWallet = true
    commonStore.toggleProcessingModal(true)
    const response = await cardService.generateCryptoWallet(cardID)
    commonStore.toggleProcessingModal(false)
    isLoading.value.generateWallet = false

    if (response.success) {
      selectedCardForTopup.value.crypto_wallets = response.data
      showToast(ToastType.SUCCESS, t('common.toast.success.generateCard'))
    } else {
      showToast(ToastType.FAILED, response.data.error || t('common.toast.error'))
    }
    return response
  }

  async function getCardDetailById(id: string) {
    const response = await cardService.getCardDetailById(id)
    if (response.success) {
      selectedCardDetail.value = response.data
    }
    return response
  }

  async function freezeCard(id: string) {
    const response = await cardService.freezeCard(id)
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

  async function cancelCard(id: string) {
    const response = await cardService.cancelCard(id)
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

  async function unfreezeCard(id: string) {
    const response = await cardService.unfreezeCard(id)
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

  async function topupCard(params: ITopupCardParams) {
    isLoading.value.topupCard = true
    toggleCardTopupModal(false)
    commonStore.toggleProcessingModal(true)
    const response = await cardService.topup(params)
    if (response.success) {
      showToast(ToastType.SUCCESS, t('common.toast.success.topupCard'))
      await getCardList(payload.value)
      await getCardDetailById(params.id)
    } else {
      showToast(ToastType.FAILED, t('common.toast.failed.topupCard'))
    }
    isLoading.value.topupCard = false
    commonStore.toggleProcessingModal(false)
    return response
  }

  async function editCard(params: IEditCardParams, id: string) {
    isLoading.value.editCard = true
    const response = await cardService.editCard(params, id)
    if (response.success) {
      toggleCardEditModal(false)
      showToast(ToastType.SUCCESS, t('common.toast.success.editCard'))
      await getCardList(payload.value)
      await getCardDetailById(id)
      toggleCardDetailSlideover(true)
    } else {
      showToast(ToastType.FAILED, response.message || t('common.toast.error'))
    }
    isLoading.value.editCard = false
    return response
  }

  async function sendOTPSensitiveDetail() {
    commonStore.toggleProcessingModal(true)
    const response = await otpService.sendOTPSensitiveDetail()
    commonStore.toggleProcessingModal(false)
    return response
  }

  async function verifyOTPSensitiveDetail(code: string) {
    let result = {
      success:true
    }
    commonStore.toggleProcessingModal(true)
    const response = await otpService.verifyOTPSensitiveDetail(code)
    commonStore.toggleProcessingModal(false)
    if (!response.success) {
      return {
        success:false
      }
    }
    toggleSensitiveOTPModal(false)
    isShowCardSensitiveDetail.value = true
    isPreventClose.value = false
    if (selectedCardDetail.value?.id) {
      const response = await cardService.getCardSensitiveDetailById(selectedCardDetail.value?.id)
      if (response.success) {
        cardSensitiveDetail.value = response.data
      }
    }
    return result
  }

  async function sendOtpMessage() {
    const response = await otpService.sendOTPSensitiveDetail()
    if (!response.success) {
      showToast(ToastType.FAILED, response.message || t('common.toast.error'))
      return
    }
  }

  return {
    isLoading,
    isVisibleConfirmFreeze,
    isVisibleConfirmCancel,
    isVisibleConfirmUnfreeze,
    toggleCardUnFreeze,
    toggleCardFreeze,
    toggleCardCancel,
    isOpenCardDetailSlideover,
    toggleCardDetailSlideover,
    isOpenCardEditModal,
    toggleCardEditModal,
    isOpenCardTopupModal,
    toggleCardTopupModal,
    isOpenSensitiveOTPModal,
    toggleSensitiveOTPModal,
    payload,
    setPayload,
    setPayloadPage,
    cardList,
    cardCount,
    totalCreatedCard,
    totalBalanceCard,
    activeCardCount,
    getCardList,
    activeCardList,
    selectedCardForTopup,
    setSelectedCardForTopup,
    selectedCardDetail,
    setSelectedCardDetail,
    getCardDetailById,
    isPreventClose,
    issueCard,
    freezeCard,
    cancelCard,
    unfreezeCard,
    topupCard,
    editCard,
    sendOTPSensitiveDetail,
    verifyOTPSensitiveDetail,
    sendOtpMessage,
    isShowCardSensitiveDetail,
    cardSensitiveDetail,
    generateCryptoWallet,
  }
})
