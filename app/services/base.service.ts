import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type CreateAxiosDefaults } from 'axios'
import { HTTP_STATUS_CODE } from '~/types/common'
import { AUTH_DATA_STORED_KEY, AUTH_ENDPOINTS } from '~/common/constants'

import dayjs from 'dayjs'

interface RequestOptions {
  params?: object
  data?: any
  headers?: object
}

export class BaseService {
  private client: AxiosInstance

  constructor(baseURL: string, options?: CreateAxiosDefaults) {
    this.client = axios.create({
      baseURL,
      // withCredentials: true,
      ...options,
    })
    this.initInterceptors()
  }

  private initInterceptors() {
    this.client.interceptors.request.use(
      config => {
        if (AUTH_ENDPOINTS.some(endpoint => config.url?.includes(endpoint))) {
          return config // Skip attaching the Authorization header for these endpoints
        }

        const tokens = localStorage.getItem(AUTH_DATA_STORED_KEY)
        let parsedTokens = tokens ? JSON.parse(tokens) : undefined

        const accessToken = parsedTokens?.accessToken
        const refreshToken = parsedTokens?.refreshToken
        const accessTokenExpiresAt = parsedTokens?.accessTokenExpiresAt
        const refreshTokenExpiresAt = parsedTokens?.refreshTokenExpiresAt

        const isAccessTokenExpired = accessTokenExpiresAt && dayjs().isAfter(dayjs.unix(accessTokenExpiresAt))
        const isRefreshTokenExpired = refreshTokenExpiresAt && dayjs().isAfter(dayjs.unix(refreshTokenExpiresAt))

        if (refreshToken && isRefreshTokenExpired) {
          console.error('Refresh token expired. Logging out.')
          window.location.href = '/auth/sign-in' // Redirect to login page
          return Promise.reject('Refresh token expired')
        }
        if (accessToken && !isAccessTokenExpired) {
          config.headers['Authorization'] = `Bearer ${accessToken}`
        } else if (refreshToken && !isRefreshTokenExpired) {
          config.headers['Authorization'] = `Bearer ${refreshToken}`
        }
        return config
      },
      error => Promise.reject(error),
    )

    this.client.interceptors.response.use(
      response => {
        return {
          ...response,
          data: {
            ...response.data,
            success: response.status === HTTP_STATUS_CODE.OK,
          },
        }
      },
      async error => {
        const originalRequest = error.config
        
        // If there's an error response, return it directly (don't wrap it)
        if (error.response && error.response.data) {
          // Return the error response data as-is
          return Promise.reject({
            response: {
              data: error.response.data,
            },
            message: error.message,
          })
        }
        
        if (error.response && error.response.status === HTTP_STATUS_CODE.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true
          const refreshToken = localStorage.getItem('refreshToken')
          const refreshTokenExpiry = localStorage.getItem('refreshTokenExpiry')
          const isRefreshTokenExpired = dayjs().isAfter(dayjs(refreshTokenExpiry))
          if (refreshToken && !isRefreshTokenExpired) {
            try {
              // Send a request to refresh the access token
              const response = await this.post(
                `${useRuntimeConfig().public.baseUrl}/auth/refresh-token`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${refreshToken}`, // Refresh token in Authorization header
                  },
                },
              )

              // Update tokens
              const { accessToken, accessTokenExpiresAt, refreshTokenExpiresAt: newRefreshExpiry } = response.data
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('accessTokenExpiresAt', accessTokenExpiresAt)

              // Optionally update refresh token expiry if provided
              if (newRefreshExpiry) {
                localStorage.setItem('refreshTokenExpiry', newRefreshExpiry)
              }

              // Retry the original request with the new access token
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

              return this.client(originalRequest)
            } catch (refreshError) {
              console.error('Unable to refresh token:', refreshError)
              localStorage.clear() // Clear storage on refresh failure
              window.location.href = '/'
              // TODO: Login again

              return Promise.reject(refreshError)
            }
          }
        }
        
        // For other errors, reject with the error
        return Promise.reject(error)
      },
    )
  }

  public setConfig(config: CreateAxiosDefaults) {
    if (config.baseURL) this.client.defaults.baseURL = config.baseURL
  }

  public async get(endpoint: string, options?: RequestOptions): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.get(endpoint, options)
      return response.data
    } catch (error) {
      // return error as AxiosError
    }
  }

  public async post(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    try {
      const config: any = {}
      if (options?.params) {
        config.params = options.params
      }
      if (options?.headers) {
        config.headers = options.headers
      }
      const response: AxiosResponse = await this.client.post(endpoint, data, config)
      return response.data
    } catch (error: any) {
      // If error has response data, return it
      if (error?.response?.data) {
        return error.response.data
      }
      // Otherwise throw the error
      throw error
    }
  }

  public async patch(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.patch(endpoint, data, options)
      return response.data
    } catch (error) {
      // return error as AxiosError
    }
  }

  public async delete(endpoint: string, options?: RequestOptions): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.delete(endpoint, options)
      return response.data
    } catch (error) {
      // return error as AxiosError
    }
  }

  public async put(endpoint: string, data?: any, options?: RequestOptions): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.put(endpoint, data, options)
      return response.data
    } catch (error) {
      // return error as AxiosError
    }
  }
}
