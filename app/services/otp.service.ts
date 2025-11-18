import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type {
  CardCategory,
  ICardDetail,
  IEditCardParams,
  IGetCardListParams,
  IIssueCardParams,
  ITopupCardParams,
} from '~/types/cards'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'

export class OTPService extends BaseService {
  private static _instance: OTPService

  public static get instance(): OTPService {
    if (!OTPService._instance) {
      OTPService._instance = new OTPService()
    }
    return OTPService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/otp')
  }

  async sendOTPSensitiveDetail(): Promise<ICommonResponse<any>> {
    return this.post(`/send`, {})
  }

  async verifyOTPSensitiveDetail(code: string): Promise<ICommonResponse<any>> {
    return this.post(`/verify`, {
      code: code,
    })
  }
}

export const otpService = new OTPService()
