export interface ICoaRuleStepValue {
  id: number
  name: string
  value: string
}

export interface ICoaRuleStep {
  step_id: number
  step_order: number
  type: 'SELECT' | 'TEXT'
  label: string
  category_code?: string
  input_code?: string
  input_type: 'SELECT' | 'TEXT'
  separator: string
  values?: ICoaRuleStepValue[]
}

export interface ICoaRuleGroup {
  id: number
  code: string
  name: string
  input_type: 'SELECT' | 'TEXT'
  separator: string
  steps: ICoaRuleStep[]
}

export interface ICoaRule {
  id: number
  code: string
  name: string
  separator: string
  groups: ICoaRuleGroup[]
}

export interface ICoaRulesResponse {
  data: ICoaRule[]
  error: string | null
}

export type RequestType = 'CREATE' | 'EDIT'

export interface ICoaAccountDataCreate {
  // Required fields for CREATE
  code: string
  account_no: string
  name: string
  type: 'ASSET' | 'LIAB' | 'EQUITY' | 'REV' | 'EXP'
  currency: string
  status: string
  // Optional fields
  parent_id?: number | null
  provider?: string | null
  network?: string | null
  description?: string | null
}

export interface ICoaAccountDataEdit {
  // Required fields for EDIT
  account_id: number
  account_no: string
  status: string
  name?: string // Allow editing name
  // Optional fields
  description?: string | null
}

export interface ICreateRequestCoaAccountPayload {
  request_type: 'CREATE'
  account_data: ICoaAccountDataCreate
}

export interface IEditRequestCoaAccountPayload {
  request_type: 'EDIT'
  account_data: ICoaAccountDataEdit
}

