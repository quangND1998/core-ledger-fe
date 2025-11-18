import { HTTP_STATUS_CODE } from './common'

export interface UserBalanceHistoryResponse {
  code: HTTP_STATUS_CODE
  data:{
    items: BalanceData[]
  }
  message: string
  success: boolean
}

export interface IUserProfile {
  email: string
  full_name: string
  id: number
  phone_number: string
}

export interface IUserBalance {
  wallet_balance: {
    balance: number
    money_in: number
    money_out: number
  }
  card_balance: {
    total: number
    total_top_up: number
    total_withdraw: number
  }
}



export interface BalanceData {
  date: string
  balance: number
}

