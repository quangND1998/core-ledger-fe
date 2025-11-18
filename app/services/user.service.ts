import type { LoginCredentials, LoginResponse } from '~/types/auth'
import { BaseService } from './base.service'
import type { ICommonListResponse, ICommonResponse } from '~/types/common'
import type { IUserBalance, IUserProfile,UserBalanceHistoryResponse } from '~/types/user'
import type { ProfileData, } from '~/types/profile'
export class UserService extends BaseService {
  private static _instance: UserService

  public static get instance(): UserService {
    if (!UserService._instance) {
      UserService._instance = new UserService()
    }
    return UserService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/users')
  }

  async getProfile(): Promise<ICommonResponse<IUserProfile>> {
    return this.get('/profile')
  }

  async getBalance(): Promise<ICommonResponse<IUserBalance>> {
    return this.get('/balance')
  }

  async getBalanceHistory(payload:any): Promise<UserBalanceHistoryResponse> {
    return this.get('/balance/history',{
      params: payload
    })
  }

  async updateProfile(data: Partial<ProfileData>): Promise<ICommonResponse<any>> {
    const response = await this.put('/profile', data)
    return response
  }
}

export const userService = new UserService()
