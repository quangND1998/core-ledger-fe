import { HTTP_STATUS_CODE } from './common'

export interface WalletInfoResponse {
  code: HTTP_STATUS_CODE
  data: WalletData
  message: string
  success: boolean
}

export interface WalletData {
  network: string[]
  token: string[]
  address: NetworkAddresses
}

interface NetworkAddresses {
  SOL: string
  TRX: string
  ETH: string
}

