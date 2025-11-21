import type { HTTP_STATUS_CODE } from "./common"
import type { RuleValue } from "./ruleValue"

export interface RuleCategory {
  id: number
  name: string
  code: string
  metadata: {
    separator: string
    [key: string]: any
  }
  created_at: string
  updated_at: string
  rule_values: RuleValue[]
}

export interface RuleCategoryReponse {
  data: RuleCategory[]
  code: HTTP_STATUS_CODE,
  error: string | null
  success: boolean
}