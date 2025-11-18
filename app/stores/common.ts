import { commonService } from '~/services/common.service'
import { CardStatus, type CardCategory } from '~/types/cards'
import {
  CommonCurrency,
  FeeType,
  PanelChildTab,
  PanelTab,
  type Fees,
  type IDropdownCardData,
  type IFeeData,
} from '~/types/common'

export const useCommonStore = defineStore('common', () => {
  const config = useRuntimeConfig()
  const { t } = useI18n()

  const loading = ref(false)
  const isMobileMenuOpen = ref(false)

  function setLoading(state: boolean) {
    loading.value = state
  }

  // Move to local storage
  const currency = ref<CommonCurrency>(CommonCurrency.USD)

  function setCurrency(c: CommonCurrency) {
    currency.value = c
  }

  const activeTab = ref<PanelTab>(PanelTab.DASHBOARD)

  function setActiveTab(tab: PanelTab) {
    activeTab.value = tab
  }

  const activeChildTab = ref<PanelChildTab>()

  function setActiveChildTab(tab: PanelChildTab | undefined) {
    activeChildTab.value = tab
  }

  const isHeaderBackLayout = ref(false)

  function setHeaderBackLayout(state: boolean) {
    isHeaderBackLayout.value = state
  }

  const categoryList = ref<CardCategory[]>([])

  async function getDropdownCategoryList() {
    const response = await commonService.getDropdownCategoryList()
    if (response.success) {
      categoryList.value = response.data as CardCategory[]
    }
    return response
  }

  const dropdownCardList = ref<IDropdownCardData[]>()

  async function getDropdownCardList() {
    const response = await commonService.getDropdownCardList({ card_status: [CardStatus.ACTIVE], page: 1, limit: 100 })
    if (response.success) {
      dropdownCardList.value = response.data as IDropdownCardData[]
    }
    return response
  }

  const isOpenProcessingModal = ref(false)
  function toggleProcessingModal(state: boolean) {
    isOpenProcessingModal.value = state
  }

  const feeList = ref<Fees>()

  async function getFee() {
    const response = await commonService.getFee()
    if (response.success) {
      feeList.value = response.data
    }
    return response
  }

  async function toggleMobileMenu(isOpen?: boolean) {
    if (typeof isOpen === 'boolean') {
      isMobileMenuOpen.value = isOpen
    } else {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }
  }

  return {
    config,
    loading,
    setLoading,
    currency,
    setCurrency,
    activeTab,
    setActiveTab,
    isHeaderBackLayout,
    setHeaderBackLayout,
    activeChildTab,
    setActiveChildTab,
    categoryList,
    getDropdownCategoryList,
    dropdownCardList,
    getDropdownCardList,
    isOpenProcessingModal,
    toggleProcessingModal,
    feeList,
    getFee,
    isMobileMenuOpen,
    toggleMobileMenu,
  }
})
