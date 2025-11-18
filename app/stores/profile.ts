import { defineStore } from 'pinia'
import { CommonLogger } from '~/common/logger'
import { ProfileService } from '~/services/profile.service'
import type { ProfileData,ProfileParam } from '~/types/profile'
export const useProfileStore = defineStore('profile', {
  state: (): { data: ProfileData | undefined } => ({
    data: undefined,
  }),
  actions: {
    async updateProfile(data: Partial<ProfileParam>) {
      const response = await ProfileService.instance.updateProfile(data)
      if (!response.success) {
        return {
          success: false,
          message: response.message,
        }
      }
      return {
        success: true,
      }
    },
    async fetchProfile() {
      try {
        const response = await ProfileService.instance.getProfile()
        if (response.code === 200) {
          this.data = response.data
          return true
        }
        return false
      } catch (error) {
        CommonLogger.instance.error('Fetch profile failed:', error)
        this.resetProfile()
        return false
      }
    },
    resetProfile() {
      this.$reset()
    },
  },
  getters: {
    profile: state => state.data,
  },
})
