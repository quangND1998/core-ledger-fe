import { BaseService } from "./base.service";
import type { IRuleCategory, ISaveRuleValuePayload } from "~/types/ruleValue";
import type { ICommonResponse } from "~/types/common";

export class RuleValueService extends BaseService {
  private static _instance: RuleValueService;

  public static get instance(): RuleValueService {
    if (!RuleValueService._instance) {
      RuleValueService._instance = new RuleValueService();
    }
    return RuleValueService._instance;
  }

  constructor() {
    const config = useRuntimeConfig();
    super(config.public.baseUrl);
  }

  async getRuleCategoryList(): Promise<ICommonResponse<IRuleCategory[]>> {
    return this.get('/rule-category/list');
  }

  async saveRuleValues(payload: ISaveRuleValuePayload): Promise<ICommonResponse<any>> {
    return this.post('/rule-value', payload);
  }
}

export const ruleValueService = new RuleValueService();

