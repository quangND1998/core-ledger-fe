<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { X } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'
import { useCoaAccountRequestStore } from '~/stores/coaAccountRequest'
import type { ICreateRequestCoaAccountPayload, IEditRequestCoaAccountPayload } from '~/types/coaRules'
import { showToast , ToastType} from '~/common/functions'
import { useDebounceFn } from '@vueuse/core'
import EditAccountCodeRulesModal from '~/components/coaccount/EditAccountCodeRulesModal.vue'
import { requestCoaAccountService } from '~/services/request-account.service'
interface Props {
  open: boolean
  mode?: 'CREATE' | 'EDIT'
  requestId?: string | number
  accountId?: number
  editFromAccount?: boolean // true if editing from COA Account List (only AccountNo, Status, Description)
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'CREATE',
  requestId: undefined,
  accountId: undefined,
  editFromAccount: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

// Use store
const store = useCoaAccountRequestStore()

// Local state
const activeTab = ref('manually')
const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const importError = ref<string | null>(null)
const isImporting = ref(false)

// Computed from store
const coaRules = computed(() => store.coaRules)
const formData = computed(() => {
  const data = store.formData
  console.log('formData computed accessed:', JSON.stringify(data))
  return data
})
const selectedType = computed({
  get: () => store.selectedType,
  set: (value) => store.setSelectedType(value)
})
const selectedGroup = computed({
  get: () => store.selectedGroup,
  set: (value) => store.setSelectedGroup(value)
})
const groupValue = computed({
  get: () => store.groupValue,
  set: (value) => store.setGroupValue(value)
})
const stepValues = computed(() => store.stepValues)
const errors = computed(() => store.errors)
const accountNoValidation = computed(() => store.accountNoValidation)

// Get current rule based on selected type
const currentRule = computed(() => {
  if (!selectedType.value) return null
  return coaRules.value.find(rule => rule.code === selectedType.value) || null
})

// Get current group based on selected group
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

// Get steps to render
const stepsToRender = computed(() => {
  if (!currentGroup.value) return []
  return currentGroup.value.steps.sort((a, b) => a.step_order - b.step_order)
})

// Get available groups for selected type (chỉ groups có id != 0)
const availableGroups = computed(() => {
  if (!currentRule.value) return []
  return currentRule.value.groups.filter(g => g.id !== 0)
})

// Check if should show group selector
const shouldShowGroupSelector = computed(() => {
  if (!currentRule.value) return false
  return currentRule.value.groups.filter(g => g.id !== 0).length > 0
})

// Check if current group has TEXT input_type
const isGroupTextInput = computed(() => {
  return currentGroup.value?.input_type === 'TEXT'
})

// Generate account code
const generatedAccountCode = computed(() => {
  if (!currentRule.value || !selectedType.value) return '-'
  
  const codeParts: string[] = []
  
  // Bắt đầu với type
  codeParts.push(selectedType.value)
  
  // Nếu có group và group id không phải 0
  if (currentGroup.value && currentGroup.value.id !== 0) {
    codeParts.push(currentRule.value.separator || ':')
    
    // Nếu group có input_type là TEXT, dùng groupValue, ngược lại dùng group.code
    if (currentGroup.value.input_type === 'TEXT' && groupValue.value) {
      codeParts.push(groupValue.value)
    } else if (currentGroup.value.input_type === 'SELECT') {
      codeParts.push(currentGroup.value.code)
    }
  }
  
  // Thêm các step values với separator của từng step
  const sortedSteps = stepsToRender.value
  for (let i = 0; i < sortedSteps.length; i++) {
    const step = sortedSteps[i]
    const stepValue = stepValues.value[step.step_id]
    
    if (stepValue) {
      // Thêm separator trước step value
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

// Debounced function to check account_no
const debouncedCheckAccountNo = useDebounceFn(async (accountNo: string) => {
  if (!accountNo || !accountNo.trim()) {
    store.clearError('accountNo')
    return
  }
  
  // Skip check if editing from account and account_no is same as original
  const skipIfOriginal = props.editFromAccount && store.originalAccountNo && accountNo.trim() === store.originalAccountNo.trim()
  await store.checkAccountNoExist(accountNo, skipIfOriginal)
  // Error is already set in store.checkAccountNoExist
}, 500)

// Watch account_no changes
watch(() => formData.value.accountNo, (newValue) => {
  // Clear error immediately when user starts typing
  if (!newValue || !newValue.trim()) {
    store.clearError('accountNo')
  } else {
    // Clear error and check again
    store.clearError('accountNo')
    debouncedCheckAccountNo(newValue)
  }
})

// Watch selectedType để reset group và step values
watch(selectedType, (newType) => {
  // Auto-select group with id = 0 if exists
  if (currentRule.value) {
    const zeroGroup = currentRule.value.groups.find(g => g.id === 0)
    if (zeroGroup && currentRule.value.groups.filter(g => g.id !== 0).length === 0) {
      store.setSelectedGroup('0')
    } else {
      // Auto-select nếu chỉ có 1 group (không tính id = 0)
      const nonZeroGroups = currentRule.value.groups.filter(g => g.id !== 0)
      if (nonZeroGroups.length === 1) {
        store.setSelectedGroup(nonZeroGroups[0].id.toString())
      }
    }
  }
})

// Helper function to get step value by category code
function getStepValueByCategory(categoryCode: string): string | undefined {
  const step = stepsToRender.value.find(s => s.category_code === categoryCode)
  if (step) {
    return stepValues.value[step.step_id] || undefined
  }
  return undefined
}

// Validate form
function validateForm(): boolean {
  store.clearAllErrors()
  
  if (!formData.value.accountName.trim()) {
    store.setError('accountName', 'Account name is required')
  }
  
  if (!formData.value.accountNo.trim()) {
    store.setError('accountNo', 'Account No. is required')
  } else if (accountNoValidation.value.exists === true) {
    store.setError('accountNo', 'This account no. already exists!')
  }
  
  if (!formData.value.accountStatus) {
    store.setError('accountStatus', 'Account Status is required')
  }
  
  if (!selectedType.value) {
    store.setError('type', 'Type is required')
  }
  
  // Validate group chỉ nếu có groups với id != 0
  if (shouldShowGroupSelector.value && !selectedGroup.value) {
    store.setError('group', 'Group is required')
  }
  
  // Validate group value nếu group có input_type là TEXT
  if (currentGroup.value && currentGroup.value.input_type === 'TEXT' && !groupValue.value?.trim()) {
    store.setError('groupValue', 'Group value is required')
  }
  
  // Validate all steps
  for (const step of stepsToRender.value) {
    if (!stepValues.value[step.step_id]) {
      store.setError(`step_${step.step_id}`, `${step.label || 'This field'} is required`)
    }
  }
  
  // Validate currency is required (must be in steps)
  const currencyStep = stepsToRender.value.find(s => s.category_code === 'CURRENCY')
  if (currencyStep && !stepValues.value[currencyStep.step_id]) {
    store.setError('currency', 'Currency is required')
  }
  
  return Object.keys(errors.value).length === 0
}

// Computed to check if form is valid
const isFormValid = computed(() => {
  // If editing from COA Account, check Name, AccountNo, Status
  if (props.editFromAccount) {
    if (!formData.value.accountName.trim()) return false
    if (!formData.value.accountNo.trim()) return false
    if (!formData.value.accountStatus) return false
    // Check if account_no is being validated
    if (accountNoValidation.value.isChecking) return false
    // Check if there are any errors
    if (errors.value.accountName || errors.value.accountNo || errors.value.accountStatus) {
      return false
    }
    return true
  }
  
  // Original validation for CREATE or EDIT from Request
  // Check basic required fields
  if (!formData.value.accountName.trim()) return false
  if (!formData.value.accountNo.trim()) return false
  if (!formData.value.accountStatus) return false
  if (!selectedType.value) return false
  
  // Check account_no validation (must not exist for CREATE mode)
  if (store.mode === 'CREATE' && accountNoValidation.value.exists === true) {
    return false
  }
  
  // Check if account_no is being validated
  if (accountNoValidation.value.isChecking) return false
  
  // Check group
  if (shouldShowGroupSelector.value && !selectedGroup.value) return false
  
  // Check group value for TEXT input_type
  if (currentGroup.value && currentGroup.value.input_type === 'TEXT' && !groupValue.value?.trim()) {
    return false
  }
  
  // Check all steps
  for (const step of stepsToRender.value) {
    if (!stepValues.value[step.step_id]) {
      return false
    }
  }
  
  // Check currency is required
  const currencyStep = stepsToRender.value.find(s => s.category_code === 'CURRENCY')
  if (currencyStep && !stepValues.value[currencyStep.step_id]) {
    return false
  }
  
  // Check if there are any errors
  if (Object.keys(errors.value).length > 0) {
    return false
  }
  
  return true
})

// Submit form
async function handleSubmit() {
  // If editing from COA Account, validate Name, AccountNo, Status
  if (props.editFromAccount) {
    if (!formData.value.accountName.trim()) {
      store.setError('accountName', 'Account name is required')
      showToast(ToastType.FAILED,'Please fill in all required fields')
      return
    }
    if (!formData.value.accountNo.trim()) {
      store.setError('accountNo', 'Account No. is required')
      showToast(ToastType.FAILED,'Please fill in all required fields')
      return
    }
    if (!formData.value.accountStatus) {
      store.setError('accountStatus', 'Account Status is required')
      showToast(ToastType.FAILED,'Please fill in all required fields' )
      return
    }
    
    // Check account_no one more time (skip if same as original)
    const accountNoChanged = store.originalAccountNo && formData.value.accountNo.trim() !== store.originalAccountNo.trim()
    if (accountNoChanged) {
      const checkResult = await store.checkAccountNoExist(formData.value.accountNo.trim(), false)
      if (checkResult.success && checkResult.exists) {
        store.setError('accountNo', 'This account no. already exists!')
        showToast(ToastType.FAILED,'This account number already exists')
        return
      }
    }
    
    try {
      if (!props.accountId) {
        showToast(ToastType.FAILED,'Account ID is required')
        return
      }
      
      const payload: IEditRequestCoaAccountPayload = {
        request_type: 'EDIT',
        account_data: {
          account_id: props.accountId,
          account_no: formData.value.accountNo.trim(),
          status: formData.value.accountStatus,
          name: formData.value.accountName.trim(),
          description: formData.value.description?.trim() || null,
        }
      }
      
      const response = await store.createEditRequestFromAccount(payload)
      
      if (response.success) {
        showToast(ToastType.SUCCESS,'Edit request created successfully')
        emit('success')
        handleClose()
      } else {
        showToast(ToastType.FAILED, response.error || 'Failed to create edit request')
      }
    } catch (error: any) {
      console.error('Error creating edit request:', error)
      showToast(ToastType.FAILED,error.message || 'Failed to create edit request')
    }
    return
  }
  
  // Original logic for CREATE or EDIT from Request
  if (!validateForm()) {
    showToast(ToastType.FAILED,'Please fill in all required fields')
    return
  }
  
  // Check account_no one more time before submit (only for CREATE mode)
  // For EDIT mode, skip validation if account_no hasn't changed
  if (store.mode === 'CREATE' && formData.value.accountNo.trim()) {
    const checkResult = await store.checkAccountNoExist(formData.value.accountNo.trim())
    if (checkResult.success && checkResult.exists) {
      store.setError('accountNo', 'This account no. already exists!')
      showToast(ToastType.FAILED,'This account number already exists', )
      return
    }
  }
  
  try {
    // Get currency (required)
    const currency = getStepValueByCategory('CURRENCY')
    if (!currency) {
      showToast(ToastType.FAILED, 'Currency is required')
      return
    }
    
    // Get optional fields
    const provider = getStepValueByCategory('PROVIDER')
    const network = getStepValueByCategory('NETWORK')
    
    // Validate type is one of allowed values
    const validTypes: Array<'ASSET' | 'LIAB' | 'EQUITY' | 'REV' | 'EXP'> = ['ASSET', 'LIAB', 'EQUITY', 'REV', 'EXP']
    if (!validTypes.includes(selectedType.value as any)) {
      showToast(ToastType.FAILED,'Invalid account type')
      return
    }
    
    // Use originalRequestType if available (from request item), otherwise use mode
    const requestType = store.originalRequestType || (store.mode === 'EDIT' ? 'EDIT' : 'CREATE')
    
    const payload: ICreateRequestCoaAccountPayload = {
      request_type: requestType,
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
    
    let response
    if (store.mode === 'EDIT' && store.requestId) {
      response = await store.updateAccountRequest(store.requestId, payload)
    } else {
      response = await store.createAccountRequest(payload)
    }
    
    if (response.success) {
      showToast(ToastType.SUCCESS, response.data)
      emit('success')
      handleClose()
    } else {
      showToast(ToastType.FAILED,response.error || `Failed to ${store.mode === 'EDIT' ? 'update' : 'create'} account request`)
    }
  } catch (error: any) {
    console.error(`Error ${store.mode === 'EDIT' ? 'updating' : 'creating'} account request:`, error)
    showToast(ToastType.FAILED,error.message || `Failed to ${store.mode === 'EDIT' ? 'update' : 'create'} account request`)
  }
}

function handleClose() {
  emit('update:open', false)
  store.resetForm()
}

function openViewRulesModal() {
  store.openViewRulesModal()
}

// File input ref
const fileInputRef = ref<HTMLInputElement | null>(null)

// Trigger file input
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// Handle file select
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    validateAndSetFile(target.files[0])
  }
}

// Handle file drop
const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    validateAndSetFile(event.dataTransfer.files[0])
  }
}

// Validate and set file
const validateAndSetFile = (file: File) => {
  importError.value = null
  
  // Check file type
  const allowedExtensions = ['.xlsx', '.xls', '.csv']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedExtensions.includes(fileExtension)) {
    importError.value = 'Invalid file type. Please upload .XLSX, .XLS, or .CSV file.'
    selectedFile.value = null
    return
  }
  
  // Check file size (200MB = 200 * 1024 * 1024 bytes)
  const maxSize = 200 * 1024 * 1024
  if (file.size > maxSize) {
    importError.value = 'File size exceeds 200MB limit.'
    selectedFile.value = null
    return
  }
  
  selectedFile.value = file
}

// Handle import submit
const handleImportSubmit = async () => {
  if (!selectedFile.value) return
  
  isImporting.value = true
  importError.value = null
  
  try {
    const response = await requestCoaAccountService.importCoaAccounts(selectedFile.value)
    
    if (response.success) {
      showToast(ToastType.SUCCESS, response.message)
      emit('success')
      handleClose()
    } else {
      importError.value = response.message || (response as any).error || 'Failed to import file.'
      showToast(ToastType.FAILED, importError.value)
    }
  } catch (error: any) {
    importError.value = error.message || 'Failed to import file.'
    showToast(ToastType.FAILED, importError.value)
  } finally {
    isImporting.value = false
  }
}

// Reset file when modal closes or tab changes
watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    selectedFile.value = null
    importError.value = null
    isDragging.value = false
  }
})

