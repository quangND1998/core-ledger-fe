<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import { Badge } from '~/components/ui/badge'
import { Separator } from '~/components/ui/separator'
import { Card, CardContent } from '~/components/ui/card'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import type { IRequestCoaAccount } from '~/types/requestCoaAccount'
import { ReqCoaAccountStatus, ReqCoaAccountType } from '~/types/requestCoaAccount'
import { requestCoaAccountService } from '~/services/request-account.service'
import { useAvatar } from '~/composables/common'
import Swal from 'sweetalert2'

interface Props {
  open: boolean
  requestId?: string | number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:open': [value: boolean]
  'approve': [requestId: string | number]
  'reject': [requestId: string | number]
}>()

const isLoading = ref(false)
const requestDetail = ref<IRequestCoaAccount | null>(null)
const { getAvatarBg, getAvatarColor, getInitials } = useAvatar()

const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

// Format request type
const formatRequestType = (type: string) => {
  const typeMap: Record<string, string> = {
    CREATE: 'Create account',
    EDIT: 'Edit account',
  }
  return typeMap[type.toUpperCase()] || type
}

// Format date
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Get status badge classes
const getStatusBadgeClasses = (status: string) => {
  const statusMap: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: 'bg-[#fff1df]', color: 'text-[#d2510e]' },
    APPROVED: { bg: 'bg-[#e4f6d2]', color: 'text-[#07564d]' },
    REJECTED: { bg: 'bg-[#f7e1e1]', color: 'text-[#641d1a]' },
  }
  const statusConfig = statusMap[status.toUpperCase()] || { bg: 'bg-white', color: 'text-black' }
  return [
    'h-6',
    'px-2.5',
    'py-0',
    'rounded',
    'border',
    'border-solid',
    'border-[#0000001a]',
    'font-caption-l-12-medium',
    'font-[number:var(--caption-l-12-medium-font-weight)]',
    'text-[length:var(--caption-l-12-medium-font-size)]',
    'tracking-[var(--caption-l-12-medium-letter-spacing)]',
    'leading-[var(--caption-l-12-medium-line-height)]',
    '[font-style:var(--caption-l-12-medium-font-style)]',
    statusConfig.bg,
    statusConfig.color,
    'hover:' + statusConfig.bg,
  ]
}

// Check if should show action buttons
const showActionButtons = computed(() => {
  return requestDetail.value?.request_status === ReqCoaAccountStatus.PENDING
})

// Get account type badge
const getAccountTypeBadge = (type: string) => {
  if (type === 'EQUITY') {
    return {
      bg: 'bg-[#fff1df]',
      color: 'text-[#d2510e]',
    }
  }
  return {
    bg: 'bg-white',
    color: 'text-black',
  }
}

// Get account status badge
const getAccountStatusBadge = (status: string) => {
  if (status === 'ACTIVE') {
    return {
      bg: 'bg-[#e4f6d2]',
      color: 'text-[#07564d]',
    }
  }
  return {
    bg: 'bg-white',
    color: 'text-black',
  }
}

// Handle approve
const handleApprove = async () => {
  if (!requestDetail.value) return
  emit('approve', requestDetail.value.id)
}

// Handle reject
const handleReject = () => {
  if (!requestDetail.value) return
  emit('reject', requestDetail.value.id)
}

