
import { coaAccountService } from '~/services/coaAccount.service'
import { requestCoaAccountService } from '~/services/request-account.service'
import type { ICoaAccountResponse, IGetCoaAccountListParams } from '~/types/coaAccount'
import type { IRequestCoaAccountListResponse, IRequestCoaAccountData, IRequestGetCoaAccountListParams } from '~/types/requestCoaAccount'



export const useReqCoaAccountStore = defineStore('coa-account-request', () => {
  const isLoading = reactive({
    accountReqTable: false
  })
  const payload = ref<IRequestGetCoaAccountListParams>({
    page: 1,
    limit: 10,
    search: "",

  })
  const requestCoaAccountData = ref<IRequestCoaAccountData>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    next_page: null,
    prev_page: null,
    total_pending_request: 0
  })
 
  async function fetchRequestAccountList(payload: IRequestGetCoaAccountListParams) {
    isLoading.accountReqTable = true

    const response = await requestCoaAccountService.fetchListRuleCategories(payload)
    if (response.success) {
      requestCoaAccountData.value = response.data
      console.log(requestCoaAccountData.value)
    }
    isLoading.accountReqTable = false
    return response
  }

  
  function setPayload(_payload: IRequestGetCoaAccountListParams) {
    payload.value = { ..._payload }
  }
  


  return {
    payload,
    isLoading,
    requestCoaAccountData,
    fetchRequestAccountList,
    setPayload,

  }
})
