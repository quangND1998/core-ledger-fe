<script setup lang="ts">
import { X, Search, Check, ChevronDown } from "lucide-vue-next";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useCoaAccountMapping } from '~/composables/common';
import { onClickOutside } from '@vueuse/core';
import { useCoaAccountStore } from '~/stores/coaAccount';
import { useRuleCategoryStore } from "~/stores/ruleCategory";

interface Props {
  open: boolean;
}

const props = defineProps<Props>();
const storeRuleCategory = useRuleCategoryStore()
const emit = defineEmits<{
  'update:open': [value: boolean];
  'export': [data: { fields: string[]; filters: any }];
}>();

const { getAllTypeConfigs, getAllStatusConfigs } = useCoaAccountMapping();
const store = useCoaAccountStore();

// Load rule categories on mount
onMounted(async () => {
  await storeRuleCategory.getRuleCategories();
});

// Export fields selection
const exportFields = [
  { value: 'index', label: 'Index' },
  { value: 'code', label: 'Code' },
  { value: 'name', label: 'Account Name' },
  { value: 'type', label: 'Type' },
  { value: 'currency', label: 'Currency' },
  { value: 'provider', label: 'Provider' },
  { value: 'network', label: 'Network' },
  { value: 'status', label: 'Status' },
];

const selectedExportFields = ref<string[]>(['index', 'code', 'name', 'type', 'currency', 'provider', 'network', 'status']);

const toggleExportField = (field: string) => {
  const index = selectedExportFields.value.indexOf(field);
  if (index > -1) {
    selectedExportFields.value.splice(index, 1);
  } else {
    selectedExportFields.value.push(field);
  }
};

// Filter states - sync từ store để giữ state khi chuyển tab
const selectedTypes = ref<string[]>([...store.filterState.selectedTypes]);
const showTypeDropdown = ref(false);
const typeSearchValue = ref('');

const selectedStatuses = ref<string[]>([...store.filterState.selectedStatuses]);
const showStatusDropdown = ref(false);
const statusSearchValue = ref('');

const selectedCurrencies = ref<string[]>([...store.filterState.selectedCurrencies]);
const showCurrencyDropdown = ref(false);
const currencySearchValue = ref('');

const selectedProviders = ref<string[]>([...store.filterState.selectedProviders]);
const showProviderDropdown = ref(false);
const providerSearchValue = ref('');

const selectedNetworks = ref<string[]>([...store.filterState.selectedNetworks]);
const showNetworkDropdown = ref(false);
const networkSearchValue = ref('');

// Sync từ store khi component mount hoặc store thay đổi
watch(() => store.filterState.selectedTypes, (newTypes) => {
  if (JSON.stringify(newTypes) !== JSON.stringify(selectedTypes.value)) {
    selectedTypes.value = [...newTypes];
  }
}, { immediate: true, deep: true });

watch(() => store.filterState.selectedStatuses, (newStatuses) => {
  if (JSON.stringify(newStatuses) !== JSON.stringify(selectedStatuses.value)) {
    selectedStatuses.value = [...newStatuses];
  }
}, { immediate: true, deep: true });

watch(() => store.filterState.selectedCurrencies, (newCurrencies) => {
  if (JSON.stringify(newCurrencies) !== JSON.stringify(selectedCurrencies.value)) {
    selectedCurrencies.value = [...newCurrencies];
  }
}, { immediate: true, deep: true });

watch(() => store.filterState.selectedProviders, (newProviders) => {
  if (JSON.stringify(newProviders) !== JSON.stringify(selectedProviders.value)) {
    selectedProviders.value = [...newProviders];
  }
}, { immediate: true, deep: true });

watch(() => store.filterState.selectedNetworks, (newNetworks) => {
  if (JSON.stringify(newNetworks) !== JSON.stringify(selectedNetworks.value)) {
    selectedNetworks.value = [...newNetworks];
  }
}, { immediate: true, deep: true });

// Get all type configs
const typeOptions = computed(() => {
  const configs = getAllTypeConfigs();
  const searchLower = typeSearchValue.value.toLowerCase();
  
  if (!searchLower) {
    return configs.map(config => ({
      label: config.type,
      value: config.type,
      bg: config.typeBg,
      color: config.typeColor,
      selected: selectedTypes.value.some(selected => selected.toUpperCase() === config.type.toUpperCase()),
    }));
  }
  
  return configs
    .filter(config => config.type.toLowerCase().includes(searchLower))
    .map(config => ({
      label: config.type,
      value: config.type,
      bg: config.typeBg,
      color: config.typeColor,
      selected: selectedTypes.value.some(selected => selected.toUpperCase() === config.type.toUpperCase()),
    }));
});

