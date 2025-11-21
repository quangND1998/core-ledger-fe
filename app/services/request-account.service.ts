import { BaseService } from './base.service'
import type {IRequestGetCoaAccountListParams, IRequestCoaAccountListResponse } from '~/types/requestCoaAccount'

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


}

export const requestCoaAccountService = new RequestCoaAccountService()