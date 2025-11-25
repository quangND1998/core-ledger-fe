import type { IPaginate } from "./common"
import { description } from '../layouts/sidebar.vue';


export enum CoaAccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',

}
export enum CoaAccountTypes {
  ASSET = 'ASSET',
  LIAB = 'LIAB',
  EXP = 'EXP',
  REV = 'REV',
}

export interface IGetCoaAccountListParams {
  page: number
  limit: number
  search: string
  providers?: string[],
  networks: string[],
  status?: CoaAccountStatus[]
  types?: CoaAccountTypes[]
  sort?: string,
  currency?: string[]
}

export interface ICoaAccount {
  id: string
  account_no: string
  code: string
  name: string
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
  description: string|''
  metadata?: any
  // TODO: add more fields as needed
}





// Các response kế thừa base paginate
export type ICoaAccountResponse = IPaginate<ICoaAccount>;

// Export types
export interface IExportCoaAccountParams {
  select: string[];
  query: {
    search?: string;
    status?: string[];
    types?: string[];
    currency?: string[];
    networks?: string[];
    providers?: string[];
    sort?: string;
    limit?: number;
    page?: number;
  };
}