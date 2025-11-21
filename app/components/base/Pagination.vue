<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationData {
  total: number;
  limit: number;
  page: number;
  total_page?: number;
  next_page?: number | null;
  prev_page?: number | null;
}

interface Props {
  pagination: PaginationData;
  pageSizeOptions?: { value: string; label: string }[];
}

const props = withDefaults(defineProps<Props>(), {
  pageSizeOptions: () => [
    { value: '10', label: '10 line/page' },
    { value: '20', label: '20 line/page' },
    { value: '50', label: '50 line/page' },
  ],
});

const emit = defineEmits<{
  'page-change': [page: number];
  'page-size-change': [pageSize: number];
}>();

const currentPageSize = computed(() => props.pagination.limit.toString());
// Tính total_page: ưu tiên từ props, nếu không có thì tính từ total và limit
const totalPages = computed(() => {
  if (props.pagination.total_page !== undefined) {
    return props.pagination.total_page;
  }
  return Math.ceil(props.pagination.total / props.pagination.limit);
});
const currentPage = computed(() => props.pagination.page);

// Tính toán các trang cần hiển thị
const visiblePages = computed(() => {
  const pages: (number | 'ellipsis')[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    // Nếu tổng số trang <= 7, hiển thị tất cả
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Luôn hiển thị trang đầu
    pages.push(1);

    if (current <= 3) {
      // Nếu đang ở trang đầu (1-3)
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total - 1);
      pages.push(total);
    } else if (current >= total - 2) {
      // Nếu đang ở trang cuối (total-2 đến total)
      pages.push(2);
      pages.push('ellipsis');
      for (let i = total - 3; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Nếu đang ở giữa
      pages.push('ellipsis');
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(total);
    }
  }

  return pages;
});

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    emit('page-change', page);
  }
};

const handlePageSizeChange = (value: string | null) => {
  if (value) {
    const pageSize = parseInt(value, 10);
    emit('page-size-change', pageSize);
  }
};

const handlePrevPage = () => {
  if (props.pagination.prev_page !== null && props.pagination.prev_page !== undefined) {
    handlePageChange(props.pagination.prev_page);
  } else if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1);
  }
};

const handleNextPage = () => {
  if (props.pagination.next_page !== null && props.pagination.next_page !== undefined) {
    handlePageChange(props.pagination.next_page);
  } else if (currentPage.value < totalPages.value) {
    handlePageChange(currentPage.value + 1);
  }
};

const canGoPrev = computed(() => {
  return props.pagination.prev_page !== null || currentPage.value > 1;
});

const canGoNext = computed(() => {
  return props.pagination.next_page !== null || currentPage.value < totalPages.value;
});
</script>

<template>
  <div class="justify-center gap-3 inline-flex items-center">
    <Select :model-value="currentPageSize" @update:model-value="(value) => handlePageSizeChange(value as string | null)">
      <SelectTrigger class="w-[148px] h-10 px-3.5 py-0 bg-white rounded-[10px] border border-solid border-[#0000001a] shadow-[0px_1px_2px_#1018280d] font-body-14-m-regular font-[number:var(--body-14-m-regular-font-weight)] text-black text-[length:var(--body-14-m-regular-font-size)] tracking-[var(--body-14-m-regular-letter-spacing)] leading-[var(--body-14-m-regular-line-height)] [font-style:var(--body-14-m-regular-font-style)]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem 
          v-for="option in pageSizeOptions" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </SelectItem>
      </SelectContent>
    </Select>

    <div class="gap-1.5 inline-flex items-center">
      <Button
        variant="outline"
        size="icon"
        :disabled="!canGoPrev"
        @click="handlePrevPage"
        class="w-10 h-10 rounded-[10px] border border-solid border-[#0000001a] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft class="w-4 h-4" />
      </Button>

      <template v-for="(page, index) in visiblePages" :key="index">
        <Button
          v-if="page !== 'ellipsis'"
          :variant="page === currentPage ? 'default' : 'outline'"
          :class="[
            'w-10 h-auto px-3 py-2.5 rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]',
            page === currentPage
              ? 'bg-[#07564d] text-white hover:bg-[#07564d]/90'
              : 'border border-solid border-[#0000001a] text-black'
          ]"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </Button>
        <span
          v-else
          class="font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
        >
          ...
        </span>
      </template>

      <Button
        variant="outline"
        size="icon"
        :disabled="!canGoNext"
        @click="handleNextPage"
        class="w-10 h-10 rounded-[10px] border border-solid border-[#0000001a] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>

