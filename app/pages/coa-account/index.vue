<script setup lang="ts">
import { ChevronDown, Plus, Filter, Users } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import Pagination from "~/components/base/Pagination.vue";
import SearchInput from "~/components/base/SearchInput.vue";
import FilterPanel from "~/components/coaccount/FilterPanel.vue";
import RequestCoaAccountTable from "~/components/coaccount/RequestCoaAccountTable.vue";
import { useCoaAccountStore } from '~/stores/coaAccount';
import {Card, CardContent } from "~/components/ui/card";
import { useReqCoaAccountStore } from "~/stores/requestCoaAccount";

definePageMeta({
  layout: 'sidebar',
  title: "COA Accounts"
});



const store = useCoaAccountStore();
const storeRequestAccount = useReqCoaAccountStore()
const coaAccountResponse = computed(() => store.coaAccountData)
const requestCoaAccountResponse = computed(() => storeRequestAccount.requestCoaAccountData)
const activeTab = ref("account-list");
const payload = computed(() => store.payload)
const payloadRequest = computed(() => storeRequestAccount.payload)
// Sync search value từ store để giữ state khi chuyển tab
const searchValue = ref(store.payload.search || "")
const searchValueRequest = ref(storeRequestAccount.payload.search || "")
// Sync filter state từ store
const isFilterOpen = ref(store.filterState.isFilterOpen || false)

// Watch để sync searchValue khi payload thay đổi từ bên ngoài
watch(() => store.payload.search, (newValue) => {
  if (newValue !== searchValue.value) {
    searchValue.value = newValue || "";
  }
}, { immediate: true })

// Watch để sync filter state khi store thay đổi
watch(() => store.filterState.isFilterOpen, (newValue) => {
  if (newValue !== isFilterOpen.value) {
    isFilterOpen.value = newValue;
  }
}, { immediate: true })

// Watch để sync searchValueRequest khi payload thay đổi
watch(() => storeRequestAccount.payload.search, (newValue) => {
  if (newValue !== searchValueRequest.value) {
    searchValueRequest.value = newValue || "";
  }
}, { immediate: true })

// Tính toán pagination data với total_page
const paginationData = computed(() => {
  const data = coaAccountResponse.value;
  return {
    total: data.total,
    limit: data.limit,
    page: data.page,
    total_page: Math.ceil(data.total / data.limit), // Tính total_page nếu không có trong response
    next_page: data.next_page,
    prev_page: data.prev_page,
  };
});

// Tính toán pagination data cho request account
const paginationDataRequest = computed(() => {
  const data = requestCoaAccountResponse.value;
  return {
    total: data.total,
    limit: data.limit,
    page: data.page,
    total_page: Math.ceil(data.total / data.limit),
    next_page: data.next_page,
    prev_page: data.prev_page,
  };
});

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};

const fetchAccountList = async () => {
  store.getAccountList(payload.value);
}

const fetchRequestAccount = async () => {
      storeRequestAccount.fetchRequestAccountList(payloadRequest.value);
}

const handlePageChange = (page: number) => {
  payload.value.page = page;
  fetchAccountList();
};

const handlePageSizeChange = (pageSize: number) => {
  payload.value.limit = pageSize;
  payload.value.page = 1; // Reset về trang đầu khi thay đổi page size
  fetchAccountList();
};

const handleSearch = (value: string) => {
  searchValue.value = value;
  store.setPayload({
    ...payload.value,
    search: value,
    page: 1, // Reset về trang đầu khi search
  });
  fetchAccountList();
};

// Handlers cho Request Account tab
const handlePageChangeRequest = (page: number) => {
  payloadRequest.value.page = page;
  fetchRequestAccount();
};

const handlePageSizeChangeRequest = (pageSize: number) => {
  payloadRequest.value.limit = pageSize;
  payloadRequest.value.page = 1;
  fetchRequestAccount();
};

const handleSearchRequest = (value: string) => {
  searchValueRequest.value = value;
  payloadRequest.value.search = value;
  payloadRequest.value.page = 1;
  fetchRequestAccount();
};

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
  store.setFilterState({ isFilterOpen: isFilterOpen.value });
};

const handleFilterApply = (filters: any) => {
  // State đã được lưu trong FilterPanel, chỉ cần update payload
  store.setPayload({
    ...payload.value,
    types: filters.types || [],
    status: filters.statuses || [],
    currency: filters.currencies || [],
    providers: filters.providers || [],
    networks: filters.networks || [],
    page: 1, // Reset về trang đầu khi filter
  });
  fetchAccountList();
};

const handleFilterReset = () => {
  // Reset cả state trong store
  store.setFilterState({
    selectedTypes: [],
    selectedStatuses: [],
    selectedCurrencies: [],
    selectedProviders: [],
    selectedNetworks: [],
  });
  store.setPayload({
    ...payload.value,
    types: [],
    status: [],
    currency: [],
    providers: [],
    networks: [],
    page: 1,
  });
  fetchAccountList();
};

onMounted(() => {
  fetchAccountList()
  fetchRequestAccount()

});
</script>

