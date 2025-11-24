import { defineStore } from 'pinia'
import { CommonLogger } from '~/common/logger'
import { ProfileService } from '~/services/profile.service'
import type { ProfileData, ProfileParam } from '~/types/profile'
import type { User } from '~/types/auth'
import { AUTH_DATA_STORED_KEY } from '~/common/constants'

const PROFILE_DATA_STORED_KEY = 'PROFILE_DATA'

export const useProfileStore = defineStore('profile', {
  state: (): { data: ProfileData | undefined } => ({
    data: undefined,
  }),
  actions: {
    setUserData(user: User) {
      this.data = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        guard_name: user.guard_name,
        roles: user.roles,
        permissions: user.permissions,
      }
      
      // Save to localStorage
      if (process.client) {
        localStorage.setItem(PROFILE_DATA_STORED_KEY, JSON.stringify(this.data))
      }
    },
    loadUserData() {
      if (process.client) {
        const storedData = localStorage.getItem(PROFILE_DATA_STORED_KEY)
        if (storedData) {
          try {
            this.data = JSON.parse(storedData)
          } catch (error) {
            CommonLogger.instance.error('Failed to parse profile data from localStorage:', error)
            localStorage.removeItem(PROFILE_DATA_STORED_KEY)
          }
        }
      }
    },
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
      if (process.client) {
        localStorage.removeItem(PROFILE_DATA_STORED_KEY)
      }
    },
  },
  getters: {
    profile: state => state.data,
  },
})
