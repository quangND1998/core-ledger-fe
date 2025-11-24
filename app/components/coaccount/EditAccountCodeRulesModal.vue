<script setup lang="ts">
import { ref, watch } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet';
import { useRuleValueStore } from '~/stores/ruleValue';
import type { AccountCodeRules, IRuleValue } from '~/types/ruleValue';
import { RuleCategoryCode } from '~/types/ruleValue';
import RuleSection from './RuleSection.vue';

interface Props {
  open: boolean;
  mode?: 'create' | 'edit';
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'edit',
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  'save': [];
  'close': [];
}>();

const store = useRuleValueStore();

// Local state for form data - lưu IRuleValue objects để track id
const formData = ref<AccountCodeRules>({
  currencies: [],
  providers: [],
  bankNames: [],
  networks: [],
  kindsOfRevenue: [],
  kindsOfExpense: []
});

// Store original data từ API để so sánh khi save
const originalData = ref<AccountCodeRules>({
  currencies: [],
  providers: [],
  bankNames: [],
  networks: [],
  kindsOfRevenue: [],
  kindsOfExpense: []
});

// Input values for adding new items
const inputValues = ref({
  currencies: '',
  providers: '',
  bankNames: '',
  networks: '',
  kindsOfRevenue: '',
  kindsOfExpense: ''
});

// Input values for name (for complex sections)
const inputNameValues = ref({
  currencies: '',
  providers: '',
  bankNames: '',
  networks: '',
  kindsOfRevenue: '',
  kindsOfExpense: ''
});

// Error messages for each section (general errors)
const errors = ref({
  currencies: '',
  providers: '',
  bankNames: '',
  networks: '',
  kindsOfRevenue: '',
  kindsOfExpense: ''
});

// Error messages for each item (from API response)
const itemErrors = ref<Record<string, Record<number, string>>>({
  currencies: {},
  providers: {},
  bankNames: {},
  networks: {},
  kindsOfRevenue: {},
  kindsOfExpense: {}
});

// Track which items are being edited
const editingItems = ref<Record<string, Record<number, boolean>>>({
  currencies: {},
  providers: {},
  bankNames: {},
  networks: {},
  kindsOfRevenue: {},
  kindsOfExpense: {}
});

// Track saving state for each section
const savingStates = ref({
  currencies: false,
  providers: false,
  bankNames: false,
  networks: false,
  kindsOfRevenue: false,
  kindsOfExpense: false
});

// Collapsible states
const openSections = ref({
  currencies: true,
  providers: false,
  bankNames: false,
  networks: false,
  kindsOfRevenue: false,
  kindsOfExpense: false
});

// Load data từ API khi mở modal
watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    // Load data từ API
    await store.getRuleCategoryList();
    
    // Copy data từ store vào formData và originalData
    const storeData = store.accountCodeRules;
    formData.value = {
      currencies: storeData.currencies.map(rv => ({ ...rv })),
      providers: storeData.providers.map(rv => ({ ...rv })),
      bankNames: storeData.bankNames.map(rv => ({ ...rv })),
      networks: storeData.networks.map(rv => ({ ...rv })),
      kindsOfRevenue: storeData.kindsOfRevenue.map(rv => ({ ...rv })),
      kindsOfExpense: storeData.kindsOfExpense.map(rv => ({ ...rv }))
    };
    originalData.value = {
      currencies: storeData.currencies.map(rv => ({ ...rv })),
      providers: storeData.providers.map(rv => ({ ...rv })),
      bankNames: storeData.bankNames.map(rv => ({ ...rv })),
      networks: storeData.networks.map(rv => ({ ...rv })),
      kindsOfRevenue: storeData.kindsOfRevenue.map(rv => ({ ...rv })),
      kindsOfExpense: storeData.kindsOfExpense.map(rv => ({ ...rv }))
    };
    
    // Reset inputs, errors, and editing states
    Object.keys(inputValues.value).forEach(key => {
      inputValues.value[key as keyof typeof inputValues.value] = '';
      inputNameValues.value[key as keyof typeof inputNameValues.value] = '';
      errors.value[key as keyof typeof errors.value] = '';
      itemErrors.value[key as keyof typeof itemErrors.value] = {};
      editingItems.value[key as keyof typeof editingItems.value] = {};
    });
  }
});

