import { BaseService } from './base.service'
import type { RuleCategoryReponse } from '~/types/rule-category'

export class RuleCategoryService extends BaseService {
  private static _instance: RuleCategoryService

  public static get instance(): RuleCategoryService {
    if (!RuleCategoryService._instance) {
      RuleCategoryService._instance = new RuleCategoryService()
    }
    return RuleCategoryService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async fetchListRuleCategories(): Promise<RuleCategoryReponse> {
    const response = await this.get('/rule-category/list')
    return response
  }

  
}

export const rulecCategoryService = new RuleCategoryService()