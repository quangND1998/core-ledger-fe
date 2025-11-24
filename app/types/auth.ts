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

export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  full_name: string
  guard_name: string
  roles: Role[]
  permissions: Permission[]
}

export interface LoginResponseData {
  access_token: string
  refresh_token: string
  expires_at: string
  user: User
}

export interface LoginResponse {
  code?: number
  success?: boolean
  status?: boolean
  data: LoginResponseData | null
  error: null | string
  message?: string
}

export interface LogoutResponse {
  code?: number
  success?: boolean
  data: {
    message: string
  }
  error: null | string
}

// Optional: JWT payload type (decoded token)
export interface TokenPayload {
  user_id: number
  email: string
  guard_name: string
  iss: string
  sub: string
  exp: number
  nbf: number
  iat: number
}

// Type for stored auth data
export interface AuthData {
  accessToken: string
  accessTokenExpiresAt: number
  refreshToken: string
  refreshTokenExpiresAt: number
}
