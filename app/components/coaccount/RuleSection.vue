<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown, Plus, X, Edit2, Save, XCircle, RotateCcw } from 'lucide-vue-next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Input } from '~/components/ui/input';
import Button from '~/components/ui/button/Button.vue';
import type { IRuleValue } from '~/types/ruleValue';

interface Props {
  sectionKey: string;
  sectionLabel: string;
  placeholder: string;
  isSimpleInput: boolean;
  items: IRuleValue[];
  isOpen: boolean;
  inputValue: string;
  inputNameValue: string;
  error: string;
  itemErrors: Record<number | string, string>;
  editingItems: Record<number | string, boolean>;
  isSaving: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'update:inputValue': [value: string];
  'update:inputNameValue': [value: string];
  'add-item': [];
  'edit-item': [index: number];
  'save-item': [index: number];
  'cancel-edit': [index: number];
  'remove-item': [index: number];
  'save-section': [];
  'reset-section': [];
}>();

// Filter items: chỉ hiển thị items chưa bị xóa
const visibleItems = computed(() => {
  return props.items.filter(item => !item.is_delete);
});

const isEditing = (item: IRuleValue) => {
  return item.id ? props.editingItems[item.id] : false;
};

const getItemError = (item: IRuleValue, index: number) => {
  if (item.id) {
    return props.itemErrors[item.id];
  }
  // For new items without id
  const tempKey = `new_${index}`;
  return props.itemErrors[tempKey];
};

const toggleSection = () => {
  emit('update:isOpen', !props.isOpen);
};

const handleInputName = (value: string | number) => {
  emit('update:inputNameValue', String(value));
};

const handleInputValue = (value: string | number) => {
  emit('update:inputValue', String(value));
};

const getDisplayText = (item: IRuleValue): string => {
  if (props.isSimpleInput) {
    // NETWORK and CURRENCY: chỉ hiển thị value
    return item.value || item.name;
  } else {
    // Các loại khác: hiển thị "name (value)"
    return `${item.name} (${item.value})`;
  }
};
</script>

<template>
  <Collapsible 
    :open="isOpen" 
    class="mb-4 border border-[#dcdcdc] rounded-[10px] overflow-hidden"
  >
    <CollapsibleTrigger
      @click="toggleSection"
      class="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
    >
      <span class="font-label-m-16-medium text-black">{{ sectionLabel }}</span>
      <ChevronDown 
        :class="['w-5 h-5 transition-transform', isOpen ? 'rotate-180' : '']"
      />
    </CollapsibleTrigger>
    <CollapsibleContent class="px-4 py-3 bg-white">
      <!-- Existing items -->
      <div class="space-y-3 mb-4">
        <div
          v-for="(item, index) in visibleItems"
          :key="item.id || index"
          class="flex items-start gap-2"
        >
          <div class="flex-1">
            <div v-if="isEditing(item)">
              <div v-if="isSimpleInput" class="space-y-2">
                <Input
                  v-model="item.value"
                  :placeholder="placeholder"
                  :class="['h-10', getItemError(item, index) ? 'border-red-500' : '']"
                  @keyup.enter="emit('save-item', index)"
                  @keyup.esc="emit('cancel-edit', index)"
                />
                <p v-if="getItemError(item, index)" class="text-red-500 text-sm mt-1">
                  {{ getItemError(item, index) }}
                </p>
              </div>
              <div v-else class="space-y-2">
                <Input
                  v-model="item.name"
                  placeholder="Enter name"
                  :class="['h-10', getItemError(item, index) ? 'border-red-500' : '']"
                  @keyup.enter="emit('save-item', index)"
                />
                <Input
                  v-model="item.value"
                  placeholder="Enter value (code)"
                  :class="['h-10', getItemError(item, index) ? 'border-red-500' : '']"
                  @keyup.enter="emit('save-item', index)"
                  @keyup.esc="emit('cancel-edit', index)"
                />
                <p v-if="getItemError(item, index)" class="text-red-500 text-sm mt-1">
                  {{ getItemError(item, index) }}
                </p>
              </div>
            </div>
            <div v-else class="flex items-center gap-2 h-10 px-3 border border-[#0000001a] rounded bg-white">
              <span class="font-label-s-14-medium flex-1">{{ getDisplayText(item) }}</span>
              <span v-if="getItemError(item, index)" class="text-red-500 text-xs">
                {{ getItemError(item, index) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              v-if="isEditing(item)"
              @click="emit('save-item', index)"
              class="p-2 hover:bg-green-50 rounded transition-colors"
              title="Save"
            >
              <Save class="w-4 h-4 text-green-600" />
            </button>
            <button
              v-if="isEditing(item)"
              @click="emit('cancel-edit', index)"
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Cancel"
            >
              <XCircle class="w-4 h-4 text-gray-600" />
            </button>
            <button
              v-if="!isEditing(item)"
              @click="emit('edit-item', index)"
              class="p-2 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit2 class="w-4 h-4 text-blue-600" />
            </button>
            <button
              v-if="!isEditing(item)"
              @click="emit('remove-item', index)"
              class="p-2 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <X class="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Add new item -->
      <div class="mb-4">
        <div v-if="isSimpleInput" class="flex gap-2">
          <div class="flex-1">
            <Input
              :model-value="inputValue"
              @update:modelValue="handleInputValue"
              :placeholder="placeholder"
              class="h-10"
              @keyup.enter="emit('add-item')"
            />
            <p v-if="error" class="text-red-500 text-sm mt-1">
              {{ error }}
            </p>
          </div>
          <Button
            @click="emit('add-item')"
            class="px-4 py-2 bg-[#07564d] text-white rounded-[10px] hover:bg-[#07564d]/90 font-button-s-14-medium"
          >
            Add
          </Button>
        </div>
        <div v-else class="space-y-2">
          <div class="flex gap-2">
            <div class="flex-1">
              <Input
                :model-value="inputNameValue"
                @update:modelValue="handleInputName"
                placeholder="Enter name"
                class="h-10"
              />
            </div>
            <div class="flex-1">
              <Input
                :model-value="inputValue"
                @update:modelValue="handleInputValue"
                placeholder="Enter value (code)"
                class="h-10"
                @keyup.enter="emit('add-item')"
              />
            </div>
            <Button
              @click="emit('add-item')"
              class="px-4 py-2 bg-[#07564d] text-white rounded-[10px] hover:bg-[#07564d]/90 font-button-s-14-medium"
            >
              Add
            </Button>
          </div>
          <p v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2">
        <Button
          @click="emit('reset-section')"
          class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-[10px] hover:bg-gray-600 font-button-s-14-medium"
        >
          <RotateCcw class="w-4 h-4 inline mr-2" />
          Reset
        </Button>
        <Button
          @click="emit('save-section')"
          :disabled="isSaving"
          class="flex-1 px-4 py-2 bg-[#07564d] text-white rounded-[10px] hover:bg-[#07564d]/90 font-button-s-14-medium disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save' }}
        </Button>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>

