import { rulecCategoryService } from "~/services/rule-category.service"
import type { RuleCategory } from "~/types/rule-category"


export const useRuleCategoryStore = defineStore('ruleCategory', () => {
  const ruleCategories = ref<RuleCategory[]>([])

 async function getRuleCategories() {
    const response = await rulecCategoryService.fetchListRuleCategories()
    if (response.success) {
        ruleCategories.value = response.data
    }
    return response
  }

  // Helper functions để lấy options theo code
  const getCurrencyOptions = computed(() => {
    const category = ruleCategories.value.find(cat => cat.code === 'CURRENCY')
    return category?.rule_values || []
  })

  const getProviderOptions = computed(() => {
    const category = ruleCategories.value.find(cat => cat.code === 'PROVIDER')
    return category?.rule_values || []
  })

  const getNetworkOptions = computed(() => {
    const category = ruleCategories.value.find(cat => cat.code === 'NETWORK')
    return category?.rule_values || []
  })

  return {
    ruleCategories,
    getRuleCategories,
    getCurrencyOptions,
    getProviderOptions,
    getNetworkOptions
  }
})
