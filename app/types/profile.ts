export interface ProfileData {
  id: string
  email: string
  phone_number: string
  full_name: string
  country_code: string
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
