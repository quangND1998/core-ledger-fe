<script setup lang="ts">
import { Search, ChevronDown, Plus, Filter, ChevronLeft, ChevronRight, Users } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCoaAccountStore } from '~/stores/coaAccount';
import type { IGetCoaAccountListParams } from "~/types/coaAccount";

definePageMeta({
  layout: 'sidebar',
  title: "COA Accounts"
});

interface AccountData {
  id: string;
  accountNo: string;
  code: string;
  accountName: string;
  type: string;
  typeBg: string;
  typeColor: string;
  typeHover: string;
  currency: string;
  provider: string;
  network: string;
  status: string;
  statusBg: string;
  statusColor: string;
  statusHover: string;
  rowBg: string;
  rowHover: string;
}

const store = useCoaAccountStore();

const accountData: any[] = [
  {
  
    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
   
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
    
   
    type: "Equity",
    typeBg: "bg-[#fff1df]",
    typeColor: "text-[#d2510e]",
    typeHover: "hover:bg-[#fff1df]",
  
    status: "Locked",
    statusBg: "bg-[#f7e1e1]",
    statusColor: "text-[#641d1a]",
    statusHover: "hover:bg-[#f7e1e1]",
    rowBg: "bg-[#f2f5f3]",
    rowHover: "hover:bg-[#e8ebe9]"
  },
  {
   
    type: "Exp",
    typeBg: "bg-[#daedff]",
    typeColor: "text-[#192e53]",
    typeHover: "hover:bg-[#daedff]",
   
    status: "Inactive",
    statusBg: "bg-[#efefef]",
    statusColor: "text-[#000000b2]",
    statusHover: "hover:bg-[#efefef]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {

    type: "Liab",
    typeBg: "bg-[#f7e1e1]",
    typeColor: "text-[#641d1a]",
    typeHover: "hover:bg-[#f7e1e1]",

  
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
    
    type: "Rev",
    typeBg: "bg-[#efefef]",
    typeColor: "text-[#000000b2]",
    typeHover: "hover:bg-[#efefef]",
    
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
   
    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
   
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
  

    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
    
    status: "Inactive",
    statusBg: "bg-[#efefef]",
    statusColor: "text-[#000000b2]",
    statusHover: "hover:bg-[#efefef]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
    
    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
   
    status: "Inactive",
    statusBg: "bg-[#efefef]",
    statusColor: "text-[#000000b2]",
    statusHover: "hover:bg-[#efefef]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
  
   
    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
   
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  },
  {
   
    type: "Asset",
    typeBg: "bg-[#e4f6d2]",
    typeColor: "text-[#07564d]",
    typeHover: "hover:bg-[#e4f6d2]",
   
    status: "Active",
    statusBg: "bg-[#e4f6d2]",
    statusColor: "text-[#07564d]",
    statusHover: "hover:bg-[#e4f6d2]",
    rowBg: "bg-white",
    rowHover: "hover:bg-[#f9f9f9]"
  }
];

const coaAccountResponse = computed(() => store.coaAccountData)
const activeTab = ref("account-list");
const pageSize = ref("10");
const filterAccount = reactive<IGetCoaAccountListParams>({
  page: 1,
  limit: 10,
  search: "",
  type: [],
  currency: [],
  providers: [],
  networks: [],
  status: [],
});



const handleTabChange = (tab: string) => {
  activeTab.value = tab;
};


const fetchAccountList = async (filterAccount: IGetCoaAccountListParams) => {
  store.getAccountList(filterAccount);
}
onMounted(() => {
  fetchAccountList(filterAccount)
});
</script>

