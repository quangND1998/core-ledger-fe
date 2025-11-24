<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Input } from "~/components/ui/input";
import { useDebounceFn } from "@vueuse/core";

interface Props {
  placeholder?: string;
  modelValue?: string;
  debounce?: number; // Thời gian debounce tính bằng ms
  iconClass?: string;
  inputClass?: string;
  containerClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search...",
  modelValue: "",
  debounce: 300, // Mặc định 300ms
  iconClass: "w-[18px] h-[18px] text-[#00000080]",
  inputClass: "border-0 shadow-none font-label-m-16-medium font-[number:var(--label-m-16-medium-font-weight)] text-[#00000080] text-[length:var(--label-m-16-medium-font-size)] tracking-[var(--label-m-16-medium-letter-spacing)] leading-[var(--label-m-16-medium-line-height)] [font-style:var(--label-m-16-medium-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0 px-0",
  containerClass: "inline-flex items-center gap-2 flex-1",
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'search': [value: string];
}>();

const searchValue = ref(props.modelValue);

// Debounce function để tránh gọi API quá nhiều
const debouncedSearch = useDebounceFn((value: string) => {
  emit('search', value.trim());
}, props.debounce);

// Watch để cập nhật modelValue ngay lập tức (cho v-model)
watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue);
  debouncedSearch(newValue);
});

// Watch props.modelValue để sync từ bên ngoài
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchValue.value) {
    searchValue.value = newValue;
  }
});
</script>

<template>
  <div :class="containerClass">
    <Search :class="iconClass" />
    <Input
      v-model="searchValue"
      :placeholder="placeholder"
      :class="inputClass"
    />
  </div>
</template>


