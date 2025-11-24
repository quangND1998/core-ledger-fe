import { ruleValueService } from '~/services/ruleValue.service';
import type { IRuleCategory, AccountCodeRules } from '~/types/ruleValue';
import { RuleCategoryCode } from '~/types/ruleValue';
import { showToast, ToastType } from '~/common/functions';

export const useRuleValueStore = defineStore('ruleValue', () => {
  const isLoading = reactive({
    ruleCategories: false,
    saving: false,
  });

  const ruleCategories = ref<IRuleCategory[]>([]);
  const accountCodeRules = ref<AccountCodeRules>({
    currencies: [],
    providers: [],
    bankNames: [],
    networks: [],
    kindsOfRevenue: [],
    kindsOfExpense: [],
  });

  // Map code sang key trong AccountCodeRules
  const codeToKeyMap: Record<string, keyof AccountCodeRules> = {
    [RuleCategoryCode.CURRENCY]: 'currencies',
    [RuleCategoryCode.PROVIDER]: 'providers',
    [RuleCategoryCode.BANK_NAME]: 'bankNames',
    [RuleCategoryCode.NETWORK]: 'networks',
    [RuleCategoryCode.KINDS_OF_REVENUE]: 'kindsOfRevenue',
    [RuleCategoryCode.KINDS_OF_EXPENSE]: 'kindsOfExpense',
  };

  // Lấy danh sách rule categories từ API
  async function getRuleCategoryList() {
    isLoading.ruleCategories = true;
    try {
      const response = await ruleValueService.getRuleCategoryList();
      if (response.success && response.data) {
        ruleCategories.value = response.data;
        // Transform data từ API sang format AccountCodeRules
        transformToAccountCodeRules(response.data);
      } else {
        showToast(ToastType.FAILED, 'Failed to load rule categories');
      }
      return response;
    } catch (error) {
      showToast(ToastType.FAILED, 'Error loading rule categories');
      console.error('Error loading rule categories:', error);
      return null;
    } finally {
      isLoading.ruleCategories = false;
    }
  }

  // Transform data từ API format sang component format
  function transformToAccountCodeRules(categories: IRuleCategory[]) {
    const rules: AccountCodeRules = {
      currencies: [],
      providers: [],
      bankNames: [],
      networks: [],
      kindsOfRevenue: [],
      kindsOfExpense: [],
    };

    categories.forEach((category) => {
      const key = codeToKeyMap[category.code];
      if (key) {
        // Chỉ lấy các rule values chưa bị xóa
        rules[key] = category.rule_values.filter((rv) => !rv.is_delete);
      }
    });

    accountCodeRules.value = rules;
  }

  // Lưu rule values cho một category
  async function saveRuleValues(categoryId: number, ruleValues: any[]) {
    isLoading.saving = true;
    try {
      const payload = {
        data: ruleValues,
        category_id: categoryId,
      };

      const response = await ruleValueService.saveRuleValues(payload);
      if (response.success) {
        showToast(ToastType.SUCCESS, 'Rule values saved successfully');
        // Reload data sau khi save
        await getRuleCategoryList();
        return { ...response, success: true };
      } else {
        // Return response với errors để component xử lý
        return response;
      }
    } catch (error: any) {
      // Handle error response
      if (error?.response?.data) {
        return error.response.data;
      }
      showToast(ToastType.FAILED, 'Error saving rule values');
      console.error('Error saving rule values:', error);
      return { success: false, errors: {} };
    } finally {
      isLoading.saving = false;
    }
  }

  // Lấy category ID từ code
  function getCategoryIdByCode(code: RuleCategoryCode): number | null {
    const category = ruleCategories.value.find((cat) => cat.code === code);
    return category ? category.id : null;
  }

  // Lấy category từ code
  function getCategoryByCode(code: RuleCategoryCode): IRuleCategory | null {
    return ruleCategories.value.find((cat) => cat.code === code) || null;
  }

  return {
    isLoading,
    ruleCategories,
    accountCodeRules,
    getRuleCategoryList,
    saveRuleValues,
    getCategoryIdByCode,
    getCategoryByCode,
    transformToAccountCodeRules,
  };
});

