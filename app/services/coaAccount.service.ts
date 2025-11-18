import type { ICoaAccount, IGetCoaAccountListParams } from "~/types/coaAccount"
import { BaseService } from "./base.service"
import type { ICommonListResponse } from "~/types/common"

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

   async getCoaAccountList(payload: IGetCoaAccountListParams): Promise<ICommonListResponse<ICoaAccount>> {
      return this.get('/list', {
        params: payload,
      })
    }

  
}

export const coaAccountService = new CoaAccountService()