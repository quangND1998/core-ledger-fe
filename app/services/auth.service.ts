import type { LoginCredentials, LoginResponse, LogoutResponse } from '~/types/auth'
import { BaseService } from './base.service'

export class AuthService extends BaseService {
  private static _instance: AuthService

  public static get instance(): AuthService {
    if (!AuthService._instance) {
      AuthService._instance = new AuthService()
    }
    return AuthService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl + '/auth')
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return this.post('/login', credentials)
  }

  async logout(refreshToken: string): Promise<LogoutResponse> {
    return this.post('/logout', { refresh_token: refreshToken })
  }

  async refreshToken(): Promise<any> {
    // return this.post('/refresh-token', {})
    return { code: 403 }
  }
}
