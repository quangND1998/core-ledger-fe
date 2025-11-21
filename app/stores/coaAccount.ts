import { normalize, showToast, ToastType } from '~/common/functions'
import { coaAccountService } from '~/services/coaAccount.service'
import type { ICoaAccountResponse, IGetCoaAccountListParams } from '~/types/coaAccount'

import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCoaAccountStore = defineStore('coaAccount', () => {
  const isLoading = reactive({
    accountTAble: false
  })
  const payload = ref<IGetCoaAccountListParams>({
    page: 1,
    limit: 10,
    search: "",
    types: [],
    currency: [],
    providers: [],
    networks: [],
    status: [],
  })
  
  // Lưu state của filter panel
  const filterState = ref({
    selectedTypes: [] as string[],
    selectedStatuses: [] as string[],
    selectedCurrencies: [] as string[],
    selectedProviders: [] as string[],
    selectedNetworks: [] as string[],
    isFilterOpen: false,
  })
  const coaAccountData = ref<ICoaAccountResponse>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    next_page: null,
    prev_page: null,
  })
  async function getAccountList(payload: IGetCoaAccountListParams) {
    isLoading.accountTAble = true

    const response = await coaAccountService.getCoaAccountList(payload)
    if (response.success) {
      coaAccountData.value = response.data
      // console.log(coaAccountResponse.value)
    }
    isLoading.accountTAble = false
    return response
  }
  function setPayload(_payload: IGetCoaAccountListParams) {
    payload.value = { ..._payload }
  }
  
  function setFilterState(state: { 
    selectedTypes?: string[], 
    selectedStatuses?: string[], 
    selectedCurrencies?: string[],
    selectedProviders?: string[],
    selectedNetworks?: string[],
    isFilterOpen?: boolean 
  }) {
    if (state.selectedTypes !== undefined) {
      filterState.value.selectedTypes = state.selectedTypes
    }
    if (state.selectedStatuses !== undefined) {
      filterState.value.selectedStatuses = state.selectedStatuses
    }
    if (state.selectedCurrencies !== undefined) {
      filterState.value.selectedCurrencies = state.selectedCurrencies
    }
    if (state.selectedProviders !== undefined) {
      filterState.value.selectedProviders = state.selectedProviders
    }
    if (state.selectedNetworks !== undefined) {
      filterState.value.selectedNetworks = state.selectedNetworks
    }
    if (state.isFilterOpen !== undefined) {
      filterState.value.isFilterOpen = state.isFilterOpen
    }
  }

  return {
    payload,
    isLoading,
    coaAccountData,
    filterState,
    getAccountList,
    setPayload,
    setFilterState
  }
})