const toggleType = (type: string) => {
  const typeUpper = type.toUpperCase();
  const index = selectedTypes.value.findIndex(selected => selected.toUpperCase() === typeUpper);
  if (index > -1) {
    selectedTypes.value.splice(index, 1);
  } else {
    selectedTypes.value.push(typeUpper);
  }
};

// Get all status configs
const statusOptions = computed(() => {
  const configs = getAllStatusConfigs();
  const searchLower = statusSearchValue.value.toLowerCase();
  
  if (!searchLower) {
    return configs.map(config => ({
      label: config.status,
      value: config.status,
      bg: config.statusBg,
      color: config.statusColor,
      selected: selectedStatuses.value.some(selected => selected.toUpperCase() === config.status.toUpperCase()),
    }));
  }
  
  return configs
    .filter(config => config.status.toLowerCase().includes(searchLower))
    .map(config => ({
      label: config.status,
      value: config.status,
      bg: config.statusBg,
      color: config.statusColor,
      selected: selectedStatuses.value.some(selected => selected.toUpperCase() === config.status.toUpperCase()),
    }));
});

const toggleStatus = (status: string) => {
  const statusUpper = status.toUpperCase();
  const index = selectedStatuses.value.findIndex(selected => selected.toUpperCase() === statusUpper);
  if (index > -1) {
    selectedStatuses.value.splice(index, 1);
  } else {
    selectedStatuses.value.push(statusUpper);
  }
};

// Currency, Provider, Network options từ rule categories
const currencyOptions = computed(() => {
  const options = storeRuleCategory.getCurrencyOptions;
  const searchLower = currencySearchValue.value.toLowerCase();
  
  if (!searchLower) {
    return options.map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedCurrencies.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
  }
  
  return options
    .filter(option => option.name.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower))
    .map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedCurrencies.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
});

const providerOptions = computed(() => {
  const options = storeRuleCategory.getProviderOptions;
  const searchLower = providerSearchValue.value.toLowerCase();
  
  if (!searchLower) {
    return options.map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedProviders.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
  }
  
  return options
    .filter(option => option.name.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower))
    .map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedProviders.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
});

const networkOptions = computed(() => {
  const options = storeRuleCategory.getNetworkOptions;
  const searchLower = networkSearchValue.value.toLowerCase();
  
  if (!searchLower) {
    return options.map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedNetworks.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
  }
  
  return options
    .filter(option => option.name.toLowerCase().includes(searchLower) || option.value.toLowerCase().includes(searchLower))
    .map(option => ({
      label: option.name,
      value: option.value,
      selected: selectedNetworks.value.some(selected => selected.toUpperCase() === option.value.toUpperCase()),
    }));
});

const toggleCurrency = (currency: string) => {
  const currencyUpper = currency.toUpperCase();
  const index = selectedCurrencies.value.findIndex(selected => selected.toUpperCase() === currencyUpper);
  if (index > -1) {
    selectedCurrencies.value.splice(index, 1);
  } else {
    selectedCurrencies.value.push(currencyUpper);
  }
};

const toggleProvider = (provider: string) => {
  const providerUpper = provider.toUpperCase();
  const index = selectedProviders.value.findIndex(selected => selected.toUpperCase() === providerUpper);
  if (index > -1) {
    selectedProviders.value.splice(index, 1);
  } else {
    selectedProviders.value.push(providerUpper);
  }
};

const toggleNetwork = (network: string) => {
  const networkUpper = network.toUpperCase();
  const index = selectedNetworks.value.findIndex(selected => selected.toUpperCase() === networkUpper);
  if (index > -1) {
    selectedNetworks.value.splice(index, 1);
  } else {
    selectedNetworks.value.push(networkUpper);
  }
};

const handleClose = () => {
  emit('update:open', false);
};

