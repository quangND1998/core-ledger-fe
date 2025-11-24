import { ref, reactive, computed } from 'vue'
import { coaAccountService } from '~/services/coaAccount.service'
import { requestCoaAccountService } from '~/services/request-account.service'
import type { ICoaRule, ICoaRuleGroup, ICoaRuleStep } from '~/types/coaRules'
import type { ICreateRequestCoaAccountPayload } from '~/types/coaRules'
import { showToast } from '~/common/functions'

export const useCoAccountRequestStore = defineStore('coAccount_request', () => {
  // Loading states
  const isLoading = reactive({
    coaRules: false,
    checkAccountNo: false,
    createRequest: false,
  })

  // COA Rules data
  const coaRules = ref<ICoaRule[]>([])

  // Form state
  const formData = ref({
    accountName: '',
    accountNo: '',
    accountStatus: '',
    description: '',
  })

  // Selected values
  const selectedType = ref<string>('')
  const selectedGroup = ref<string>('')
  
  // Dynamic fields state - lưu giá trị cho từng step
  const stepValues = ref<Record<number, string>>({})

  // Errors
  const errors = ref<Record<string, string>>({})

  // Account No validation
  const accountNoExists = ref(false)
  const accountNoChecked = ref(false)

  // Computed: Get current rule based on selected type
  const currentRule = computed(() => {
    if (!selectedType.value) return null
    return coaRules.value.find(rule => rule.code === selectedType.value) || null
  })

  // Computed: Get current group based on selected group
  const currentGroup = computed(() => {
    if (!currentRule.value) return null
    
    // Nếu có selectedGroup, tìm group đó
    if (selectedGroup.value) {
      return currentRule.value.groups.find(group => 
        group.id.toString() === selectedGroup.value || group.code === selectedGroup.value
      ) || null
    }
    
    // Nếu không có selectedGroup, kiểm tra xem có group với id = 0 không
    // Nếu có, tự động chọn group đó (cho REV và EXP)
    const zeroGroup = currentRule.value.groups.find(g => g.id === 0)
    if (zeroGroup) {
      return zeroGroup
    }
    
    return null
  })

  // Computed: Get steps to render
  const stepsToRender = computed(() => {
    if (!currentGroup.value) return []
    return currentGroup.value.steps.sort((a, b) => a.step_order - b.step_order)
  })

  // Computed: Get available groups for selected type (chỉ groups có id != 0)
  const availableGroups = computed(() => {
    if (!currentRule.value) return []
    return currentRule.value.groups.filter(g => g.id !== 0)
  })

  // Computed: Check if should show group selector
  const shouldShowGroupSelector = computed(() => {
    if (!currentRule.value) return false
    return currentRule.value.groups.filter(g => g.id !== 0).length > 0
  })

  // Computed: Generate account code
  const generatedAccountCode = computed(() => {
    if (!currentRule.value || !selectedType.value) return '-'
    
    const codeParts: string[] = []
    
    // Bắt đầu với type
    codeParts.push(selectedType.value)
    
    // Nếu có group và group id không phải 0, thêm group code với separator của rule
    if (currentGroup.value && currentGroup.value.id !== 0) {
      codeParts.push(currentRule.value.separator || ':')
      codeParts.push(currentGroup.value.code)
    }
    
    // Thêm các step values với separator của từng step
    const sortedSteps = stepsToRender.value
    for (let i = 0; i < sortedSteps.length; i++) {
      const step = sortedSteps[i]
      const stepValue = stepValues.value[step.step_id]
      
      if (stepValue) {
        // Thêm separator trước step value (nếu không phải step đầu tiên, dùng separator của step trước)
        // Nếu là step đầu tiên, dùng separator của group hoặc rule
        if (i > 0) {
          // Dùng separator của step trước đó
          const prevStepSeparator = sortedSteps[i - 1].separator || ''
          if (prevStepSeparator) {
            codeParts.push(prevStepSeparator)
          }
        } else {
          // Step đầu tiên: dùng separator của group (nếu có) hoặc rule
          if (currentGroup.value && currentGroup.value.id !== 0) {
            codeParts.push(currentGroup.value.separator || ':')
          } else {
            codeParts.push(currentRule.value.separator || ':')
          }
        }
        
        // Thêm step value
        codeParts.push(stepValue)
      }
    }
    
    // Join tất cả lại
    return codeParts.join('')
  })

  // Fetch COA rules
  async function fetchCoaRules() {
    isLoading.coaRules = true
    try {
      const response = await requestCoaAccountService.fetchCoaRules()
      if (response.success && response.data) {
        coaRules.value = response.data
      }
      return response
    } catch (error) {
      console.error('Error fetching COA rules:', error)
      showToast('Failed to load account code rules', 'error')
      return { success: false, error }
    } finally {
      isLoading.coaRules = false
    }
  }

  // Check account number exists
  async function checkAccountNo(accountNo: string) {
    if (!accountNo || !accountNo.trim()) {
      accountNoChecked.value = false
      accountNoExists.value = false
      return { success: false, exists: false }
    }

    isLoading.checkAccountNo = true
    accountNoChecked.value = false
    
    try {
      const response = await coaAccountService.checkAccountNoExist(accountNo.trim())
      accountNoExists.value = response.exists
      accountNoChecked.value = true
      return response
    } catch (error: any) {
      console.error('Error checking account number:', error)
      accountNoChecked.value = false
      return { success: false, exists: false, error: error.message }
    } finally {
      isLoading.checkAccountNo = false
    }
  }

  // Helper function to get step value by category code
  function getStepValueByCategory(categoryCode: string): string | undefined {
    const step = stepsToRender.value.find(s => s.category_code === categoryCode)
    if (step) {
      return stepValues.value[step.step_id] || undefined
    }
    return undefined
  }

  // Helper function to get step value by input code
  function getStepValueByInputCode(inputCode: string): string | undefined {
    const step = stepsToRender.value.find(s => s.input_code === inputCode)
    if (step) {
      return stepValues.value[step.step_id] || undefined
    }
    return undefined
  }

  // Validate form
  function validateForm(): boolean {
    errors.value = {}
    
    if (!formData.value.accountName.trim()) {
      errors.value.accountName = 'Account name is required'
    }
    
    if (!formData.value.accountNo.trim()) {
      errors.value.accountNo = 'Account No. is required'
    } else if (accountNoExists.value) {
      errors.value.accountNo = 'This account no. already exists!'
    }
    
    if (!formData.value.accountStatus) {
      errors.value.accountStatus = 'Account Status is required'
    }
    
    if (!selectedType.value) {
      errors.value.type = 'Type is required'
    }
    
    // Validate group chỉ nếu có groups với id != 0
    if (shouldShowGroupSelector.value && !selectedGroup.value) {
      errors.value.group = 'Group is required'
    }
    
    // Validate all steps
    for (const step of stepsToRender.value) {
      if (!stepValues.value[step.step_id]) {
        errors.value[`step_${step.step_id}`] = `${step.label || 'This field'} is required`
      }
    }
    
    // Validate currency is required (must be in steps)
    const currencyStep = stepsToRender.value.find(s => s.category_code === 'CURRENCY')
    if (currencyStep && !stepValues.value[currencyStep.step_id]) {
      errors.value.currency = 'Currency is required'
    }
    
    return Object.keys(errors.value).length === 0
  }

  // Create request account
  async function createRequestAccount(): Promise<{ success: boolean; error?: string }> {
    if (!validateForm()) {
      return { success: false, error: 'Please fill in all required fields' }
    }

    if (accountNoExists.value) {
      return { success: false, error: 'This account number already exists' }
    }

    isLoading.createRequest = true
    
    try {
      // Get currency (required)
      const currency = getStepValueByCategory('CURRENCY')
      if (!currency) {
        return { success: false, error: 'Currency is required' }
      }
      
      // Get optional fields
      const provider = getStepValueByCategory('PROVIDER')
      const network = getStepValueByCategory('NETWORK')
      
      // Validate type is one of allowed values
      const validTypes: Array<'ASSET' | 'LIAB' | 'EQUITY' | 'REV' | 'EXP'> = ['ASSET', 'LIAB', 'EQUITY', 'REV', 'EXP']
      if (!validTypes.includes(selectedType.value as any)) {
        return { success: false, error: 'Invalid account type' }
      }
      
      const payload: ICreateRequestCoaAccountPayload = {
        request_type: 'CREATE',
        account_data: {
          account_no: formData.value.accountNo.trim(),
          code: generatedAccountCode.value,
          currency: currency,
          status: formData.value.accountStatus,
          type: selectedType.value as 'ASSET' | 'LIAB' | 'EQUITY' | 'REV' | 'EXP',
          name: formData.value.accountName.trim(),
          // Optional fields
          provider: provider || null,
          network: network || null,
          description: formData.value.description?.trim() || null,
          parent_id: null,
        }
      }
      
      const response = await requestCoaAccountService.createRequestCoaAccount(payload)
      
      if (response.success) {
        resetForm()
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Failed to create account request' }
      }
    } catch (error: any) {
      console.error('Error creating account request:', error)
      return { success: false, error: error.message || 'Failed to create account request' }
    } finally {
      isLoading.createRequest = false
    }
  }

  // Reset form
  function resetForm() {
    formData.value = {
      accountName: '',
      accountNo: '',
      accountStatus: '',
      description: '',
    }
    selectedType.value = ''
    selectedGroup.value = ''
    stepValues.value = {}
    errors.value = {}
    accountNoExists.value = false
    accountNoChecked.value = false
  }

  // Set selected type
  function setSelectedType(type: string) {
    selectedType.value = type
    selectedGroup.value = ''
    stepValues.value = {}
    errors.value = {}
    
    // Nếu rule mới có group với id = 0, tự động set selectedGroup
    if (currentRule.value) {
      const zeroGroup = currentRule.value.groups.find(g => g.id === 0)
      if (zeroGroup && currentRule.value.groups.filter(g => g.id !== 0).length === 0) {
        // Chỉ auto-select nếu không có group nào khác
        selectedGroup.value = '0'
      }
    }
  }

  // Set selected group
  function setSelectedGroup(groupId: string) {
    selectedGroup.value = groupId
    stepValues.value = {}
    errors.value = {}
  }

  // Set step value
  function setStepValue(stepId: number, value: string) {
    stepValues.value[stepId] = value
    // Clear error for this step
    if (errors.value[`step_${stepId}`]) {
      delete errors.value[`step_${stepId}`]
    }
  }

  // Set form field
  function setFormField(field: keyof typeof formData.value, value: string) {
    formData.value[field] = value
    // Clear error for this field
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  return {
    // State
    isLoading,
    coaRules,
    formData,
    selectedType,
    selectedGroup,
    stepValues,
    errors,
    accountNoExists,
    accountNoChecked,
    
    // Computed
    currentRule,
    currentGroup,
    stepsToRender,
    availableGroups,
    shouldShowGroupSelector,
    generatedAccountCode,
    
    // Actions
    fetchCoaRules,
    checkAccountNo,
    createRequestAccount,
    resetForm,
    setSelectedType,
    setSelectedGroup,
    setStepValue,
    setFormField,
    validateForm,
    getStepValueByCategory,
    getStepValueByInputCode,
  }
})

