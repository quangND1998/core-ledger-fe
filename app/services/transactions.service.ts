import { BaseService } from './base.service'
import type { ITransactionData, IGetTransactionListParams } from '~/types/transactions'
import type { ICommonListResponse,ICommonResponse } from '~/types/common'

export class TransactionService extends BaseService {
  private static _instance: TransactionService

  public static get instance(): TransactionService {
    if (!TransactionService._instance) {
      TransactionService._instance = new TransactionService()
    }
    return TransactionService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/transactions')
  }

  async getTransactionList(payload: IGetTransactionListParams): Promise<ICommonListResponse<ITransactionData>> {
    return this.get('', {
      params: payload,
    })
  }

  async getTransaction(id: string): Promise<ICommonResponse<ITransactionData>> {
    return this.get(`/${id}`)
  }
}

export const transactionService = new TransactionService()
