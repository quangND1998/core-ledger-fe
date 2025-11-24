<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

interface Props {
  open: boolean
  requestId?: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'reject': [requestId: string | number, reason: string]
}>()

const rejectReason = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Reset form when modal opens/closes
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    rejectReason.value = ''
    error.value = null
  }
})

const handleReject = async () => {
  // Validate
  if (!rejectReason.value.trim()) {
    error.value = 'Rejection reason is required'
    return
  }

  if (!props.requestId) {
    error.value = 'Request ID is missing'
    return
  }

  error.value = null
  isLoading.value = true

  try {
    emit('reject', props.requestId, rejectReason.value.trim())
    emit('update:open', false)
  } catch (err: any) {
    error.value = err.message || 'Failed to reject request'
  } finally {
    isLoading.value = false
  }
}

const handleClose = () => {
  rejectReason.value = ''
  error.value = null
  emit('update:open', false)
}
</script>


<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogContent class="w-full max-w-[500px]" :showCloseButton="false">
      <DialogHeader>
        <div class="flex items-center justify-between w-full">
          <DialogTitle class="font-heading-m-20-medium font-[number:var(--heading-m-20-medium-font-weight)] text-black text-[length:var(--heading-m-20-medium-font-size)] tracking-[var(--heading-m-20-medium-letter-spacing)] leading-[var(--heading-m-20-medium-line-height)] [font-style:var(--heading-m-20-medium-font-style)]">
            Reject submit
          </DialogTitle>
          
          <Button
            variant="ghost"
            size="icon"
            class="w-8 h-8 bg-[#0000000d] rounded-md hover:bg-[#0000001a]"
            @click="handleClose"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
      </DialogHeader>

      <div class="flex flex-col gap-4 py-4">
        <p class="font-label-s-14-medium text-black">
          Confirm rejecting this request?
        </p>

        <div class="flex flex-col gap-2">
          <Label class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
            Rejection reason
            <span class="text-[#ee443f]">*</span>
          </Label>
          <Textarea
            v-model="rejectReason"
            placeholder="Enter rejection reason"
            :class="`min-h-[100px] w-full p-2.5 rounded-[10px] border ${
              error ? 'border-[#fac5c3]' : 'border-[#0000001a]'
            } bg-white shadow-[0px_1px_2px_#1018280d] font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] resize-none`"
          />
          <span v-if="error" class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#ee443f] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
            {{ error }}
          </span>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            class="px-4 py-2 rounded-[10px]"
            @click="handleClose"
            :disabled="isLoading"
          >
            Cancel
          </Button>
          <Button
            class="px-4 py-2 rounded-[10px] bg-[#ee443f] hover:bg-[#ee443f]/90 text-white"
            @click="handleReject"
            :disabled="isLoading || !rejectReason.trim()"
          >
            Reject
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

