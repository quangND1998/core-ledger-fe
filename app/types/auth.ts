// types/auth.ts
export interface LoginCredentials {
  email: string
  password: string
}

export interface Version {
  code: string
  name: string
  path: string
}

export interface LoginResponse {
  code: number
  data: {
    access_token: string
    refresh_token: string
  }
}

// Optional: JWT payload type (decoded token)
export interface TokenPayload {
  id: number
  is_employee: boolean
  iat: number
  exp: number
}

// Type for stored auth data
export interface AuthData {
  accessToken: string
  accessTokenExpiresAt: number
  refreshToken: string
  refreshTokenExpiresAt: number
}
