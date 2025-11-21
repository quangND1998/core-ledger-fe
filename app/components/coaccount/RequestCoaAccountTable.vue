<script setup lang="ts">
import { Edit2, CheckCircle, X } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import type { IRequestCoaAccountData } from "~/types/requestCoaAccount";
import { ReqCoaAccountStatus, ReqCoaAccountType } from "~/types/requestCoaAccount";
import { useAvatar } from "~/composables/common";

defineProps<{
  requestData: IRequestCoaAccountData;
}>();

const { getAvatarBg, getAvatarColor, getInitials } = useAvatar();

// Helper function để lấy status badge classes
const getStatusBadgeClasses = (status: string) => {
  const statusMap: Record<string, { bg: string; color: string }> = {
    PENDING: { bg: 'bg-[#fff1df]', color: 'text-[#d2510e]' },
    APPROVED: { bg: 'bg-[#e4f6d2]', color: 'text-[#07564d]' },
    REJECTED: { bg: 'bg-[#f7e1e1]', color: 'text-[#641d1a]' },
  };

  const statusConfig = statusMap[status.toUpperCase()] || { bg: 'bg-white', color: 'text-black' };

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
  ];
};

// Helper function để format request type
const formatRequestType = (type: string) => {
  const typeMap: Record<string, string> = {
    CREATE: 'Create account',
    EDIT: 'Edit account',
  };
  return typeMap[type.toUpperCase()] || type;
};

// Helper function để format date
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function để check nếu có red dot (pending và có checker)
const hasRedDot = (request: any) => {
  return request.request_status === ReqCoaAccountStatus.PENDING && !request.checker;
};

// Helper function để check nếu show actions
const showActions = (request: any) => {
  return request.request_status === ReqCoaAccountStatus.PENDING;
};

// Helper function để check nếu chỉ show edit (rejected)
const showOnlyEdit = (request: any) => {
  return request.request_status === ReqCoaAccountStatus.REJECTED;
};
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow class="border-b border-[#dcdcdc] hover:bg-transparent">
        <TableHead class="w-[88px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          RECORD ID
        </TableHead>
        <TableHead class="w-[168px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          ACCOUNT NO.
        </TableHead>
        <TableHead class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          ACCOUNT NAME
        </TableHead>
        <TableHead class="w-[152px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          REQUEST TYPE
        </TableHead>
        <TableHead class="w-[136px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          REQUEST STATUS
        </TableHead>
        <TableHead class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          MAKER
        </TableHead>
        <TableHead class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          CHECKER
        </TableHead>
        <TableHead class="w-[148px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          CREATED DATE
        </TableHead>
        <TableHead class="w-[124px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
          ACTION
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="(request, index) in requestData.items"
        :key="request.id"
        :class="[
          'border-b border-[#efefef]',
          index % 2 === 0 ? 'bg-white hover:bg-[#f9f9f9]' : 'bg-[#f4f7f6] hover:bg-[#f4f7f6]/80'
        ]"
      >
        <!-- RECORD ID -->
        <TableCell class="w-[88px] h-[52px] px-3 py-0">
          <div class="flex items-center gap-1">
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
              {{ String(request.id).padStart(2, '0') }}
            </span>
            <div v-if="hasRedDot(request)" class="w-[5px] h-5">
              <div class="h-[5px] bg-[#ee443f] rounded-[2.5px]" />
            </div>
          </div>
        </TableCell>

        <!-- ACCOUNT NO -->
        <TableCell class="w-[168px] h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
          {{ request.data?.account_no || '-' }}
        </TableCell>

        <!-- ACCOUNT NAME -->
        <TableCell class="h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
          {{ request.data?.name || '-' }}
        </TableCell>

        <!-- REQUEST TYPE -->
        <TableCell class="w-[152px] h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
          {{ formatRequestType(request.request_type) }}
        </TableCell>

        <!-- REQUEST STATUS -->
        <TableCell class="w-[136px] h-[52px] px-3 py-0">
          <Badge :class="getStatusBadgeClasses(request.request_status)">
            {{ request.request_status === ReqCoaAccountStatus.PENDING ? 'Pending' : request.request_status === ReqCoaAccountStatus.APPROVED ? 'Approved' : 'Rejected' }}
          </Badge>
        </TableCell>

        <!-- MAKER -->
        <TableCell class="h-[52px] px-3 py-0">
          <div class="flex items-center gap-2">
            <Avatar :class="['w-6 h-6 rounded-md', getAvatarBg(index)]">
              <AvatarFallback
                :class="[
                  getAvatarBg(index),
                  getAvatarColor(getAvatarBg(index)),
                  'font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)]'
                ]"
              >
                {{ getInitials(request.maker?.full_name || '') }}
              </AvatarFallback>
            </Avatar>
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
              {{ request.maker?.full_name || '-' }}
            </span>
          </div>
        </TableCell>

        <!-- CHECKER -->
        <TableCell class="h-[52px] px-3 py-0">
          <template v-if="!request.checker">
            <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
              -
            </span>
          </template>
          <template v-else>
            <div class="flex items-center gap-2">
              <Avatar :class="['w-6 h-6 rounded-md', getAvatarBg(index + 1)]">
                <AvatarFallback
                  :class="[
                    getAvatarBg(index + 1),
                    getAvatarColor(getAvatarBg(index + 1)),
                    'font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)]'
                  ]"
                >
                  {{ getInitials(request.checker?.full_name || '') }}
                </AvatarFallback>
              </Avatar>
              <span class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                {{ request.checker?.full_name || '-' }}
              </span>
            </div>
          </template>
        </TableCell>

        <!-- CREATED DATE -->
        <TableCell class="w-[148px] h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
          {{ formatDate(request.created_at) }}
        </TableCell>

        <!-- ACTION -->
        <TableCell class="w-[124px] h-[52px] px-3 py-0">
          <div class="inline-flex justify-end gap-2">
            <template v-if="showActions(request)">
              <Button
                variant="ghost"
                size="icon"
                class="w-7 h-7 rounded-md"
              >
                <Edit2 class="w-4 h-4" />
              </Button>
              <template v-if="!showOnlyEdit(request)">
                <Button
                  variant="ghost"
                  size="icon"
                  class="w-7 h-7 rounded-md"
                >
                  <CheckCircle class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="w-7 h-7 rounded-md"
                >
                  <X class="w-4 h-4" />
                </Button>
              </template>
              <template v-else>
                <div class="w-7 h-7 rounded-md opacity-0" />
                <div class="w-7 h-7 rounded-md opacity-0" />
              </template>
            </template>
            <template v-else>
              <div class="w-7 h-7 rounded-md opacity-0" />
              <div class="w-7 h-7 rounded-md opacity-0" />
              <div class="w-7 h-7 rounded-md opacity-0" />
            </template>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

