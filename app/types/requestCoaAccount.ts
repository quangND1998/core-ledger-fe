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

export interface IRequestCoaAccount {
    id: string
    request_type: ReqCoaAccountType
    request_status: ReqCoaAccountStatus
    maker_id: number, 
    data: ICoaAccount
    maker: IMaker
    checker?: IMaker
    created_at: string // ISO datetime
    updated_at: string // ISO datetime
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


