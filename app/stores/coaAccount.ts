import { normalize, showToast, ToastType } from '~/common/functions'
import { coaAccountService } from '~/services/coaAccount.service'
import type { IGetCoaAccountListParams } from '~/types/coaAccount'

import { FeeType, type IDropdownCardData } from '~/types/common'

export const useCoaAccountStore = defineStore('card', () => {
  const isLoading = reactive({
      cardTable:false
  })
  async function getCardList(payload: IGetCoaAccountListParams ) {
    isLoading.cardTable = true

    const response = await coaAccountService.getCoaAccountList(payload)
    if (response.success) {
        console.log(response.data)
    }
    isLoading.cardTable = false
    return response
  }

  


  return {
    isLoading,
    getCardList,
  
  }
})