// Helper để lấy category ID từ section key
const getCategoryIdBySection = (section: keyof AccountCodeRules): number | null => {
  const codeMap: Record<keyof AccountCodeRules, RuleCategoryCode> = {
    currencies: RuleCategoryCode.CURRENCY,
    providers: RuleCategoryCode.PROVIDER,
    bankNames: RuleCategoryCode.BANK_NAME,
    networks: RuleCategoryCode.NETWORK,
    kindsOfRevenue: RuleCategoryCode.KINDS_OF_REVENUE,
    kindsOfExpense: RuleCategoryCode.KINDS_OF_EXPENSE,
  };
  return store.getCategoryIdByCode(codeMap[section]);
};

// Check if section only needs value input (NETWORK and CURRENCY)
const isSimpleInputSection = (section: keyof AccountCodeRules): boolean => {
  return section === 'networks' || section === 'currencies';
};

const addItem = (section: keyof AccountCodeRules) => {
  const isSimple = isSimpleInputSection(section);
  const inputValue = inputValues.value[section].trim();
  const inputName = inputNameValues.value[section].trim();
  
  if (isSimple) {
    // NETWORK and CURRENCY: chỉ cần value, name = value
    if (!inputValue) {
      errors.value[section] = 'Please enter a value';
      return;
    }

    // Check for duplicates
    const existingItems = formData.value[section]
      .filter(item => !item.is_delete)
      .map(item => item.value.toUpperCase());
    if (existingItems.includes(inputValue.toUpperCase())) {
      errors.value[section] = `This ${getSectionLabel(section)} already exists!`;
      return;
    }

    // Tạo IRuleValue object mới
    const newRuleValue: IRuleValue = {
      name: inputValue,
      value: inputValue.toUpperCase(),
      is_delete: false,
      category_id: getCategoryIdBySection(section) || 0,
    };

    formData.value[section].push(newRuleValue);
    inputValues.value[section] = '';
    errors.value[section] = '';
  } else {
    // Các loại khác: cần cả name và value
    if (!inputName || !inputValue) {
      errors.value[section] = 'Please enter both name and value';
      return;
    }

    // Check for duplicates (check theo value)
    const existingItems = formData.value[section]
      .filter(item => !item.is_delete)
      .map(item => item.value.toUpperCase());
    if (existingItems.includes(inputValue.toUpperCase())) {
      errors.value[section] = `This value already exists!`;
      return;
    }

    // Tạo IRuleValue object mới
    const newRuleValue: IRuleValue = {
      name: inputName,
      value: inputValue.toUpperCase(),
      is_delete: false,
      category_id: getCategoryIdBySection(section) || 0,
    };

    formData.value[section].push(newRuleValue);
    inputValues.value[section] = '';
    inputNameValues.value[section] = '';
    errors.value[section] = '';
  }
};

const removeItem = (section: keyof AccountCodeRules, index: number) => {
  // Tìm item trong visibleItems (chưa bị xóa)
  const visibleItems = formData.value[section].filter(item => !item.is_delete);
  const item = visibleItems[index];
  
  if (item) {
    // Set is_delete = true thay vì xóa khỏi array
    item.is_delete = true;
    // Clear error for this item
    if (item.id) {
      delete itemErrors.value[section][item.id];
    }
  }
};

const startEdit = (section: keyof AccountCodeRules, index: number) => {
  // Tìm item trong visibleItems (chưa bị xóa)
  const visibleItems = formData.value[section].filter(item => !item.is_delete);
  const item = visibleItems[index];
  
  if (item?.id) {
    editingItems.value[section][item.id] = true;
    // Clear error when starting to edit
    delete itemErrors.value[section][item.id];
  }
};

const cancelEdit = (section: keyof AccountCodeRules, index: number) => {
  // Tìm item trong visibleItems (chưa bị xóa)
  const visibleItems = formData.value[section].filter(item => !item.is_delete);
  const item = visibleItems[index];
  
  if (item?.id) {
    editingItems.value[section][item.id] = false;
    // Restore original value
    const originalItem = originalData.value[section].find(orig => orig.id === item.id);
    if (originalItem) {
      // Tìm index thực tế trong formData
      const actualIndex = formData.value[section].findIndex(f => f.id === item.id);
      if (actualIndex >= 0) {
        formData.value[section][actualIndex] = { ...originalItem };
      }
    }
  }
};