// Fetch request detail
const fetchDetail = async () => {
  if (!props.requestId) return
  
  isLoading.value = true
  try {
    const response = await requestCoaAccountService.fetchRequestDetail(props.requestId)
    if (response.success && response.data) {
      requestDetail.value = response.data
    }
  } catch (error) {
    console.error('Error fetching request detail:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for open and requestId changes
watch(() => props.open, (isOpen) => {
  if (isOpen && props.requestId) {
    fetchDetail()
  } else {
    requestDetail.value = null
  }
})

watch(() => props.requestId, () => {
  if (props.open && props.requestId) {
    fetchDetail()
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogContent class="w-full max-w-[712px] overflow-y-auto max-h-[90vh]" :showCloseButton="false">
      <DialogHeader>
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col items-start gap-0">
            <div class="inline-flex gap-1.5 items-center">
              <DialogTitle class="font-heading-m-20-medium font-[number:var(--heading-m-20-medium-font-weight)] text-black text-[length:var(--heading-m-20-medium-font-size)] tracking-[var(--heading-m-20-medium-letter-spacing)] leading-[var(--heading-m-20-medium-line-height)] [font-style:var(--heading-m-20-medium-font-style)]">
                {{ requestDetail ? formatRequestType(requestDetail.request_type) : 'Request Detail' }}
              </DialogTitle>
              <Badge v-if="requestDetail" :class="getStatusBadgeClasses(requestDetail.request_status)">
                {{ requestDetail.request_status === ReqCoaAccountStatus.PENDING ? 'Pending' : requestDetail.request_status === ReqCoaAccountStatus.APPROVED ? 'Approved' : 'Rejected' }}
              </Badge>
            </div>
            <time v-if="requestDetail" class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
              {{ formatDate(requestDetail.created_at) }}
            </time>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            class="w-8 h-8 bg-[#0000000d] rounded-md hover:bg-[#0000001a] transition-colors"
            @click="emit('update:open', false)"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
      </DialogHeader>

      <div v-if="isLoading" class="flex items-center justify-center py-10">
        <span class="text-[#00000080]">Loading...</span>
      </div>

      <div v-else-if="requestDetail" class="flex flex-col gap-4 py-4">
        <!-- Account Details Card -->
        <div class="flex items-center gap-4 px-0 py-2.5">
          <Card class="flex-1 bg-[#f4f7f6] rounded-[10px] border-0 shadow-none">
            <CardContent class="flex flex-col items-center gap-3 p-3.5">
              <!-- Account Name and Badges -->
              <div class="flex flex-col items-start gap-0.5 w-full">
                <h3 class="font-heading-m-20-medium font-[number:var(--heading-m-20-medium-font-weight)] text-black text-[length:var(--heading-m-20-medium-font-size)] tracking-[var(--heading-m-20-medium-letter-spacing)] leading-[var(--heading-m-20-medium-line-height)] [font-style:var(--heading-m-20-medium-font-style)]">
                  {{ requestDetail.data?.name || '-' }}
                </h3>
                <div class="inline-flex items-center gap-1.5">
                  <Badge class="h-6 px-1.5 bg-white text-black border-[#0000001a] hover:bg-white [font-family:'Space_Grotesk',Helvetica] font-medium text-xs tracking-[0] leading-4">
                    {{ requestDetail.data?.code || '-' }}
                  </Badge>
                  <Badge 
                    v-if="requestDetail.data?.status"
                    :class="[
                      'h-6',
                      'px-2.5',
                      'border-[#0000001a]',
                      'font-caption-l-12-medium',
                      'font-[number:var(--caption-l-12-medium-font-weight)]',
                      'text-[length:var(--caption-l-12-medium-font-size)]',
                      'tracking-[var(--caption-l-12-medium-letter-spacing)]',
                      'leading-[var(--caption-l-12-medium-line-height)]',
                      '[font-style:var(--caption-l-12-medium-font-style)]',
                      getAccountStatusBadge(requestDetail.data.status).bg,
                      getAccountStatusBadge(requestDetail.data.status).color,
                      'hover:' + getAccountStatusBadge(requestDetail.data.status).bg,
                    ]"
                  >
                    {{ requestDetail.data.status }}
                  </Badge>
                </div>
              </div>

              <Separator class="w-full" />

              <!-- Row 1: Record ID, Account No, Status -->
              <div class="flex items-start gap-4 px-0 py-1.5 w-full rounded-[10px]">
                <div class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Record ID
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.id }}
                  </span>
                </div>
                <div class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Account no
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.data?.account_no || '-' }}
                  </span>
                </div>
                <div class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Status
                  </span>
                  <Badge 
                    v-if="requestDetail.data?.status"
                    :class="[
                      'h-6',
                      'px-2.5',
                      'border-[#0000001a]',
                      'font-caption-l-12-medium',
                      'font-[number:var(--caption-l-12-medium-font-weight)]',
                      'text-[length:var(--caption-l-12-medium-font-size)]',
                      'tracking-[var(--caption-l-12-medium-letter-spacing)]',
                      'leading-[var(--caption-l-12-medium-line-height)]',
                      '[font-style:var(--caption-l-12-medium-font-style)]',
                      getAccountStatusBadge(requestDetail.data.status).bg,
                      getAccountStatusBadge(requestDetail.data.status).color,
                      'hover:' + getAccountStatusBadge(requestDetail.data.status).bg,
                    ]"
                  >
                    {{ requestDetail.data.status }}
                  </Badge>
                  <span v-else class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    -
                  </span>
                </div>
              </div>

              <!-- Row 2: Type, Currency, Provider, Network -->
              <div class="flex items-start gap-4 px-0 py-1.5 w-full rounded-[10px]">
                <div v-if="requestDetail.data?.type" class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Type
                  </span>
                  <Badge 
                    :class="[
                      'h-6',
                      'px-2.5',
                      'bg-[#fff1df]',
                      'text-[#d2510e]',
                      'border-[#0000001a]',
                      'hover:bg-[#fff1df]',
                      'font-caption-l-12-medium',
                      'font-[number:var(--caption-l-12-medium-font-weight)]',
                      'text-[length:var(--caption-l-12-medium-font-size)]',
                      'tracking-[var(--caption-l-12-medium-letter-spacing)]',
                      'leading-[var(--caption-l-12-medium-line-height)]',
                      '[font-style:var(--caption-l-12-medium-font-style)]',
                    ]"
                  >
                    {{ requestDetail.data.type }}
                  </Badge>
                </div>
                <div class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Currency
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.data?.currency || '-' }}
                  </span>
                </div>
                <div v-if="requestDetail.data?.provider" class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Provider
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.data.provider }}
                  </span>
                </div>
                <div v-if="requestDetail.data?.network" class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Network
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.data.network }}
                  </span>
                </div>
              </div>

              <!-- Row 3: Description -->
              <div class="flex items-start gap-4 px-0 py-1.5 w-full rounded-[10px]">
                <div class="flex flex-col items-start flex-1">
                  <span class="font-body-12-s-regular font-[number:var(--body-12-s-regular-font-weight)] text-[#00000080] text-[length:var(--body-12-s-regular-font-size)] tracking-[var(--body-12-s-regular-letter-spacing)] leading-[var(--body-12-s-regular-line-height)] [font-style:var(--body-12-s-regular-font-style)]">
                    Description
                  </span>
                  <span class="flex items-center justify-center h-6 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ requestDetail.data?.description || '-' }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Footer: Maker, Checker, Reason, Action Buttons -->
        <footer class="flex items-center justify-end gap-2 pt-4 pb-5 px-5">
          <div class="flex flex-col items-start gap-0.5 flex-1">
            <span class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#00000080] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
              Maker
            </span>
            <div class="flex items-center gap-2">
              <Avatar :class="['w-6 h-6 rounded-md', getAvatarBg(0)]">
                <AvatarFallback
                  :class="[
                    getAvatarBg(0),
                    getAvatarColor(getAvatarBg(0)),
                    'font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)]'
                  ]"
                >
                  {{ getInitials(requestDetail.maker?.full_name || '') }}
                </AvatarFallback>
              </Avatar>
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                {{ requestDetail.maker?.full_name || '-' }}
              </span>
            </div>
          </div>
          
          <div v-if="requestDetail.checker" class="flex flex-col items-start gap-0.5 flex-1">
            <span class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#00000080] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
              Checker
            </span>
            <div class="flex items-center gap-2">
              <Avatar :class="['w-6 h-6 rounded-md', getAvatarBg(1)]">
                <AvatarFallback
                  :class="[
                    getAvatarBg(1),
                    getAvatarColor(getAvatarBg(1)),
                    'font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)]'
                  ]"
                >
                  {{ getInitials(requestDetail.checker?.full_name || '') }}
                </AvatarFallback>
              </Avatar>
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                {{ requestDetail.checker?.full_name || '-' }}
              </span>
            </div>
          </div>

          <div v-if="requestDetail.request_status === ReqCoaAccountStatus.REJECTED && (requestDetail as any).reject_reason" class="flex flex-col items-start gap-0.5 flex-1">
            <span class="font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-[#00000080] text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)]">
              Reason
            </span>
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
              {{ (requestDetail as any).reject_reason || '-' }}
            </span>
          </div>

          <!-- Action Buttons - Only show if PENDING -->
          <div v-if="showActionButtons" class="flex items-center gap-2 flex-1">
            <Button 
              class="flex-1 h-auto bg-[#ee443f] hover:bg-[#d93d38] text-white px-3 py-2.5 rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] transition-colors"
              @click="handleReject"
            >
              Reject
            </Button>
            <Button 
              class="flex-1 h-auto bg-[#07564d] hover:bg-[#064a42] text-white px-3 py-2.5 rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] transition-colors"
              @click="handleApprove"
            >
              Approve
            </Button>
          </div>
        </footer>
      </div>
    </DialogContent>
  </Dialog>
</template>
