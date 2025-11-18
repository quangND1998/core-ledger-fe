import { BaseService } from './base.service'
import type { WalletInfoResponse } from '~/types/payment'
export class PaymentService extends BaseService {
  private static _instance: PaymentService

  public static get instance(): PaymentService {
    if (!PaymentService._instance) {
      PaymentService._instance = new PaymentService()
    }
    return PaymentService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/system-payments')
  }

  async getWalletInfo(): Promise<WalletInfoResponse> {
    return this.get('')
  }

}

export const paymentService = new PaymentService()