const saveItemEdit = (section: keyof AccountCodeRules, index: number) => {
  // Tìm item trong visibleItems (chưa bị xóa)
  const visibleItems = formData.value[section].filter(item => !item.is_delete);
  const item = visibleItems[index];
  
  if (item) {
    const isSimple = isSimpleInputSection(section);
    
    if (isSimple) {
      // NETWORK and CURRENCY: name = value
      // User edit value, sau đó set name = value
      const newValue = item.value.toUpperCase();
      item.value = newValue;
      item.name = newValue; // Đảm bảo name = value
    } else {
      // Các loại khác: giữ nguyên name, value uppercase
      item.value = (item.value || item.name).toUpperCase();
    }
    
    if (item.id) {
      editingItems.value[section][item.id] = false;
    }
  }
};

const getSectionLabel = (section: keyof AccountCodeRules): string => {
  const labels: Record<keyof AccountCodeRules, string> = {
    currencies: 'Currency',
    providers: 'Provider',
    bankNames: 'Bank Name',
    networks: 'Network',
    kindsOfRevenue: 'Kind of Revenue',
    kindsOfExpense: 'Kind of Expense'
  };
  return labels[section];
};

// Save từng section một
const handleSaveSection = async (section: keyof AccountCodeRules) => {
  const categoryId = getCategoryIdBySection(section);
  if (!categoryId) return;

  savingStates.value[section] = true;
  errors.value[section] = '';
  itemErrors.value[section] = {};

  const currentItems = formData.value[section];
  const originalItems = originalData.value[section];
  const isSimple = isSimpleInputSection(section);

  // Với simple input, sync name = value cho TẤT CẢ items trước khi save
  // (bao gồm cả items đang edit và items mới)
  if (isSimple) {
    const visibleItems = currentItems.filter(item => !item.is_delete);
    visibleItems.forEach((item) => {
      // Luôn đảm bảo name = value cho simple input
      const newValue = (item.value || item.name || '').toUpperCase();
      item.value = newValue;
      item.name = newValue;
      
      // Nếu item đang được edit, tắt editing state
      if (item.id && editingItems.value[section][item.id]) {
        editingItems.value[section][item.id] = false;
      }
    });
  }

  // Tạo payload: merge items hiện tại và items bị xóa
  const payloadItems: IRuleValue[] = [];
  // Map để track index trong payload -> index trong formData
  const payloadToFormIndexMap: number[] = [];

  // Thêm items hiện tại (chưa bị xóa) - có id = update, không có id = create mới
  const visibleItems = currentItems.filter(item => !item.is_delete);
  visibleItems.forEach((item, visibleIndex) => {
    payloadItems.push({
      ...(item.id && { id: item.id }), // Chỉ thêm id nếu có (update)
      name: item.name,
      value: item.value,
      is_delete: false,
      category_id: categoryId,
    });
    // Map index trong visibleItems sang index trong formData
    const actualIndex = currentItems.findIndex(f => f === item);
    payloadToFormIndexMap.push(actualIndex);
  });

  // Thêm items bị xóa (có trong original nhưng is_delete = true trong current)
  currentItems.forEach(item => {
    if (item.is_delete && item.id) {
      payloadItems.push({
        id: item.id,
        name: item.name,
        value: item.value,
        is_delete: true,
        category_id: categoryId,
      });
      payloadToFormIndexMap.push(-1); // -1 means deleted item
    }
  });

  // Chỉ gọi API nếu có thay đổi
  if (payloadItems.length > 0) {
    try {
      const result = await store.saveRuleValues(categoryId, payloadItems);
      if (result && (result.success || (result as any).status === true)) {
        // Reload data
        await store.getRuleCategoryList();
        const storeData = store.accountCodeRules;
        formData.value[section] = storeData[section].map(rv => ({ ...rv }));
        originalData.value[section] = storeData[section].map(rv => ({ ...rv }));
        // Clear editing states and errors
        editingItems.value[section] = {};
        itemErrors.value[section] = {};
        errors.value[section] = '';
      } else if (result && result.errors) {
        // Handle errors from API
        handleApiErrors(result.errors, section, payloadToFormIndexMap);
      }
    } catch (error) {
      console.error('Error saving section:', error);
    }
  }

  savingStates.value[section] = false;
};

