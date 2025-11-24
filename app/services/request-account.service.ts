import { BaseService } from './base.service'
import type {IRequestGetCoaAccountListParams, IRequestCoaAccountListResponse, IRequestCoaAccount } from '~/types/requestCoaAccount'
import type { ICoaRulesResponse, ICreateRequestCoaAccountPayload, IEditRequestCoaAccountPayload } from '~/types/coaRules'
import type { ICommonResponse } from '~/types/common'

export class RequestCoaAccountService extends BaseService {
  private static _instance: RequestCoaAccountService

  public static get instance(): RequestCoaAccountService {
    if (!RequestCoaAccountService._instance) {
      RequestCoaAccountService._instance = new RequestCoaAccountService()
    }
    return RequestCoaAccountService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async fetchListRuleCategories(payload: IRequestGetCoaAccountListParams): Promise<IRequestCoaAccountListResponse> {
    return this.get('/request-coa-accounts', {
      params: payload,
    })
  }

  async fetchCoaRules(): Promise<ICoaRulesResponse> {
    return this.get('/rule-category/coa-rules')
  }

  async createRequestCoaAccount(payload: ICreateRequestCoaAccountPayload): Promise<ICommonResponse<any>> {
    return this.post('/request-coa-accounts', payload)
  }

  async editRequestCoaAccount(payload: IEditRequestCoaAccountPayload): Promise<ICommonResponse<any>> {
    return this.post('/request-coa-accounts', payload)
  }

  async fetchRequestDetail(requestId: string | number): Promise<ICommonResponse<IRequestCoaAccount>> {
    return this.get(`/request-coa-accounts/${requestId}`)
  }

  async updateRequestCoaAccount(requestId: string | number, payload: ICreateRequestCoaAccountPayload): Promise<ICommonResponse<any>> {
    return this.put(`/request-coa-accounts/${requestId}`, payload)
  }

  async rejectRequestCoaAccount(requestId: string | number, rejectReason: string): Promise<ICommonResponse<any>> {
    return this.post(`/request-coa-accounts/${requestId}/reject`, {
      reject_reason: rejectReason
    })
  }

  async approveRequestCoaAccount(requestId: string | number): Promise<ICommonResponse<any>> {
    return this.post(`/request-coa-accounts/${requestId}/approve`, {})
  }

  async importCoaAccounts(file: File): Promise<ICommonResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)
    
    return this.post('/excel/import/co-accounts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

}

export const requestCoaAccountService = new RequestCoaAccountService()