<template>
  <section class="flex items-start gap-2.5 pl-6 pr-12 py-6 flex-1 self-stretch grow">

    <div class="flex flex-col items-center flex-1 self-stretch grow bg-white rounded-[20px] overflow-hidden border border-solid border-[#0000001a]">
      <header class="flex items-center justify-between px-8 py-6 w-full bg-transparent">
        <div class="inline-flex items-center gap-3">
          <div class="flex w-10 h-10 items-center justify-center gap-2.5 bg-[#07564c] rounded-[10px]">
            <Users class="w-5 h-5 text-white" />
          </div>
          <h1 class="font-heading-XL-32-medium font-[number:var(--heading-XL-32-medium-font-weight)] text-black text-[length:var(--heading-XL-32-medium-font-size)] tracking-[var(--heading-XL-32-medium-letter-spacing)] leading-[var(--heading-XL-32-medium-line-height)] [font-style:var(--heading-XL-32-medium-font-style)]">
            Chart of Accounts
          </h1>
        </div>
        <!-- <div class="inline-flex items-center gap-2.5">
          <Avatar class="w-10 h-10 bg-[#e3f5d2] rounded-[10px]">
            <AvatarFallback class="bg-[#e3f5d2] font-label-m-16-medium font-[number:var(--label-m-16-medium-font-weight)] text-[#07564c] text-[length:var(--label-m-16-medium-font-size)] tracking-[var(--label-m-16-medium-letter-spacing)] leading-[var(--label-m-16-medium-line-height)] [font-style:var(--label-m-16-medium-font-style)]">
              QN
            </AvatarFallback>
          </Avatar>
          <div class="inline-flex flex-col items-start gap-1">
            <div class="font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
              Quang Ngoc
            </div>
            <Badge class="h-5 px-2.5 py-0 bg-[#f2f5f3] rounded border-[0.5px] border-solid border-[#0000001a] font-body-12-s-medium font-[number:var(--body-12-s-medium-font-weight)] text-black text-[length:var(--body-12-s-medium-font-size)] tracking-[var(--body-12-s-medium-letter-spacing)] leading-[var(--body-12-s-medium-line-height)] [font-style:var(--body-12-s-medium-font-style)] hover:bg-[#f2f5f3]">
              Checker
            </Badge>
          </div>
          <ChevronDown class="w-4 h-4" />
        </div> -->
      </header>

      <Tabs v-model="activeTab" default-value="account-list" class="w-full">
        <TabsList class="w-full h-auto justify-start px-8 pt-2.5 pb-0 bg-transparent border-b border-[#dcdcdc] rounded-none">
          <TabsTrigger
            value="account-list"
            @click="fetchAccountList(filterAccount)"
            class="h-9 px-7 py-0 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent data-[state=active]:bg-transparent font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black data-[state=inactive]:text-[#00000080] data-[state=active]:shadow-none"
          >
            Account List
          </TabsTrigger>
          <TabsTrigger
            value="approval"
            class="h-9 px-7 py-0 gap-2 data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent data-[state=active]:bg-transparent font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)] data-[state=active]:text-black data-[state=inactive]:text-[#00000080] data-[state=active]:shadow-none"
          >
            Approval
            <Badge class="w-[18px] h-[18px] p-0 flex items-center justify-center bg-[#ee443f] rounded font-caption-m-10-semibold font-[number:var(--caption-m-10-semibold-font-weight)] text-white text-[length:var(--caption-m-10-semibold-font-size)] tracking-[var(--caption-m-10-semibold-letter-spacing)] leading-[var(--caption-m-10-semibold-line-height)] [font-style:var(--caption-m-10-semibold-font-style)] hover:bg-[#ee443f]">
              12
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account-list" class="mt-0">
          <div class="flex h-20 items-center justify-between px-8 py-0 w-full border-b border-[#dcdcdc]">
            <div class="inline-flex items-center gap-2 flex-1">
              <Search class="w-[18px] h-[18px] text-[#00000080]" />
              <Input
                placeholder="Search accounts"
                class="border-0 shadow-none font-label-m-16-medium font-[number:var(--label-m-16-medium-font-weight)] text-[#00000080] text-[length:var(--label-m-16-medium-font-size)] tracking-[var(--label-m-16-medium-letter-spacing)] leading-[var(--label-m-16-medium-line-height)] [font-style:var(--label-m-16-medium-font-style)] focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </div>
            <div class="inline-flex items-center gap-2">
              <Button
                variant="outline"
                class="w-[120px] h-auto gap-1.5 px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
              >
                Export
                <ChevronDown class="w-3.5 h-3.5" />
              </Button>
              <Button class="w-[164px] h-auto gap-1.5 px-3 py-2.5 bg-[#07564d] rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-white text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] hover:bg-[#07564d]/90">
                Create account
                <Plus class="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                class="w-10 h-10 rounded-[10px] border border-solid border-[#0000001a]"
              >
                <Filter class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4 px-8 py-6 flex-1 grow w-full bg-white">
            <div class="flex flex-col items-start rounded-[10px] overflow-hidden border border-solid border-[#dcdcdc] shadow-[0px_0px_20px_#00000008] w-full bg-white">
                 <CoaccountCoaAccountTable :account-data="coaAccountResponse"/>
            </div>

            <div class="justify-center gap-3 inline-flex items-center">
              <Select v-model="pageSize" default-value="10">
                <SelectTrigger class="w-[148px] h-10 px-3.5 py-0 bg-white rounded-[10px] border border-solid border-[#0000001a] shadow-[0px_1px_2px_#1018280d] font-body-14-m-regular font-[number:var(--body-14-m-regular-font-weight)] text-black text-[length:var(--body-14-m-regular-font-size)] tracking-[var(--body-14-m-regular-letter-spacing)] leading-[var(--body-14-m-regular-line-height)] [font-style:var(--body-14-m-regular-font-style)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 line/page</SelectItem>
                  <SelectItem value="20">20 line/page</SelectItem>
                  <SelectItem value="50">50 line/page</SelectItem>
                </SelectContent>
              </Select>

              <div class="gap-1.5 inline-flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  class="w-10 h-10 rounded-[10px] border border-solid border-[#0000001a]"
                >
                  <ChevronLeft class="w-4 h-4" />
                </Button>
                <Button class="w-10 h-auto px-3 py-2.5 bg-[#07564d] rounded-[10px] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-white text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)] hover:bg-[#07564d]/90">
                  1
                </Button>
                <Button
                  variant="outline"
                  class="w-10 h-auto px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
                >
                  2
                </Button>
                <Button
                  variant="outline"
                  class="w-10 h-auto px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
                >
                  3
                </Button>
                <span class="font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]">
                  ...
                </span>
                <Button
                  variant="outline"
                  class="w-10 h-auto px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
                >
                  8
                </Button>
                <Button
                  variant="outline"
                  class="w-10 h-auto px-3 py-2.5 rounded-[10px] border border-solid border-[#0000001a] font-button-s-14-medium font-[number:var(--button-s-14-medium-font-weight)] text-black text-[length:var(--button-s-14-medium-font-size)] tracking-[var(--button-s-14-medium-letter-spacing)] leading-[var(--button-s-14-medium-line-height)] [font-style:var(--button-s-14-medium-font-style)]"
                >
                  9
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  class="w-10 h-10 rounded-[10px] border border-solid border-[#0000001a]"
                >
                  <ChevronRight class="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </section>
</template>