// Handle API errors
const handleApiErrors = (
  apiErrors: Record<string, string>, 
  section: keyof AccountCodeRules,
  payloadToFormIndexMap: number[]
) => {
  // Clear previous errors
  itemErrors.value[section] = {};
  errors.value[section] = '';

  // Parse errors from API response
  // Format: { "data.0.value": "Value already exists", "data.1.value": "Value already exists" }
  Object.keys(apiErrors).forEach((key) => {
    const match = key.match(/data\.(\d+)\.value/);
    if (match) {
      const payloadIndex = parseInt(match[1]);
      const formIndex = payloadToFormIndexMap[payloadIndex];
      
      if (formIndex >= 0) {
        // Item exists in formData
        const item = formData.value[section][formIndex];
        if (item) {
          if (item.id) {
            // Existing item with id
            itemErrors.value[section][item.id] = apiErrors[key];
          } else {
            // New item without id - use temporary key
            const tempKey = `new_${formIndex}`;
            itemErrors.value[section][tempKey as any] = apiErrors[key];
          }
        }
      } else {
        // Deleted item - show in general error
        errors.value[section] = apiErrors[key] || errors.value[section];
      }
    }
  });
};

// Reset section to original data
const resetSection = (section: keyof AccountCodeRules) => {
  formData.value[section] = originalData.value[section].map(rv => ({ ...rv }));
  inputValues.value[section] = '';
  inputNameValues.value[section] = '';
  errors.value[section] = '';
  itemErrors.value[section] = {};
  editingItems.value[section] = {};
};

const handleClose = () => {
  emit('update:open', false);
  emit('close');
};

// Section configuration
const sections = [
  { key: 'currencies' as const, label: 'Currencies', placeholder: 'Enter currency', isSimple: true },
  { key: 'providers' as const, label: 'Providers', placeholder: 'Enter provider', isSimple: false },
  { key: 'bankNames' as const, label: 'Bank Names', placeholder: 'Enter bank name', isSimple: false },
  { key: 'networks' as const, label: 'Networks', placeholder: 'Enter network', isSimple: true },
  { key: 'kindsOfRevenue' as const, label: 'Kinds of Revenue', placeholder: 'Enter kind of revenue', isSimple: false },
  { key: 'kindsOfExpense' as const, label: 'Kinds of Expense', placeholder: 'Enter kind of expense', isSimple: false },
];
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent 
      side="right" 
      class="w-full sm:max-w-[600px] p-0 flex flex-col"
    >
      <!-- Header -->
      <SheetHeader class="px-6 py-4 border-b border-[#dcdcdc]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="handleClose"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </button>
            <SheetTitle class="text-xl font-semibold">
              Edit account code rules
            </SheetTitle>
          </div>
        </div>
      </SheetHeader>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 py-4">
        <RuleSection
          v-for="section in sections"
          :key="section.key"
          :section-key="section.key"
          :section-label="section.label"
          :placeholder="section.placeholder"
          :is-simple-input="section.isSimple"
          :items="formData[section.key]"
          v-model:is-open="openSections[section.key]"
          v-model:input-value="inputValues[section.key]"
          v-model:input-name-value="inputNameValues[section.key]"
          :error="errors[section.key]"
          :item-errors="itemErrors[section.key]"
          :editing-items="editingItems[section.key]"
          :is-saving="savingStates[section.key]"
          @add-item="addItem(section.key)"
          @edit-item="startEdit(section.key, $event)"
          @save-item="saveItemEdit(section.key, $event)"
          @cancel-edit="cancelEdit(section.key, $event)"
          @remove-item="removeItem(section.key, $event)"
          @save-section="handleSaveSection(section.key)"
          @reset-section="resetSection(section.key)"
        />
      </div>
    </SheetContent>
  </Sheet>
</template>