const handleReset = () => {
  selectedTypes.value = [];
  selectedStatuses.value = [];
  selectedCurrencies.value = [];
  selectedProviders.value = [];
  selectedNetworks.value = [];
  selectedExportFields.value = ['index', 'code', 'name', 'type', 'currency', 'provider', 'network', 'status'];
};

const handleExport = () => {
  if (selectedExportFields.value.length === 0) {
    return;
  }
  emit('export', {
    fields: selectedExportFields.value,
    filters: {
      types: selectedTypes.value,
      statuses: selectedStatuses.value,
      currencies: selectedCurrencies.value,
      providers: selectedProviders.value,
      networks: selectedNetworks.value,
    }
  });
};

// Get selected type styles (case-insensitive)
const getSelectedTypeBadge = (type: string) => {
  const configs = getAllTypeConfigs();
  const config = configs.find(c => c.type.toUpperCase() === type.toUpperCase());
  if (!config) return null;
  return {
    bg: config.typeBg,
    color: config.typeColor,
  };
};

// Get selected status styles (case-insensitive)
const getSelectedStatusBadge = (status: string) => {
  const configs = getAllStatusConfigs();
  const config = configs.find(c => c.status.toUpperCase() === status.toUpperCase());
  if (!config) return null;
  return {
    bg: config.statusBg,
    color: config.statusColor,
  };
};

// Click outside to close dropdowns
const typeDropdownRef = ref<HTMLElement | null>(null);
const statusDropdownRef = ref<HTMLElement | null>(null);
const currencyDropdownRef = ref<HTMLElement | null>(null);
const providerDropdownRef = ref<HTMLElement | null>(null);
const networkDropdownRef = ref<HTMLElement | null>(null);

