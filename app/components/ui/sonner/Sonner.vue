<script setup>
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps({
  invert: { type: Boolean, required: false },
  theme: { type: String, required: false },
  position: { type: String, required: false },
  hotkey: { type: Array, required: false },
  richColors: { type: Boolean, required: false },
  expand: { type: Boolean, required: false },
  duration: { type: Number, required: false },
  gap: { type: Number, required: false },
  visibleToasts: { type: Number, required: false },
  closeButton: { type: Boolean, required: false },
  toastOptions: { type: Object, required: false },
  class: { type: String, required: false },
  style: { type: Object, required: false },
  offset: { type: [Object, String, Number], required: false },
  mobileOffset: { type: [Object, String, Number], required: false },
  dir: { type: String, required: false },
  swipeDirections: { type: Array, required: false },
  icons: { type: Object, required: false },
  containerAriaLabel: { type: String, required: false },
})
</script>

<template>
  <Sonner
    class="toaster group"
    position="top-right"
    richColors
    v-bind="{ ...props, position: 'top-right'}"
  />
</template>

/**
 * Để tuỳ chỉnh sâu hơn màu sắc cho từng loại toast (success, error, info, warning),
 * hãy truyền thêm prop toastOptions vào Toaster như sau:
 *
 * <Toaster :toastOptions="{ unstyled: true, classes: { success: 'bg-green-500 text-white', error: 'bg-red-500 text-white' } }" />
 *
 * For advanced color customization per toast type, use toastOptions prop:
 *
 * <Toaster :toastOptions="{ unstyled: true, classes: { success: 'bg-green-500 text-white', error: 'bg-red-500 text-white' } }" />
 */