watch(() => activeTab.value, () => {
  if (activeTab.value !== 'import') {
    selectedFile.value = null
    importError.value = null
    isDragging.value = false
  }
})

// Function to handle form population
async function populateForm() {
  console.log('populateForm called', {
    editFromAccount: props.editFromAccount,
    accountId: props.accountId,
    mode: props.mode,
    requestId: props.requestId
  })
  
  // Reset form first
  store.resetForm()
  
  // Set mode
  store.setMode(props.mode, props.requestId, props.accountId)
  
  // Wait a bit for reset to complete
  await nextTick()
  
  // If editing from COA Account, fetch account detail
  if (props.editFromAccount && props.accountId) {
    console.log('Fetching account detail for ID:', props.accountId, 'Type:', typeof props.accountId)
    try {
      const result = await store.fetchAndPopulateAccountDetail(props.accountId)
      console.log('Fetch result:', result)
      console.log('Store formData after fetch:', JSON.stringify(store.formData))
      
      if (!result.success) {
        showToast(ToastType.FAILED,result.error || 'Failed to load account detail')
      } else {
        // Force reactive update
        await nextTick()
        console.log('Form data in component:', JSON.stringify(formData.value))
      }
    } catch (error) {
      console.error('Error in populateForm:', error)
      showToast(ToastType.FAILED,'Failed to load account detail')
    }
    // Don't fetch rules for edit from account
    return
  }
  
  // Fetch COA rules if not loaded (only for CREATE or EDIT from Request)
  if (store.coaRules.length === 0) {
    await store.fetchCoaRules()
  }
  
  // If EDIT mode and has requestId, fetch and populate
  if (props.mode === 'EDIT' && props.requestId) {
    await store.fetchAndPopulateRequestDetail(props.requestId)
  }
}

