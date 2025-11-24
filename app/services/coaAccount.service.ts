import type { ICoaAccount, IGetCoaAccountListParams } from "~/types/coaAccount"
import { BaseService } from "./base.service"
import type { ICommonListPaginateResponse } from "~/types/common"

export class CoaAccountService extends BaseService {
  private static _instance: CoaAccountService

  public static get instance(): CoaAccountService {
    if (!CoaAccountService._instance) {
      CoaAccountService._instance = new CoaAccountService()
    }
    return CoaAccountService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/coa-accounts')
  }

   async getCoaAccountList(payload: IGetCoaAccountListParams): Promise<ICommonListPaginateResponse<ICoaAccount>> {
      return this.get('/list', {
        params: payload,
      })
    }

  async getCoaAccountDetail(id: number | string): Promise<{ success: boolean; data?: ICoaAccount; error?: string }> {
    try {
      const response = await this.get(`/${id}`)
      console.log('Raw API response from getCoaAccountDetail:', response)
      console.log('Response type:', typeof response)
      console.log('Response keys:', response ? Object.keys(response) : 'null')
      
      // BaseService.get returns response.data directly (which is the API response)
      // API response format could be:
      // 1. { success: true, data: {...}, error: null }
      // 2. { data: {...} } (wrapped)
      // 3. { ... } (direct data)
      
      if (response) {
        // Case 1: Standard API response with success and data
        if (response.success !== false && response.data) {
          console.log('Using response.data:', response.data)
          // API returns { data: { coa_account: {...}, entries: [], snapshots: [] } }
          // Extract coa_account from response.data
          const accountData = response.data.coa_account || response.data
          return {
            success: true,
            data: accountData
          }
        }
        
        // Case 2: Response has data field but no success
        if (response.data && !response.success) {
          console.log('Using response.data (no success field):', response.data)
          const accountData = response.data.coa_account || response.data
          return {
            success: true,
            data: accountData
          }
        }
        
        // Case 3: Response has coa_account field directly
        if (response.coa_account) {
          console.log('Using response.coa_account:', response.coa_account)
          return {
            success: true,
            data: response.coa_account
          }
        }
        
        // Case 4: Response is the data directly (has account fields)
        if (response.id || response.account_no || response.name) {
          console.log('Using response directly as data:', response)
          return {
            success: true,
            data: response as ICoaAccount
          }
        }
      }
      
      console.error('No valid data found in response')
      return {
        success: false,
        error: response?.error || 'Failed to load account detail'
      }
    } catch (error: any) {
      console.error('Error fetching account detail:', error)
      return {
        success: false,
        error: error.message || 'Failed to load account detail'
      }
    }
  }

  async checkAccountNoExist(accountNo: string): Promise<{ success: boolean; exists: boolean; error?: string; message?: string }> {
    try {
      const response = await this.post(`/${accountNo}/exist`, {})
      
      // Check if response indicates account exists
      // API returns {status: false, message: "...", code: 400} when account exists
      if (response.status === false && response.code === 400) {
        return {
          success: true,
          exists: true,
          message: response.message || 'This account no. already exists!'
        }
      }
      
      // If response has exists field
      if (response.data?.exists === true) {
        return {
          success: true,
          exists: true,
          message: response.message || 'This account no. already exists!'
        }
      }
      
      // Account doesn't exist
      return {
        success: true,
        exists: false
      }
    } catch (error: any) {
      // Handle error response from API
      // BaseService.post returns error.response.data when there's an error
      if (error.status === false && error.code === 400) {
        return {
          success: true,
          exists: true,
          message: error.message || 'This account no. already exists!'
        }
      }
      
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.status === false && errorData.code === 400) {
          return {
            success: true,
            exists: true,
            message: errorData.message || 'This account no. already exists!'
          }
        }
      }
      
      return {
        success: false,
        exists: false,
        error: error.message || 'Failed to check account number'
      }
    }
  }

  
}

export const coaAccountService = new CoaAccountService()