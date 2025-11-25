// stores/auth.ts
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import type { LoginCredentials, LoginResponse, TokenPayload, AuthData } from '~/types/auth'
import { AuthService } from '~/services/auth.service'
import { CommonLogger } from '~/common/logger'
import { AUTH_DATA_STORED_KEY } from '~/common/constants'
import { useI18n } from 'vue-i18n'

export const useAuthStore = defineStore('auth', {
  state: (): { accessToken?: string; refreshToken?: string; refreshInterval?: NodeJS.Timeout } => ({
    accessToken: undefined,
    refreshToken: undefined,
    refreshInterval: undefined, // Store the interval ID
  }),
  actions: {
    setTokens(accessToken: string, refreshToken: string, expiresAt?: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken

      if (process.client) {
        const accessDecoded: TokenPayload = jwtDecode(accessToken)
        const refreshDecoded: TokenPayload = jwtDecode(refreshToken)
        
        // Use expires_at from API if provided, otherwise use JWT exp
        let accessTokenExpiresAt = accessDecoded.exp
        if (expiresAt) {
          const expiresDate = new Date(expiresAt)
          accessTokenExpiresAt = Math.floor(expiresDate.getTime() / 1000)
        }
        
        const authData: AuthData = {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt: refreshDecoded.exp,
        }
        localStorage.setItem(AUTH_DATA_STORED_KEY, JSON.stringify(authData))

        // Start periodic refresh check
        this.startRefreshCheck()
      }
    },
    loadTokens() {
      if (process.client) {
        const storedData = localStorage.getItem(AUTH_DATA_STORED_KEY)
        if (storedData) {
          const authData: AuthData = JSON.parse(storedData)
          const currentTime = Math.floor(Date.now() / 1000)
          if (authData.refreshTokenExpiresAt > currentTime) {
            this.accessToken = authData.accessToken
            this.refreshToken = authData.refreshToken
            this.startRefreshCheck() // Start refresh check if tokens are loaded
          } else {
            this.clearTokens() // Clear if refresh token is expired
          }
        }
      }
    },
    clearTokens() {
      if (process.client) {
        localStorage.removeItem(AUTH_DATA_STORED_KEY)
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval) // Stop the refresh check
        }
      }
      this.$reset();
    },
    async login(credentials: LoginCredentials, t?: (key: string) => string) {
      try {
        const response = await AuthService.instance.login(credentials)
        if (response.success && response.data) {
          const { access_token, refresh_token, expires_at, user } = response.data
          
          // Set tokens
          this.setTokens(access_token, refresh_token, expires_at)
          
          // Store user data in profile store
          const profileStore = useProfileStore()
          if (profileStore.setUserData) {
            profileStore.setUserData(user)
          }
          
          return {
            success: true,
          }
        }
        return {
          success: false,
          message: response.message || response.error || (t ? t('common.toast.error') : 'Login failed'),
        }
      } catch (error: any) {
        return {
          success: false,
          message: error?.response?.data?.message || error?.message || (t ? t('common.toast.error') : 'Something went wrong'),
        }
      }
    },
    async logout() {
      try {
        if (this.refreshToken) {
          await AuthService.instance.logout(this.refreshToken)
        }
      } catch (error) {
        CommonLogger.instance.error('Logout API call failed:', error)
      } finally {
        useProfileStore().resetProfile()
        this.clearTokens()
      }
    },
    async refreshTokens(): Promise<boolean> {
      if (!this.refreshToken) return false

      try {
        const response = await AuthService.instance.refreshToken()
        if (response.code === 200) {
          this.setTokens(response.data.access_token, response.data.refresh_token, response.data.expires_at)
          return true
        }
        return false
      } catch (error) {
        CommonLogger.instance.error('Token refresh failed:', error)
        this.clearTokens() // Clear tokens instead of logout to avoid navigation
        return false
      }
    },

    isAccessTokenExpired(): boolean {
      if (!this.accessToken) return true

      if (process.client) {
        const storedData = localStorage.getItem(AUTH_DATA_STORED_KEY)
        if (storedData) {
          const authData: AuthData = JSON.parse(storedData)
          const currentTime = Math.floor(Date.now() / 1000)
          return authData.accessTokenExpiresAt < currentTime
        }
      }
      return true
    },
    isRefreshTokenExpired(): boolean {
      if (!this.refreshToken) return true

      if (process.client) {
        const storedData = localStorage.getItem(AUTH_DATA_STORED_KEY)
        if (storedData) {
          const authData: AuthData = JSON.parse(storedData)
          const currentTime = Math.floor(Date.now() / 1000)
          return authData.refreshTokenExpiresAt < currentTime
        }
      }
      return true
    },
    startRefreshCheck() {
      if (this.refreshInterval) return // Avoid multiple intervals

      this.refreshInterval = setInterval(async () => {
        if (this.isRefreshTokenExpired()) {
          this.clearTokens() // Remove authData if refresh token expires
          CommonLogger.instance.log('Refresh token expired, authData removed from localStorage')
        } else if (this.isAccessTokenExpired()) {
          const refreshed = await this.refreshTokens()
          if (refreshed) {
            CommonLogger.instance.log('Access token refreshed successfully')
          } else {
            CommonLogger.instance.log('Failed to refresh access token, authData cleared')
          }
        }
      }, 60 * 1000) // Check every minute
    },
  },
  getters: {
    getAccessToken: (state): string | undefined => state.accessToken,
    getRefreshToken: (state): string | undefined => state.refreshToken,
    isAuthenticated: (state): boolean => !!state.accessToken,
  },
})
