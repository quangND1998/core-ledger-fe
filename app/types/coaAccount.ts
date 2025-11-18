

export enum CoaAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',

}
export enum CoaAccountTypes {
    ASSET = 'ASSET',
    LIAB = 'LIAB',
    EXP ='EXP',
    REV = 'REV',
}

export interface IGetCoaAccountListParams {
  page: number
  limit: number
  providers?: string[],
  network?: string[],
  status?: CoaAccountStatus[]
  type?: CoaAccountTypes[]
  sort?: string,
  currency?: string
}

export interface ICoaAccount {
  id: string
  account_no:string
  provider: string
  network?: string
  partend_id?: string
  type: CoaAccountTypes
  status: CoaAccountStatus
  currency?: string
  balance?: number
  created_at: string
  updated_at: string,
  tags?: string[],
  metadata?: any
  // TODO: add more fields as needed
}
