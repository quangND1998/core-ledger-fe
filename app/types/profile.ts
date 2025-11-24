export interface ProfileData {
  id: number
  email: string
  full_name: string
  guard_name: string
  roles: Array<{
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
  }>
  permissions: Array<{
    id: number
    name: string
    guard_name: string
    created_at: string
    updated_at: string
  }>
  phone_number?: string
  country_code?: string
}

export interface ProfileParam {
  email: string
  phone_number: string
  full_name: string
  country_code: string
}

export interface ProfileResponse {
  code: number
  data: ProfileData
}
