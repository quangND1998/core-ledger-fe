// Rule Category Types
export interface IRuleValue {
  id?: number;
  category_id: number;
  name: string;
  value: string;
  sort_order?: number;
  is_delete: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IRuleCategory {
  id: number;
  name: string;
  code: string;
  metadata?: {
    separator?: string;
  };
  created_at: string;
  updated_at: string;
  rule_values: IRuleValue[];
}

export interface ISaveRuleValuePayload {
  data: IRuleValue[];
  category_id: number;
}

// Mapping từ code sang key để dễ sử dụng trong component
export enum RuleCategoryCode {
  CURRENCY = 'CURRENCY',
  PROVIDER = 'PROVIDER',
  BANK_NAME = 'BANK_NAME',
  NETWORK = 'NETWORK',
  KINDS_OF_REVENUE = 'KINDS_OF_REVENUE',
  KINDS_OF_EXPENSE = 'KINDS_OF_EXPENSE',
}

// Interface để map data từ API sang format dùng trong component
export interface AccountCodeRules {
  currencies: IRuleValue[];
  providers: IRuleValue[];
  bankNames: IRuleValue[];
  networks: IRuleValue[];
  kindsOfRevenue: IRuleValue[];
  kindsOfExpense: IRuleValue[];
}