onClickOutside(typeDropdownRef, () => {
  showTypeDropdown.value = false;
});
onClickOutside(statusDropdownRef, () => {
  showStatusDropdown.value = false;
});
onClickOutside(currencyDropdownRef, () => {
  showCurrencyDropdown.value = false;
});
onClickOutside(providerDropdownRef, () => {
  showProviderDropdown.value = false;
});
onClickOutside(networkDropdownRef, () => {
  showNetworkDropdown.value = false;
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-[600px] max-h-[90vh] p-0 overflow-visible z-[100]">
      <DialogHeader class="px-5 py-3 border-b border-solid border-[#dcdcdc]">
        <DialogTitle class="font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-black text-[length:var(--caption-l-12-semibold-font-size)]">
          EXPORT
        </DialogTitle>
      </DialogHeader>

      <div class="flex flex-col">
        <!-- Export Fields Selection -->
        <div class="px-5 py-4 border-b border-solid border-[#dcdcdc] overflow-visible">
          <div class="mb-3">
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
              Select Fields to Export
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="field in exportFields"
              :key="field.value"
              @click="toggleExportField(field.value)"
              :class="[
                'flex items-center gap-2 px-3 py-2 rounded-[10px] border border-solid cursor-pointer transition-colors',
                selectedExportFields.includes(field.value)
                  ? 'bg-[#e4f6d2] border-[#07564d]'
                  : 'bg-white border-[#0000001a] hover:bg-gray-50'
              ]"
            >
              <div
                :class="[
                  'w-4 h-4 rounded border-2 flex items-center justify-center',
                  selectedExportFields.includes(field.value)
                    ? 'bg-[#07564d] border-[#07564d]'
                    : 'border-[#0000001a]'
                ]"
              >
                <Check
                  v-if="selectedExportFields.includes(field.value)"
                  class="w-3 h-3 text-white"
                />
              </div>
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                {{ field.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Filter Content -->
        <div class="flex flex-col items-start gap-5 p-5 w-full overflow-visible">
          <!-- Type Filter -->
          <div class="w-full gap-8 flex items-center">
            <div class="flex w-[74px] flex-shrink-0 items-center gap-1.5">
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                Type
              </span>
              <Badge
                v-if="selectedTypes.length > 0"
                class="w-4 h-4 p-0 bg-[#0000001a] rounded flex items-center justify-center font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[#07564d] text-[length:var(--caption-m-10-semibold-font-size)]"
              >
                {{ selectedTypes.length }}
              </Badge>
            </div>
            <div class="flex flex-col items-start gap-1.5 flex-1 grow">
              <div ref="typeDropdownRef" class="flex flex-col items-start gap-1 w-full relative">
                <div
                  @click="showTypeDropdown = !showTypeDropdown"
                  :class="[
                    'h-10 justify-between px-2.5 py-0 w-full bg-white rounded-[10px] overflow-hidden border border-solid shadow-[0px_1px_2px_#1018280d] flex items-center cursor-pointer',
                    selectedTypes.length > 0 ? 'border-[#07564d]' : 'border-[#0000001a]'
                  ]"
                >
                  <div class="inline-flex items-center gap-1 flex-wrap">
                    <Badge
                      v-for="type in selectedTypes"
                      :key="type"
                      :class="[
                        'gap-1 pl-2.5 pr-1.5 py-0 h-6 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[length:var(--caption-l-12-medium-font-size)]',
                        getSelectedTypeBadge(type)?.bg || 'bg-white',
                        getSelectedTypeBadge(type)?.color || 'text-black'
                      ]"
                    >
                      {{ type }}
                      <button
                        @click.stop="toggleType(type)"
                        class="w-3 h-3 flex items-center justify-center hover:opacity-70"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </Badge>
                    <span
                      v-if="selectedTypes.length === 0"
                      class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)]"
                    >
                      Select type
                    </span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </div>

                <!-- Type Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-[10px]"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 translate-y-[10px]"
                >
                  <div
                    v-if="showTypeDropdown"
                    class="flex flex-col w-[280px] items-start absolute bottom-full mb-2 right-0 bg-white rounded-[10px] overflow-hidden border border-solid border-[#0000000d] shadow-[0px_4px_6px_-2px_#10182808,0px_12px_16px_-4px_#0000000f] z-[100]"
                  >
                    <div class="flex h-11 items-center gap-2 px-3.5 py-0 w-full border-b border-solid border-[#efefef]">
                      <div class="flex items-center gap-2 flex-1 grow">
                        <Search class="w-4 h-4 text-[#00000080]" />
                        <Input
                          v-model="typeSearchValue"
                          placeholder="Search type"
                          class="border-0 shadow-none h-auto px-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col items-start p-1.5 w-full rounded-[10px] max-h-[300px] overflow-y-auto">
                      <div
                        v-for="(option, index) in typeOptions"
                        :key="`type-option-${index}`"
                        @click="toggleType(option.value)"
                        :class="[
                          'flex h-11 items-center gap-2 px-3.5 py-0 w-full rounded-md cursor-pointer hover:bg-[#f2f5f3] transition-colors',
                          option.selected ? 'bg-[#f2f5f3]' : ''
                        ]"
                      >
                        <div class="flex items-center gap-2 flex-1 grow">
                          <Badge
                            :class="[
                              'h-6 gap-[5px] px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[length:var(--caption-l-12-medium-font-size)]',
                              option.bg,
                              option.color
                            ]"
                          >
                            {{ option.label }}
                          </Badge>
                        </div>
                        <Check
                          v-if="option.selected"
                          class="w-4 h-4 text-[#07564d]"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Currency Filter -->
          <div class="w-full gap-8 flex items-center">
            <div class="flex w-[74px] flex-shrink-0 items-center gap-1.5">
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                Currency
              </span>
              <Badge
                v-if="selectedCurrencies.length > 0"
                class="w-4 h-4 p-0 bg-[#0000001a] rounded flex items-center justify-center font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[#07564d] text-[length:var(--caption-m-10-semibold-font-size)]"
              >
                {{ selectedCurrencies.length }}
              </Badge>
            </div>
            <div class="flex flex-col items-start gap-1.5 flex-1 grow">
              <div ref="currencyDropdownRef" class="flex flex-col items-start gap-1 w-full relative">
                <div
                  @click="showCurrencyDropdown = !showCurrencyDropdown"
                  :class="[
                    'h-10 justify-between px-2.5 py-0 w-full bg-white rounded-[10px] overflow-hidden border border-solid shadow-[0px_1px_2px_#1018280d] flex items-center cursor-pointer',
                    selectedCurrencies.length > 0 ? 'border-[#07564d]' : 'border-[#0000001a]'
                  ]"
                >
                  <div class="inline-flex items-center gap-1 flex-wrap">
                    <Badge
                      v-for="currency in selectedCurrencies"
                      :key="currency"
                      class="gap-1 pl-2.5 pr-1.5 py-0 h-6 rounded border border-solid border-[#0000001a] bg-white font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-black text-[length:var(--caption-l-12-medium-font-size)]"
                    >
                      {{ currency }}
                      <button
                        @click.stop="toggleCurrency(currency)"
                        class="w-3 h-3 flex items-center justify-center hover:opacity-70"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </Badge>
                    <span
                      v-if="selectedCurrencies.length === 0"
                      class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)]"
                    >
                      Select currency
                    </span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </div>

                <!-- Currency Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-[10px]"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 translate-y-[10px]"
                >
                  <div
                    v-if="showCurrencyDropdown"
                    class="flex flex-col w-[280px] items-start absolute bottom-full mb-2 right-0 bg-white rounded-[10px] overflow-hidden border border-solid border-[#0000000d] shadow-[0px_4px_6px_-2px_#10182808,0px_12px_16px_-4px_#0000000f] z-[100]"
                  >
                    <div class="flex h-11 items-center gap-2 px-3.5 py-0 w-full border-b border-solid border-[#efefef]">
                      <div class="flex items-center gap-2 flex-1 grow">
                        <Search class="w-4 h-4 text-[#00000080]" />
                        <Input
                          v-model="currencySearchValue"
                          placeholder="Search currency"
                          class="border-0 shadow-none h-auto px-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col items-start p-1.5 w-full rounded-[10px] max-h-[300px] overflow-y-auto">
                      <div
                        v-for="(option, index) in currencyOptions"
                        :key="`currency-option-${index}`"
                        @click="toggleCurrency(option.value)"
                        :class="[
                          'flex h-11 items-center gap-2 px-3.5 py-0 w-full rounded-md cursor-pointer hover:bg-[#f2f5f3] transition-colors',
                          option.selected ? 'bg-[#f2f5f3]' : ''
                        ]"
                      >
                        <div class="flex items-center gap-2 flex-1 grow">
                          <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                            {{ option.label }}
                          </span>
                        </div>
                        <Check
                          v-if="option.selected"
                          class="w-4 h-4 text-[#07564d]"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="gap-8 w-full flex items-center">
            <div class="flex w-[74px] flex-shrink-0 items-center gap-1.5">
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                Status
              </span>
              <Badge
                v-if="selectedStatuses.length > 0"
                class="w-4 h-4 p-0 bg-[#0000001a] rounded flex items-center justify-center font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[#07564d] text-[length:var(--caption-m-10-semibold-font-size)]"
              >
                {{ selectedStatuses.length }}
              </Badge>
            </div>
            <div class="flex flex-col items-start gap-1.5 flex-1 grow">
              <div ref="statusDropdownRef" class="flex flex-col items-start gap-1 w-full relative">
                <div
                  @click="showStatusDropdown = !showStatusDropdown"
                  :class="[
                    'h-10 justify-between px-2.5 py-0 w-full bg-white rounded-[10px] overflow-hidden border border-solid shadow-[0px_1px_2px_#1018280d] flex items-center cursor-pointer',
                    selectedStatuses.length > 0 ? 'border-[#07564d]' : 'border-[#0000001a]'
                  ]"
                >
                  <div class="inline-flex items-center gap-1 flex-wrap">
                    <Badge
                      v-for="status in selectedStatuses"
                      :key="status"
                      :class="[
                        'gap-1 pl-2.5 pr-1.5 py-0 h-6 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[length:var(--caption-l-12-medium-font-size)]',
                        getSelectedStatusBadge(status)?.bg || 'bg-white',
                        getSelectedStatusBadge(status)?.color || 'text-black'
                      ]"
                    >
                      {{ status }}
                      <button
                        @click.stop="toggleStatus(status)"
                        class="w-3 h-3 flex items-center justify-center hover:opacity-70"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </Badge>
                    <span
                      v-if="selectedStatuses.length === 0"
                      class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)]"
                    >
                      Select status
                    </span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </div>

                <!-- Status Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-[10px]"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 translate-y-[10px]"
                >
                  <div
                    v-if="showStatusDropdown"
                    class="flex flex-col w-[280px] items-start absolute bottom-full mb-2 right-0 bg-white rounded-[10px] overflow-hidden border border-solid border-[#0000000d] shadow-[0px_4px_6px_-2px_#10182808,0px_12px_16px_-4px_#0000000f] z-[100]"
                  >
                    <div class="flex h-11 items-center gap-2 px-3.5 py-0 w-full border-b border-solid border-[#efefef]">
                      <div class="flex items-center gap-2 flex-1 grow">
                        <Search class="w-4 h-4 text-[#00000080]" />
                        <Input
                          v-model="statusSearchValue"
                          placeholder="Search status"
                          class="border-0 shadow-none h-auto px-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col items-start p-1.5 w-full rounded-[10px] max-h-[300px] overflow-y-auto">
                      <div
                        v-for="(option, index) in statusOptions"
                        :key="`status-option-${index}`"
                        @click="toggleStatus(option.value)"
                        :class="[
                          'flex h-11 items-center gap-2 px-3.5 py-0 w-full rounded-md cursor-pointer hover:bg-[#f2f5f3] transition-colors',
                          option.selected ? 'bg-[#f2f5f3]' : ''
                        ]"
                      >
                        <div class="flex items-center gap-2 flex-1 grow">
                          <Badge
                            :class="[
                              'h-6 gap-[5px] px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-[length:var(--caption-l-12-medium-font-size)]',
                              option.bg,
                              option.color
                            ]"
                          >
                            {{ option.label }}
                          </Badge>
                        </div>
                        <Check
                          v-if="option.selected"
                          class="w-4 h-4 text-[#07564d]"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Provider Filter -->
          <div class="w-full gap-8 flex items-center">
            <div class="flex w-[74px] flex-shrink-0 items-center gap-1.5">
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                Provider
              </span>
              <Badge
                v-if="selectedProviders.length > 0"
                class="w-4 h-4 p-0 bg-[#0000001a] rounded flex items-center justify-center font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[#07564d] text-[length:var(--caption-m-10-semibold-font-size)]"
              >
                {{ selectedProviders.length }}
              </Badge>
            </div>
            <div class="flex flex-col items-start gap-1.5 flex-1 grow">
              <div ref="providerDropdownRef" class="flex flex-col items-start gap-1 w-full relative">
                <div
                  @click="showProviderDropdown = !showProviderDropdown"
                  :class="[
                    'h-10 justify-between px-2.5 py-0 w-full bg-white rounded-[10px] overflow-hidden border border-solid shadow-[0px_1px_2px_#1018280d] flex items-center cursor-pointer',
                    selectedProviders.length > 0 ? 'border-[#07564d]' : 'border-[#0000001a]'
                  ]"
                >
                  <div class="inline-flex items-center gap-1 flex-wrap">
                    <Badge
                      v-for="provider in selectedProviders"
                      :key="provider"
                      class="gap-1 pl-2.5 pr-1.5 py-0 h-6 rounded border border-solid border-[#0000001a] bg-white font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-black text-[length:var(--caption-l-12-medium-font-size)]"
                    >
                      {{ provider }}
                      <button
                        @click.stop="toggleProvider(provider)"
                        class="w-3 h-3 flex items-center justify-center hover:opacity-70"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </Badge>
                    <span
                      v-if="selectedProviders.length === 0"
                      class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)]"
                    >
                      Select provider
                    </span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </div>

                <!-- Provider Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-[10px]"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 translate-y-[10px]"
                >
                  <div
                    v-if="showProviderDropdown"
                    class="flex flex-col w-[280px] items-start absolute bottom-full mb-2 right-0 bg-white rounded-[10px] overflow-hidden border border-solid border-[#0000000d] shadow-[0px_4px_6px_-2px_#10182808,0px_12px_16px_-4px_#0000000f] z-[100]"
                  >
                    <div class="flex h-11 items-center gap-2 px-3.5 py-0 w-full border-b border-solid border-[#efefef]">
                      <div class="flex items-center gap-2 flex-1 grow">
                        <Search class="w-4 h-4 text-[#00000080]" />
                        <Input
                          v-model="providerSearchValue"
                          placeholder="Search provider"
                          class="border-0 shadow-none h-auto px-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col items-start p-1.5 w-full rounded-[10px] max-h-[300px] overflow-y-auto">
                      <div
                        v-for="(option, index) in providerOptions"
                        :key="`provider-option-${index}`"
                        @click="toggleProvider(option.value)"
                        :class="[
                          'flex h-11 items-center gap-2 px-3.5 py-0 w-full rounded-md cursor-pointer hover:bg-[#f2f5f3] transition-colors',
                          option.selected ? 'bg-[#f2f5f3]' : ''
                        ]"
                      >
                        <div class="flex items-center gap-2 flex-1 grow">
                          <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                            {{ option.label }}
                          </span>
                        </div>
                        <Check
                          v-if="option.selected"
                          class="w-4 h-4 text-[#07564d]"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Network Filter -->
          <div class="w-full gap-8 flex items-center">
            <div class="flex w-[74px] flex-shrink-0 items-center gap-1.5">
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                Network
              </span>
              <Badge
                v-if="selectedNetworks.length > 0"
                class="w-4 h-4 p-0 bg-[#0000001a] rounded flex items-center justify-center font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[#07564d] text-[length:var(--caption-m-10-semibold-font-size)]"
              >
                {{ selectedNetworks.length }}
              </Badge>
            </div>
            <div class="flex flex-col items-start gap-1.5 flex-1 grow">
              <div ref="networkDropdownRef" class="flex flex-col items-start gap-1 w-full relative">
                <div
                  @click="showNetworkDropdown = !showNetworkDropdown"
                  :class="[
                    'h-10 justify-between px-2.5 py-0 w-full bg-white rounded-[10px] overflow-hidden border border-solid shadow-[0px_1px_2px_#1018280d] flex items-center cursor-pointer',
                    selectedNetworks.length > 0 ? 'border-[#07564d]' : 'border-[#0000001a]'
                  ]"
                >
                  <div class="inline-flex items-center gap-1 flex-wrap">
                    <Badge
                      v-for="network in selectedNetworks"
                      :key="network"
                      class="gap-1 pl-2.5 pr-1.5 py-0 h-6 rounded border border-solid border-[#0000001a] bg-white font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)] text-black text-[length:var(--caption-l-12-medium-font-size)]"
                    >
                      {{ network }}
                      <button
                        @click.stop="toggleNetwork(network)"
                        class="w-3 h-3 flex items-center justify-center hover:opacity-70"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </Badge>
                    <span
                      v-if="selectedNetworks.length === 0"
                      class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)]"
                    >
                      Select network
                    </span>
                  </div>
                  <ChevronDown class="w-4 h-4" />
                </div>

                <!-- Network Dropdown -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 translate-y-[10px]"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 translate-y-[10px]"
                >
                  <div
                    v-if="showNetworkDropdown"
                    class="flex flex-col w-[280px] items-start absolute bottom-full mb-2 right-0 bg-white rounded-[10px] overflow-hidden border border-solid border-[#0000000d] shadow-[0px_4px_6px_-2px_#10182808,0px_12px_16px_-4px_#0000000f] z-[100]"
                  >
                    <div class="flex h-11 items-center gap-2 px-3.5 py-0 w-full border-b border-solid border-[#efefef]">
                      <div class="flex items-center gap-2 flex-1 grow">
                        <Search class="w-4 h-4 text-[#00000080]" />
                        <Input
                          v-model="networkSearchValue"
                          placeholder="Search network"
                          class="border-0 shadow-none h-auto px-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col items-start p-1.5 w-full rounded-[10px] max-h-[300px] overflow-y-auto">
                      <div
                        v-for="(option, index) in networkOptions"
                        :key="`network-option-${index}`"
                        @click="toggleNetwork(option.value)"
                        :class="[
                          'flex h-11 items-center gap-2 px-3.5 py-0 w-full rounded-md cursor-pointer hover:bg-[#f2f5f3] transition-colors',
                          option.selected ? 'bg-[#f2f5f3]' : ''
                        ]"
                      >
                        <div class="flex items-center gap-2 flex-1 grow">
                          <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)]">
                            {{ option.label }}
                          </span>
                        </div>
                        <Check
                          v-if="option.selected"
                          class="w-4 h-4 text-[#07564d]"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center gap-2 pt-4 pb-5 px-5 w-full border-t border-solid border-[#dcdcdc]">
        <Button
          variant="outline"
          @click="handleReset"
          class="h-auto flex-1 grow gap-1.5 px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)]"
        >
          Reset
        </Button>
        <Button
          @click="handleExport"
          :disabled="selectedExportFields.length === 0"
          class="h-auto flex-1 grow gap-1.5 px-3 py-2.5 bg-[#07564d] rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-white text-[length:var(--button-s-14-medium-font-size)] hover:bg-[#07564d]/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

