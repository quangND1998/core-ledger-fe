import type { ProfileData, ProfileResponse } from '~/types/profile'
import { BaseService } from './base.service'

export class ProfileService extends BaseService {
  private static _instance: ProfileService

  public static get instance(): ProfileService {
    if (!ProfileService._instance) {
      ProfileService._instance = new ProfileService()
    }
    return ProfileService._instance
  }

  constructor() {
    const config = useRuntimeConfig()
    super(config.public.baseUrl)
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await this.get('/users/profile')
    return response
  }

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileResponse> {
    const response = await this.put('/users/profile', data)
    return response
  }
}
