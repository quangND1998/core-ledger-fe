import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { CardCategory, IGetDropdownCardListParams, IIssueCardParams } from '~/types/cards'
import type { Fees, FeeType, ICommonListResponse, ICommonResponse, IDropdownCardData } from '~/types/common'

export class CommonService extends BaseService {
  private static _instance: CommonService

  public static get instance(): CommonService {
    if (!CommonService._instance) {
      CommonService._instance = new CommonService()
    }
    return CommonService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async getDropdownCategoryList(): Promise<ICommonListResponse<CardCategory>> {
    return this.get('/dropdown/categories')
  }

  async getDropdownCardList(payload: IGetDropdownCardListParams): Promise<ICommonListResponse<IDropdownCardData>> {
    return this.get('/dropdown/cards', {
      params: payload,
    })
  }

  async getDropdownTransactionCategoryList(): Promise<ICommonListResponse<any>> {
    return this.get('/dropdown/categories')
  }

  async getFee(type?: FeeType): Promise<ICommonResponse<Fees>> {
    return this.get('/fees', {
      params: { type },
    })
  }
}

export const commonService = new CommonService()
