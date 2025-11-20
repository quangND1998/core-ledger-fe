import { normalize, showToast, ToastType } from '~/common/functions'
import { coaAccountService } from '~/services/coaAccount.service'
import type { ICoaAccountResponse, IGetCoaAccountListParams } from '~/types/coaAccount'

import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCoaAccountStore = defineStore('card', () => {
  const isLoading = reactive({
    accountTAble: false
  })
  const payload = ref<IGetCoaAccountListParams>({
    page: 1,
    limit: 10,
    search: "",
    type: [],
    currency: [],
    providers: [],
    networks: [],
    status: [],
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




  return {
    isLoading,
    coaAccountData,
    getAccountList,

  }
})
