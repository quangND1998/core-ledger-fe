import type { IPaginate } from "./common"
import type { ICoaAccount } from "./coaAccount"
import type { ICommonListPaginateResponse } from "~/types/common"
export enum ReqCoaAccountStatus {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    APPROVED = 'APPROVED',
}
export enum ReqCoaAccountType {
    CREATE = 'CREATE',
    EDIT = 'EDIT',
}

export interface IRequestGetCoaAccountListParams {
    page: number
    limit: number
    search: string
}
export interface IMaker {
  id: number;
  email: string;
  full_name: string;
  guard_name: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface ICodeAnalysisStep {
  step_id: number
  step_order: number
  type: 'SELECT' | 'TEXT'
  category_code?: string
  input_type: 'SELECT' | 'TEXT'
  separator: string
  values?: Array<{ id: number; name: string; value: string }>
  current_value?: string
  current_value_name?: string
}

export interface ICodeAnalysisGroup {
  id: number
  code: string
  name: string
  input_type: 'SELECT' | 'TEXT'
  separator: string
  selected: boolean
  steps: ICodeAnalysisStep[]
}

export interface ICodeAnalysis {
  code: string
  type_code: string
  type_name: string
  group_code: string
  group_name: string
  is_valid: boolean
  form_data: {
    type: {
      id: number
      code: string
      name: string
      separator: string
      group: ICodeAnalysisGroup
    }
    group: ICodeAnalysisGroup
  }
}

export interface IRequestCoaAccount {
    id: string
    coa_account_id?: number
    request_type: ReqCoaAccountType
    request_status: ReqCoaAccountStatus
    maker_id: number
    checker_id?: number
    data: ICoaAccount
    maker: IMaker
    checker?: IMaker
    coa_account?: ICoaAccount
    code_analysis?: ICodeAnalysis
    created_at: string // ISO datetime
    updated_at: string // ISO datetime
    checked_at?: string
}
// // Các response kế thừa base paginate
// export type IRequestCoaAccountListResponse = IPaginate<ICoaAccount>& {
//   total_pending_request: number;
// };
export type IRequestCoaAccountData = IPaginate<IRequestCoaAccount>& {
  total_pending_request: number;
};


export type IRequestCoaAccountListResponse = ICommonListPaginateResponse<IRequestCoaAccount, {
  total_pending_request: number;
}>


