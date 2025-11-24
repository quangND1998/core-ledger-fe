import { nextTick } from 'vue'
import { coaAccountService } from '~/services/coaAccount.service'
import { requestCoaAccountService } from '~/services/request-account.service'
import type { ICoaRulesResponse, ICoaRule, ICreateRequestCoaAccountPayload, IEditRequestCoaAccountPayload } from '~/types/coaRules'
import type { IRequestCoaAccount, ICodeAnalysis } from '~/types/requestCoaAccount'
import type { ICoaAccount } from '~/types/coaAccount'
import { showToast } from '~/common/functions'

export const useCoaAccountRequestStore = defineStore('coaAccountRequest', () => {
  // Mode: CREATE or EDIT
  const mode = ref<'CREATE' | 'EDIT'>('CREATE')
  const requestId = ref<string | number | null>(null)
  const accountId = ref<number | null>(null) // For EDIT mode from COA Account
  const originalRequestType = ref<'CREATE' | 'EDIT' | null>(null) // Store original request_type from request item

  // Loading states
  const isLoading = reactive({
    checkingAccountNo: false,
    fetchingRules: false,
    creatingRequest: false,
    fetchingDetail: false,
    updatingRequest: false,
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

  // Store original account_no for edit mode (to check if changed)
  const originalAccountNo = ref<string | null>(null)

  // Selection state
  const selectedType = ref<string>('')
  const selectedGroup = ref<string>('')
  
  // Group value - lưu giá trị cho group khi input_type là TEXT
  const groupValue = ref<string>('')
  
  // Step values - lưu giá trị cho từng step
  const stepValues = ref<Record<number, string>>({})
  
  // Validation errors
  const errors = ref<Record<string, string>>({})
  
  // View Rules Modal state
  const isViewRulesModalOpen = ref(false)
  
  // Toggle View Rules Modal
  function toggleViewRulesModal(open?: boolean) {
    if (typeof open === 'boolean') {
      isViewRulesModalOpen.value = open
    } else {
      isViewRulesModalOpen.value = !isViewRulesModalOpen.value
    }
  }
  
  function openViewRulesModal() {
    isViewRulesModalOpen.value = true
  }
  
  function closeViewRulesModal() {
    isViewRulesModalOpen.value = false
  }
  
  // Account No validation
  const accountNoValidation = ref<{
    isChecking: boolean
    exists: boolean | null
    lastChecked: string | null
  }>({
    isChecking: false,
    exists: null,
    lastChecked: null,
  })

  // Fetch COA rules
  async function fetchCoaRules() {
    isLoading.fetchingRules = true
    try {
      const response = await requestCoaAccountService.fetchCoaRules()
      if (response.success && response.data) {
        coaRules.value = response.data
        return { success: true }
      }
      return { success: false, error: 'Failed to load COA rules' }
    } catch (error: any) {
      console.error('Error fetching COA rules:', error)
      return { success: false, error: error.message || 'Failed to load COA rules' }
    } finally {
      isLoading.fetchingRules = false
    }
  }

  // Check if account_no exists
  async function checkAccountNoExist(accountNo: string, skipIfOriginal: boolean = false): Promise<{ success: boolean; exists: boolean; error?: string; message?: string }> {
    // Skip if empty
    if (!accountNo || !accountNo.trim()) {
      accountNoValidation.value.exists = null
      accountNoValidation.value.lastChecked = null
      clearError('accountNo')
      return { success: true, exists: false }
    }

    // Skip check if account_no is same as original (for edit mode)
    if (skipIfOriginal && originalAccountNo.value && accountNo.trim() === originalAccountNo.value.trim()) {
      accountNoValidation.value.exists = false
      accountNoValidation.value.lastChecked = accountNo.trim()
      clearError('accountNo')
      return { success: true, exists: false }
    }

    // Skip if same as last checked
    if (accountNoValidation.value.lastChecked === accountNo && accountNoValidation.value.exists !== null) {
      // Still set error if exists
      if (accountNoValidation.value.exists) {
        setError('accountNo', 'This account no. already exists!')
      } else {
        clearError('accountNo')
      }
      return { 
        success: true, 
        exists: accountNoValidation.value.exists 
      }
    }

    isLoading.checkingAccountNo = true
    accountNoValidation.value.isChecking = true
    
    try {
      const response = await coaAccountService.checkAccountNoExist(accountNo.trim())
      
      if (response.success) {
        accountNoValidation.value.exists = response.exists
        accountNoValidation.value.lastChecked = accountNo.trim()
        
        // Set error message if exists
        if (response.exists) {
          setError('accountNo', response.message || 'This account no. already exists!')
        } else {
          clearError('accountNo')
        }
        
        return {
          success: true,
          exists: response.exists,
          message: response.message,
        }
      } else {
        clearError('accountNo')
        return {
          success: false,
          exists: false,
          error: response.error || 'Failed to check account number',
        }
      }
    } catch (error: any) {
      console.error('Error checking account number:', error)
      clearError('accountNo')
      return {
        success: false,
        exists: false,
        error: error.message || 'Failed to check account number',
      }
    } finally {
      isLoading.checkingAccountNo = false
      accountNoValidation.value.isChecking = false
    }
  }

  // Create account request
  async function createAccountRequest(payload: ICreateRequestCoaAccountPayload) {
    isLoading.creatingRequest = true
    try {
      const response = await requestCoaAccountService.createRequestCoaAccount(payload)
      return response
    } catch (error: any) {
      console.error('Error creating account request:', error)
      return {
        success: false,
        error: error.message || 'Failed to create account request',
      }
    } finally {
      isLoading.creatingRequest = false
    }
  }

  // Update account request
  async function updateAccountRequest(requestId: string | number, payload: ICreateRequestCoaAccountPayload) {
    isLoading.updatingRequest = true
    try {
      const response = await requestCoaAccountService.updateRequestCoaAccount(requestId, payload)
      return response
    } catch (error: any) {
      console.error('Error updating account request:', error)
      return {
        success: false,
        error: error.message || 'Failed to update account request',
      }
    } finally {
      isLoading.updatingRequest = false
    }
  }

  // Create edit request from COA Account (only AccountNo, Status, Description)
  async function createEditRequestFromAccount(payload: IEditRequestCoaAccountPayload) {
    isLoading.creatingRequest = true
    try {
      const response = await requestCoaAccountService.editRequestCoaAccount(payload)
      return response
    } catch (error: any) {
      console.error('Error creating edit request:', error)
      return {
        success: false,
        error: error.message || 'Failed to create edit request',
      }
    } finally {
      isLoading.creatingRequest = false
    }
  }

  // Fetch COA account detail and populate form for edit
  async function fetchAndPopulateAccountDetail(accountId: number | string) {
    console.log('=== fetchAndPopulateAccountDetail START ===')
    console.log('accountId:', accountId, 'type:', typeof accountId)
    
    isLoading.fetchingDetail = true
    try {
      const response = await coaAccountService.getCoaAccountDetail(accountId)
      console.log('=== API Response ===')
      console.log('Full response:', JSON.stringify(response, null, 2))
      console.log('response.success:', response.success)
      console.log('response.data:', response.data)
      console.log('response.error:', response.error)
      
      if (response.success && response.data) {
        const responseData = response.data
        console.log('=== Account Data ===')
        console.log('responseData:', JSON.stringify(responseData, null, 2))
        
        // API returns data in coa_account field
        const accountData = responseData.coa_account || responseData
        console.log('accountData (extracted):', JSON.stringify(accountData, null, 2))
        console.log('accountData.name:', accountData.name)
        console.log('accountData.account_no:', accountData.account_no)
        console.log('accountData.status:', accountData.status)
        
        // Store original account_no for duplicate check
        originalAccountNo.value = accountData.account_no || null
        console.log('originalAccountNo set to:', originalAccountNo.value)
        
        // Populate form fields directly (force update)
        const newFormData = {
          accountName: accountData.name || '',
          accountNo: accountData.account_no || '',
          accountStatus: accountData.status || '',
          description: accountData.metadata?.description || accountData.description || '',
        }
        
        console.log('=== Setting Form Data ===')
        console.log('New form data:', JSON.stringify(newFormData, null, 2))
        
        // Set directly
        formData.value.accountName = newFormData.accountName
        formData.value.accountNo = newFormData.accountNo
        formData.value.accountStatus = newFormData.accountStatus
        formData.value.description = newFormData.description
        
        console.log('Form data after setting:', JSON.stringify(formData.value, null, 2))
        
        // Wait for reactive update
        await nextTick()
        console.log('Form data after nextTick:', JSON.stringify(formData.value, null, 2))
        
        return { success: true, data: accountData }
      }
      
      console.error('=== Failed to load ===')
      console.error('response.success:', response.success)
      console.error('response.error:', response.error)
      return { success: false, error: response.error || 'Failed to load account detail' }
    } catch (error: any) {
      console.error('=== Error ===')
      console.error('Error fetching account detail:', error)
      console.error('Error stack:', error.stack)
      return { success: false, error: error.message || 'Failed to load account detail' }
    } finally {
      isLoading.fetchingDetail = false
      console.log('=== fetchAndPopulateAccountDetail END ===')
    }
  }

  // Fetch request detail and populate form
  async function fetchAndPopulateRequestDetail(requestId: string | number) {
    isLoading.fetchingDetail = true
    try {
      const response = await requestCoaAccountService.fetchRequestDetail(requestId)
      if (response.success && response.data) {
        // Store original request_type from the request item
        originalRequestType.value = response.data.request_type || null
        await populateFormFromCodeAnalysis(response.data)
        return { success: true, data: response.data }
      }
      return { success: false, error: 'Failed to load request detail' }
    } catch (error: any) {
      console.error('Error fetching request detail:', error)
      return { success: false, error: error.message || 'Failed to load request detail' }
    } finally {
      isLoading.fetchingDetail = false
    }
  }

  // Populate form from code_analysis
  async function populateFormFromCodeAnalysis(request: IRequestCoaAccount) {
    if (!request.code_analysis) return

    const analysis = request.code_analysis
    const formData = request.data

    // Set basic form data
    setFormData({
      accountName: formData.name || '',
      accountNo: formData.account_no || '',
      accountStatus: formData.status || '',
      description: formData.description || formData.metadata?.description || '',
    })

    // Ensure COA rules are loaded
    if (coaRules.value.length === 0) {
      await fetchCoaRules()
    }

    // Set type
    setSelectedType(analysis.type_code)

    // Wait for reactive updates
    await nextTick()
    
    const group = analysis.form_data.group
    if (group) {
      // Set selectedGroup to group id (including id = 0)
      // Important: For groups with id = 0, we still need to set it so currentGroup can find it
      setSelectedGroup(group.id.toString())
      
      // Wait for group to be set and reactive updates
      await nextTick()
      
      if (group.input_type === 'TEXT') {
        // For TEXT groups, we need to extract the value from code
        // Parse the code: TYPE:GROUP_VALUE:STEP1 or TYPE:GROUP_VALUE.STEP1
        // Example: "LIAB:123123:USD" -> group value is "123123"
        
        // Use current_value from code_analysis if available (most reliable)
        if (group.current_value) {
          setGroupValue(group.current_value)
        } else {
          // Fallback: parse from code
          const typeSeparator = analysis.form_data.type.separator || ':'
          const codeParts = analysis.code.split(typeSeparator)
          
          if (codeParts.length > 1) {
            // Get the part after type (contains group value and possibly steps)
            const afterType = codeParts.slice(1)
            
            // If there are steps, the group value is the part before the step
            // For "LIAB:123123:USD", afterType = ["123123", "USD"]
            // Group value is "123123" (first part after type)
            if (group.steps.length > 0) {
              // Group value is the first part after type, before step separator
              const groupValueOnly = afterType[0] || ''
              setGroupValue(groupValueOnly)
            } else {
              // No steps, the whole part after type is group value
              setGroupValue(afterType.join(typeSeparator))
            }
          }
        }
      }
      // For SELECT groups (including id = 0), no need to set groupValue
      // The group code will be used automatically in generatedAccountCode for id != 0
      // For id = 0, the group code is not included in the generated code

      // Wait again for any reactive updates
      await nextTick()

      // Set step values from current_value
      group.steps.forEach((step) => {
        if (step.current_value) {
          setStepValue(step.step_id, step.current_value)
        }
      })
    }
  }

  // Set mode and request ID
  function setMode(newMode: 'CREATE' | 'EDIT', id?: string | number, accountIdParam?: number) {
    mode.value = newMode
    requestId.value = id || null
    accountId.value = accountIdParam || null
    // Reset originalRequestType when setting mode (will be set when fetching detail)
    if (newMode === 'CREATE') {
      originalRequestType.value = null
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
    groupValue.value = ''
    stepValues.value = {}
    errors.value = {}
    accountNoValidation.value = {
      isChecking: false,
      exists: null,
      lastChecked: null,
    }
    mode.value = 'CREATE'
    requestId.value = null
    accountId.value = null
    originalRequestType.value = null
    originalAccountNo.value = null
  }

  // Set form data
  function setFormData(data: Partial<typeof formData.value>) {
    formData.value = { ...formData.value, ...data }
  }

  // Set selected type
  function setSelectedType(type: string) {
    selectedType.value = type
    selectedGroup.value = ''
    stepValues.value = {}
    errors.value = {}
  }

  // Set selected group
  function setSelectedGroup(group: string) {
    selectedGroup.value = group
    groupValue.value = ''
    stepValues.value = {}
    errors.value = {}
  }

  // Set group value (for TEXT input_type groups)
  function setGroupValue(value: string) {
    groupValue.value = value
  }

  // Set step value
  function setStepValue(stepId: number, value: string) {
    stepValues.value[stepId] = value
  }

  // Set error
  function setError(key: string, message: string) {
    errors.value[key] = message
  }

  // Clear error
  function clearError(key: string) {
    delete errors.value[key]
  }

  // Clear all errors
  function clearAllErrors() {
    errors.value = {}
  }

  return {
    // State
    mode,
    requestId,
    accountId,
    originalRequestType,
    originalAccountNo,
    isLoading,
    coaRules,
    formData,
    selectedType,
    selectedGroup,
    groupValue,
    stepValues,
    errors,
    accountNoValidation,
    
    // Actions
    fetchCoaRules,
    checkAccountNoExist,
    createAccountRequest,
    updateAccountRequest,
    createEditRequestFromAccount,
    fetchAndPopulateRequestDetail,
    fetchAndPopulateAccountDetail,
    populateFormFromCodeAnalysis,
    setMode,
    resetForm,
    setFormData,
    setSelectedType,
    setSelectedGroup,
    setGroupValue,
    setStepValue,
    setError,
    clearError,
    clearAllErrors,
    isViewRulesModalOpen,
    toggleViewRulesModal,
    openViewRulesModal,
    closeViewRulesModal,
  }
})

