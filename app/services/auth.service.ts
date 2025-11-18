import type { LoginCredentials, LoginResponse } from '~/types/auth'
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

  async refreshToken(): Promise<any> {
    // return this.post('/refresh-token', {})
    return { code: 403 }
  }
}
