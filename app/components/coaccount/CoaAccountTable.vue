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
import type  { ICoaAccountResponse } from "~/types/coaAccount";

 defineProps<{
  accountData: ICoaAccountResponse
}>()





</script>

<template>
    <Table>
        <TableHeader>
            <TableRow class="border-b border-[#dcdcdc] hover:bg-transparent">
                <TableHead
                    class="w-[52px] h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    ID
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    ACCOUNT NO
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    CODE
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    ACCOUNT NAME
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    TYPE
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    CURRENCY
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    PROVIDER
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    NETWORK
                </TableHead>
                <TableHead
                    class="h-12 px-3 py-0 font-caption-l-12-semibold font-[number:var(--caption-l-12-semibold-font-weight)] text-[#00000080] text-[length:var(--caption-l-12-semibold-font-size)] tracking-[var(--caption-l-12-semibold-letter-spacing)] leading-[var(--caption-l-12-semibold-line-height)] [font-style:var(--caption-l-12-semibold-font-style)]">
                    STATUS
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(account, index) in accountData.items" :key="index"
                :class="['bg-white', 'border-b border-[#efefef]', 'hover:bg-[#f9f9f9]']">
                <TableCell
                    class="w-[52px] h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ account.id }}
                </TableCell>
                <TableCell
                    class="h-[52px] px-3 py-0 [font-family:'Space_Grotesk',Helvetica] font-semibold text-[#07564c] text-sm tracking-[-0.17px] leading-5">
                    {{ account.account_no }}
                </TableCell>
                <TableCell class="h-[52px] px-3 py-0">
                    <Badge
                        class="h-6 px-1.5 py-0 bg-white rounded border border-solid border-[#0000001a] [font-family:'Space_Grotesk',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 hover:bg-white">
                        {{ account.code }}
                    </Badge>
                </TableCell>
                <TableCell
                    class="h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ account.name }}
                </TableCell>
                <TableCell class="h-[52px] px-3 py-0">
                    <!-- <Badge
                        :class="[account.typeBg, 'h-6 px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)]', account.typeColor, 'text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]', account.typeHover]">
                        {{ account.type }}
                    </Badge> -->
                     <Badge
                        :class="[ 'h-6 px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)]', 'text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]']">
                        {{ account.type }}
                    </Badge>
                    
                </TableCell>
                <TableCell
                    class="h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-[#00000080] text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ account.currency }}
                </TableCell>
                <TableCell
                    class="h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ account.provider }}
                </TableCell>
                <TableCell
                    class="h-[52px] px-3 py-0 font-label-s-14-medium font-[number:var(--label-s-14-medium-font-weight)] text-black text-[length:var(--label-s-14-medium-font-size)] tracking-[var(--label-s-14-medium-letter-spacing)] leading-[var(--label-s-14-medium-line-height)] [font-style:var(--label-s-14-medium-font-style)]">
                    {{ account.network }}
                </TableCell>
                <TableCell class="h-[52px] px-3 py-0">
                    <!-- <Badge
                        :class="[account.statusBg, 'h-6 px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)]', account.statusColor, 'text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]', account.statusHover]">
                        {{ account.status }}
                    </Badge> -->
                     <Badge
                        :class="[ 'h-6 px-2.5 py-0 rounded border border-solid border-[#0000001a] font-caption-l-12-medium font-[number:var(--caption-l-12-medium-font-weight)]', 'text-[length:var(--caption-l-12-medium-font-size)] tracking-[var(--caption-l-12-medium-letter-spacing)] leading-[var(--caption-l-12-medium-line-height)] [font-style:var(--caption-l-12-medium-font-style)]']">
                        {{ account.status }}
                    </Badge>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>