// Watch for open prop to handle EDIT mode
watch(() => props.open, async (isOpen, oldIsOpen) => {
  console.log('=== Modal open watch ===')
  console.log('isOpen:', isOpen, 'oldIsOpen:', oldIsOpen)
  console.log('props.editFromAccount:', props.editFromAccount)
  console.log('props.accountId:', props.accountId, 'type:', typeof props.accountId)
  console.log('props.mode:', props.mode)
  
  if (isOpen && !oldIsOpen) {
    // Wait a bit for Dialog to fully open
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))
    console.log('Calling populateForm...')
    await populateForm()
  } else if (!isOpen) {
    // Reset form when closing
    store.resetForm()
  }
}, { immediate: false })

// Watch for accountId and editFromAccount changes (when modal is already open)
watch([() => props.accountId, () => props.editFromAccount], async ([accountId, editFromAccount], [oldAccountId, oldEditFromAccount]) => {
  console.log('=== Props changed watch ===')
  console.log('accountId:', accountId, 'oldAccountId:', oldAccountId)
  console.log('editFromAccount:', editFromAccount, 'oldEditFromAccount:', oldEditFromAccount)
  console.log('props.open:', props.open)
  
  if (props.open && editFromAccount && accountId && (accountId !== oldAccountId || editFromAccount !== oldEditFromAccount)) {
    console.log('Props changed, calling populateForm...')
    await populateForm()
  }
}, { immediate: true })