<template>
  <section class="flex items-start gap-2.5 pl-6 pr-12 py-6 flex-1 self-stretch grow">
    <Card
      className="flex flex-col items-center flex-1 self-stretch grow bg-white rounded-[20px] overflow-hidden border border-solid border-[#0000001a]">
      <CardContent className="p-0 w-full">
        <header class="flex items-center justify-between px-8 py-6 w-full bg-transparent">
          <div class="inline-flex items-center gap-3">
            <div class="flex w-10 h-10 items-center justify-center gap-2.5 bg-[#07564c] rounded-[10px]">
              <Users class="w-5 h-5 text-white" />
            </div>
            <h1
              class="font-heading-XL-32-medium font-[number:var(--heading-XL-32-medium-font-weight)] text-black text-[length:var(--heading-XL-32-medium-font-size)] tracking-[var(--heading-XL-32-medium-letter-spacing)] leading-[var(--heading-XL-32-medium-line-height)] [font-style:var(--heading-XL-32-medium-font-style)]">
              Chart of Accounts
            </h1>
          </div>
        </header>

        <Tabs v-model="activeTab" default-value="account-list" class="w-full">
          <TabsList
            class="w-full h-auto justify-start px-8 pt-2.5 pb-0 bg-transparent border-b border-[#dcdcdc] rounded-none">
            <TabsTrigger value="account-list" @click="fetchAccountList()"
              class="h-9 px-7 py-0 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent data-[state=active]:bg-transparent font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black data-[state=inactive]:text-[#00000080] data-[state=active]:shadow-none">
              Account List
            </TabsTrigger>
            <TabsTrigger value="approval" @click="fetchRequestAccount()"
              class="h-9 px-7 py-0 gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent data-[state=active]:bg-transparent font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black data-[state=inactive]:text-[#00000080] data-[state=active]:shadow-none">
              Approval
              <Badge
                v-if="requestCoaAccountResponse.total_pending_request > 0"
                class="w-[18px] h-[18px] p-0 flex items-center justify-center bg-[#ee443f] rounded font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-white text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)] hover:bg-[#ee443f]">
                {{ requestCoaAccountResponse.total_pending_request }}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account-list" class="mt-0">
            <div class="flex h-20 items-center justify-between px-8 py-0 w-full border-b border-[#dcdcdc]">
              <SearchInput v-model="searchValue" placeholder="Search accounts" @search="handleSearch" />
              <div class="inline-flex items-center gap-2">
                <Button variant="outline"
                  class="w-[120px] h-auto gap-1.5 px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]">
                  Export
                  <ChevronDown class="w-3.5 h-3.5" />
                </Button>
                <Button
                  class="w-[164px] h-auto gap-1.5 px-3 py-2.5 bg-[#07564d] rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-white text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] hover:bg-[#07564d]/90">
                  Create account
                  <Plus class="w-3.5 h-3.5" />
                </Button>
                <Button variant="outline" size="icon" @click="toggleFilter" :class="[
                  'w-10 h-10 rounded-[10px] border border-solid transition-colors',
                  isFilterOpen
                    ? 'bg-[#e4f6d2] border-[#07564d] hover:bg-[#e4f6d2]/90'
                    : 'border-[#0000001a] hover:bg-gray-50'
                ]">
                  <Filter :class="['w-4 h-4', isFilterOpen ? 'text-[#07564d]' : '']" />
                </Button>
              </div>
            </div>

            <div class="flex flex-col items-end gap-4 px-8 py-6 flex-1 grow w-full bg-white">
              <div class="flex items-start gap-[18px] w-full relative">
                <div :class="[
                  'flex flex-col items-start rounded-[10px] overflow-hidden border border-solid border-[#dcdcdc] shadow-[0px_0px_20px_#00000008] bg-white transition-[flex-basis] duration-300 ease-out',
                  isFilterOpen ? 'flex-1 min-w-[600px]' : 'w-full'
                ]" style="will-change: flex-basis;">
                  <div class="w-full overflow-x-auto">
                    <CoaccountCoaAccountTable :account-data="coaAccountResponse" />
                  </div>
                </div>
                <FilterPanel v-model:open="isFilterOpen" @apply="handleFilterApply" @reset="handleFilterReset" />
              </div>

              <Pagination :pagination="paginationData" @page-change="handlePageChange"
                @page-size-change="handlePageSizeChange" />
            </div>
          </TabsContent>

          <TabsContent value="approval" class="mt-0">
            <div class="flex h-20 items-center justify-between px-8 py-0 w-full border-b border-[#dcdcdc]">
              <SearchInput
                v-model="searchValueRequest"
                placeholder="Search records"
                @search="handleSearchRequest"
              />
              <Button
                variant="outline"
                class="w-[212px] h-auto border border-solid border-[#0000001a] px-3 py-2.5 rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] text-center tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
              >
                View Account Code Rule
              </Button>
            </div>

            <div class="flex flex-col items-end gap-4 px-8 py-6 flex-1 grow w-full bg-white">
              <RequestCoaAccountTable :request-data="requestCoaAccountResponse" />
              
              <Pagination
                :pagination="paginationDataRequest"
                @page-change="handlePageChangeRequest"
                @page-size-change="handlePageSizeChangeRequest"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </section>
</template>