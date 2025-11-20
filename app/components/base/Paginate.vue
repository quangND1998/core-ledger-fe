<script setup lang="ts">
defineProps<{
  modelValue: number
  limit: number
  total: number
}>()

import { defineProps, defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

function onChangePage(value: number) {
  emit('update:modelValue', value)
}
</script>

<template>
  <UPagination
    size="md"
    :max="6"
    :model-value="modelValue"
    @update:model-value="onChangePage"
    :page-count="limit"
    :total="total"
    class="pagination-custom"
    :active-button="{
      color: '',
      variant: 'ghost',
      class: 'bg-[#FF5524] rounded-full w-10 h-10 text-center justify-center text-white p-3',
    }"
    :inactive-button="{
      color: '',
      variant: 'ghost',
      class: 'rounded-full border border-[#D7D9E5] w-10 h-10 justify-center',
    }"
    :ui="{
      wrapper: 'flex items-center -space-x-px gap-[6px]',
      default: {
        activeButton: {},
      },
    }"
  >
    <template #prev="{ onClick, canGoPrev }">
      <UTooltip text="Previous page">
        <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
          <img :class="canGoPrev ? '' : 'opacity-50 cursor-not-allowed'" src="~/assets/img/icons/back.svg" alt="" />
        </UButton>
      </UTooltip>
    </template>
    <template #next="{ onClick, canGoNext }">
      <UTooltip text="Next page">
        <UButton class="p-0 shadow-none bg-[#FFFFFF] hover:bg-[#FFFFFF]" @click="onClick">
          <img :class="canGoNext ? '' : 'opacity-50 cursor-not-allowed'" src="~/assets/img/icons/next.svg" alt="" />
        </UButton>
      </UTooltip>
    </template>
  </UPagination>
</template>