// Watch store.formData to debug
watch(() => store.formData, (newData, oldData) => {
  console.log('=== Store formData changed ===')
  console.log('Old:', JSON.stringify(oldData))
  console.log('New:', JSON.stringify(newData))
}, { deep: true, immediate: true })

onMounted(async () => {
  if (store.coaRules.length === 0) {
    await store.fetchCoaRules()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogContent class="w-full max-w-[712px] overflow-y-auto max-h-[90vh]" :showCloseButton="false">
      <DialogHeader>
        <div class="flex items-center justify-between w-full">
          <DialogTitle class="font-heading-m-20-medium font-[number:var(--heading-m-20-medium-font-weight)] text-black text-[length:var(--heading-m-20-medium-font-size)] tracking-[var(--heading-m-20-medium-letter-spacing)] leading-[var(--heading-m-20-medium-line-height)] [font-style:var(--heading-m-20-medium-font-style)]">
            {{ store.mode === 'EDIT' ? 'Edit account' : 'Create account' }}
          </DialogTitle>
          
          <div class="inline-flex items-center justify-end gap-2">
            <Button variant="ghost" class="h-auto px-3 py-2 rounded-md" @click="openViewRulesModal">
              <span class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#07564d] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                View Account Code Rules
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              class="w-8 h-8 bg-[#0000000d] rounded-md hover:bg-[#0000001a]"
              @click="handleClose"
            >
              <X class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogHeader>

      <Tabs v-model="activeTab" default-value="manually" class="w-full mt-0">
        <TabsList class="w-full h-auto p-0 bg-transparent rounded-none border-b border-[#dcdcdc]">
          <TabsTrigger
            value="manually"
            class="flex-1 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-[#84b098] data-[state=active]:bg-transparent bg-transparent px-7 py-0"
          >
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black text-[#00000080]">
              Manually create
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="import"
            class="flex-1 h-9 rounded-none border-b-2 border-transparent data-[state=active]:border-[#84b098] data-[state=active]:bg-transparent bg-transparent px-7 py-0"
          >
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black text-[#00000080]">
              Import file
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manually" class="mt-0">
          <div class="flex flex-col items-start justify-center gap-5 pt-5 pb-2.5 px-5">
            <!-- Edit from COA Account: Name, AccountNo, Status, Description -->
            <template v-if="editFromAccount">
              <!-- Account Name -->
              <div class="flex items-start gap-3 w-full">
                <div class="flex flex-col items-start gap-1 flex-1">
                  <div class="flex flex-col items-start gap-1 w-full">
                    <div class="inline-flex items-center justify-center gap-0.5">
                      <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                        Account name
                      </Label>
                      <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                        *
                      </span>
                    </div>
                    <Input
                      :model-value="formData.accountName"
                      @update:model-value="(value) => store.setFormData({ accountName: value })"
                      placeholder="Enter account name"
                      :class="`h-10 px-2.5 py-0 w-full rounded-[10px] border ${
                        errors.accountName ? 'border-[#fac5c3]' : 'border-[#0000001a]'
                      } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] text-[#00000080]`"
                    />
                    <span v-if="errors.accountName" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      {{ errors.accountName }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 w-full">
                <!-- Account No. -->
                <div class="flex flex-col items-start gap-1 flex-1">
                  <div class="flex flex-col items-start gap-1 w-full">
                    <div class="inline-flex items-center justify-center gap-0.5">
                      <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                        Account No.
                      </Label>
                      <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                        *
                      </span>
                    </div>
                    <Input
                      :model-value="formData.accountNo"
                      @update:model-value="(value) => store.setFormData({ accountNo: value })"
                      placeholder="Enter account No."
                      :class="`h-10 px-2.5 py-0 w-full rounded-[10px] border ${
                        errors.accountNo ? 'border-[#fac5c3]' : 'border-[#0000001a]'
                      } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] text-[#00000080]`"
                    />
                    <span v-if="errors.accountNo" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      {{ errors.accountNo }}
                    </span>
                  </div>
                </div>

                <!-- Account Status -->
                <div class="flex flex-col items-start gap-1 flex-1">
                  <div class="flex flex-col items-start gap-1 w-full">
                    <div class="inline-flex items-center justify-center gap-0.5">
                      <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                        Account Status
                      </Label>
                      <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                        *
                      </span>
                    </div>
                    <Select :model-value="formData.accountStatus" @update:model-value="(value) => store.setFormData({ accountStatus: value })">
                      <SelectTrigger class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d]">
                        <SelectValue
                          placeholder="Select status"
                          class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <span v-if="errors.accountStatus" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      {{ errors.accountStatus }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="h-[100px] w-full flex flex-col items-start gap-1">
                <div class="flex-1 flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      Description
                    </Label>
                  </div>
                  <Textarea
                    :model-value="formData.description"
                    @update:model-value="(value) => store.setFormData({ description: value })"
                    placeholder="Enter description"
                    class="flex-1 w-full p-2.5 rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] resize-none"
                  />
                </div>
              </div>
            </template>

            <!-- CREATE or EDIT from Request: Full form -->
            <template v-else>
            <!-- Basic Fields Row -->
            <div class="flex items-start gap-3 w-full">
              <!-- Account name -->
              <div class="flex flex-col items-start gap-1 flex-1">
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      Account name
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>
                  <Input
                    :model-value="formData.accountName"
                    @update:model-value="(value) => store.setFormData({ accountName: value })"
                    placeholder="Enter account name"
                    :class="`h-10 px-2.5 py-0 w-full rounded-[10px] border ${
                      errors.accountName ? 'border-[#fac5c3]' : 'border-[#0000001a]'
                    } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] text-[#00000080]`"
                  />
                  <span v-if="errors.accountName" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors.accountName }}
                  </span>
                </div>
              </div>

              <!-- Account No. -->
              <div class="flex flex-col items-start gap-1 flex-1">
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      Account No.
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>
                  <div class="relative w-full">
                    <Input
                      :model-value="formData.accountNo"
                      @update:model-value="(value) => store.setFormData({ accountNo: value })"
                      placeholder="Enter account No."
                      :class="`h-10 px-2.5 py-0 w-full rounded-[10px] border ${
                        errors.accountNo ? 'border-[#fac5c3]' : 'border-[#0000001a]'
                      } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] text-[#00000080]`"
                    />
                    <span v-if="accountNoValidation.isChecking" class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Checking...
                    </span>
                  </div>
                  <span v-if="errors.accountNo" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors.accountNo }}
                  </span>
                </div>
              </div>

              <!-- Account Status -->
              <div class="flex flex-col items-start gap-1 flex-1">
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      Account Status
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>
                  <Select :model-value="formData.accountStatus" @update:model-value="(value) => store.setFormData({ accountStatus: value })">
                    <SelectTrigger class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d]">
                      <SelectValue
                        placeholder="Select status"
                        class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <span v-if="errors.accountStatus" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors.accountStatus }}
                  </span>
                </div>
              </div>
            </div>

            <Separator class="w-full h-px bg-[#dcdcdc]" />

            <!-- Type and Group Row -->
            <div class="flex items-center gap-3 w-full">
              <!-- Type (Layer 1) -->
              <div class="flex flex-col items-start gap-1 flex-1">
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      <span class="text-black">Type </span>
                      <span class="text-[#00000080]">(Layer 1)</span>
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>
                  <Select v-model="selectedType">
                    <SelectTrigger class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d]">
                      <SelectValue
                        placeholder="Select type"
                        class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="rule in coaRules"
                        :key="rule.id"
                        :value="rule.code"
                      >
                        {{ rule.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <span v-if="errors.type" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors.type }}
                  </span>
                </div>
              </div>

              <!-- Group (Layer 2) - chỉ hiển thị nếu có groups với id != 0 -->
              <div v-if="shouldShowGroupSelector" class="flex flex-col items-start gap-1 flex-1">
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      <span class="text-black">{{ currentGroup?.name || 'Group' }} </span>
                      <span class="text-[#00000080]">(Layer 2)</span>
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>
                  
                  <!-- Render Select nếu group có input_type là SELECT -->
                  <Select v-if="!isGroupTextInput" v-model="selectedGroup">
                    <SelectTrigger class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d]">
                      <SelectValue
                        placeholder="Select group"
                        class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="group in availableGroups"
                        :key="group.id"
                        :value="group.id.toString()"
                      >
                        {{ group.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <!-- Render Input nếu group có input_type là TEXT -->
                  <Input
                    v-else
                    v-model="groupValue"
                    :placeholder="`Enter ${currentGroup?.name?.toLowerCase() || 'group'}`"
                    :class="`h-10 px-2.5 py-0 w-full rounded-[10px] border ${
                      errors.groupValue ? 'border-[#fac5c3]' : 'border-[#0000001a]'
                    } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] text-[#00000080]`"
                  />
                  
                  <span v-if="errors.group || errors.groupValue" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors.group || errors.groupValue }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Dynamic Steps Row -->
            <div v-if="stepsToRender.length > 0" class="flex items-center gap-3 w-full flex-wrap">
              <div
                v-for="(step, index) in stepsToRender"
                :key="step.step_id"
                :class="step.type === 'TEXT' ? 'flex-1' : 'flex-1'"
                class="flex flex-col items-start gap-1"
              >
                <div class="flex flex-col items-start gap-1 w-full">
                  <div class="inline-flex items-center justify-center gap-0.5">
                    <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                      <span class="text-black">{{ step.label || `Layer ${index + 3}` }} </span>
                      <span v-if="step.label" class="text-[#00000080]">(layer {{ index + 3 }})</span>
                    </Label>
                    <span class="font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[#ee443f] text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]">
                      *
                    </span>
                  </div>

                  <!-- SELECT type -->
                  <Select v-if="step.type === 'SELECT'" :model-value="stepValues[step.step_id]" @update:model-value="(value) => store.setStepValue(step.step_id, value)">
                    <SelectTrigger class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d]">
                      <SelectValue
                        :placeholder="step.label || 'Select option'"
                        class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="value in step.values || []"
                        :key="value.id"
                        :value="value.value"
                      >
                        {{ value.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <!-- TEXT type -->
                  <Input
                    v-else
                    :model-value="stepValues[step.step_id]"
                    @update:model-value="(value) => store.setStepValue(step.step_id, value)"
                    :placeholder="step.label || 'Enter details'"
                    class="h-10 px-2.5 py-0 w-full rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]"
                  />

                  <span v-if="errors[`step_${step.step_id}`]" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    {{ errors[`step_${step.step_id}`] }}
                  </span>
                </div>
              </div>
            </div>

            <Separator class="w-full h-px bg-[#dcdcdc]" />

            <!-- Description -->
            <div class="h-[100px] w-full flex flex-col items-start gap-1">
              <div class="flex-1 flex flex-col items-start gap-1 w-full">
                <div class="inline-flex items-center justify-center gap-0.5">
                  <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                    Description
                  </Label>
                </div>
                <Textarea
                  :model-value="formData.description"
                  @update:model-value="(value) => store.setFormData({ description: value })"
                  placeholder="Enter description"
                  class="flex-1 w-full p-2.5 rounded-[10px] border border-[#0000001a] bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] resize-none"
                />
              </div>
            </div>
            </template>
          </div>

          <footer class="flex items-center justify-end gap-2 pt-4 pb-5 px-5">
            <div v-if="!editFromAccount" class="flex flex-col items-start gap-0.5 flex-1">
              <div class="flex flex-col items-start gap-0.5 w-full">
                <span class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#07564d] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
                  Generated Account Code
                </span>
                <span class="font-semibold text-black text-sm tracking-[-0.17px] leading-5 [font-family:'Space_Grotesk',Helvetica]">
                  {{ generatedAccountCode }}
                </span>
              </div>
            </div>
            <div v-else class="flex-1"></div>
            <Button
              class="w-[164px] h-auto px-3 py-2.5 bg-[#07564d] hover:bg-[#07564d]/90 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isFormValid || store.isLoading.creatingRequest || store.isLoading.updatingRequest || store.isLoading.fetchingDetail || accountNoValidation.isChecking"
              @click="handleSubmit"
            >
              <span class="font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-white text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]">
                {{ (store.isLoading.creatingRequest || store.isLoading.updatingRequest) ? 'Submitting...' : (store.mode === 'EDIT' ? 'Update' : 'Submit') }}
              </span>
            </Button>
          </footer>
        </TabsContent>

        <TabsContent value="import" class="mt-0">
          <div class="flex flex-col items-start justify-center gap-3 pt-5 pb-2.5 px-5">
            <p class="[font-family:'Inter',Helvetica] font-normal text-sm">
              <span class="font-medium text-[#00000080] tracking-[-0.03px] leading-5">
                Download template{" "}
              </span>
              <a 
                href="#" 
                class="font-semibold text-[#07564d] tracking-[-0.03px] leading-5 hover:underline transition-all"
                @click.prevent
              >
                here
              </a>
            </p>
            
            <!-- Drag and Drop Area -->
            <div
              :class="[
                'w-full h-[150px] rounded-md border border-dashed flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer',
                isDragging ? 'border-[#07564d] bg-[#07564d]/5' : 'border-[#0000001a] hover:border-[#00000033]',
                importError ? 'border-[#ee443f]' : ''
              ]"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
            >
              <div class="w-[60px] h-[60px] flex items-center justify-center">
                <div class="w-[41.82px] h-[52.68px] relative">
                  <!-- Document icon SVG -->
                  <svg class="absolute w-[83.90%] h-[91.95%] top-0 left-0" viewBox="0 0 100 100" fill="none">
                    <path d="M20 10 L80 10 L80 90 L20 90 Z" stroke="#00000080" stroke-width="2" fill="white"/>
                  </svg>
                  <svg class="absolute w-[41.47%] h-[29.14%] top-[45.78%] left-[21.22%]" viewBox="0 0 100 100" fill="none">
                    <line x1="10" y1="20" x2="90" y2="20" stroke="#00000080" stroke-width="2"/>
                    <line x1="10" y1="50" x2="90" y2="50" stroke="#00000080" stroke-width="2"/>
                    <line x1="10" y1="80" x2="90" y2="80" stroke="#00000080" stroke-width="2"/>
                  </svg>
                  <div class="absolute w-[44.04%] h-[34.96%] top-[65.04%] left-[55.96%] bg-[#84b098] rounded-[9.21px] flex items-center justify-center">
                    <svg class="w-[24.02%] h-[19.07%]" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <p v-if="!selectedFile" class="[font-family:'Inter',Helvetica] font-normal text-sm text-center">
                <span class="font-medium text-[#00000080] tracking-[-0.03px] leading-5">
                  Drag and drop files to upload or{" "}
                </span>
                <button class="font-semibold text-[#07564d] tracking-[-0.03px] leading-5 hover:underline transition-all">
                  Upload
                </button>
              </p>
              
              <p v-else class="[font-family:'Inter',Helvetica] font-normal text-sm text-center text-[#07564d]">
                {{ selectedFile.name }}
              </p>
              
              <span v-if="importError" class="font-body-12-s-medium text-[#ee443f] text-sm">
                {{ importError }}
              </span>
            </div>
            
            <!-- Hidden file input -->
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls,.csv"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>
          
          <footer class="flex items-center justify-end gap-2 pt-4 pb-5 px-5">
            <p class="flex-1 text-[#00000080] font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
              Note: The file format must be .XLSX, .XLS, .CSV and the size should not exceed 200MB.
            </p>
            <Button
              :disabled="!selectedFile || isImporting"
              class="h-auto w-[164px] px-3 py-2.5 rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] disabled:opacity-50 disabled:cursor-not-allowed"
              :class="selectedFile && !isImporting ? 'bg-[#07564d] hover:bg-[#07564d]/90 text-white' : 'bg-[#0000001a] text-[#0000004c] hover:bg-[#0000001a]'"
              @click="handleImportSubmit"
            >
              {{ isImporting ? 'Importing...' : 'Submit' }}
            </Button>
          </footer>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>

  <!-- View Rules Modal -->
  <EditAccountCodeRulesModal
    :open="store.isViewRulesModalOpen"
    @update:open="store.toggleViewRulesModal"
  />
</template>
