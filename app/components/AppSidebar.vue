<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users 
} from "lucide-vue-next"
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})
const route = useRoute()
const isActive = (url: string) => {
  return route.path === url
}
// This is sample data - make it reactive using computed
const data = computed(() => ({
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Coa Accounts",
      url: "/coa-account",
      icon: Users,
      isActive: isActive("/coa-account"),
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
   
  ],
  projects: [
    {
      name: "Entries",
      url: "/entries",
      icon: Frame,
      isActive: isActive("/entries")
    },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
}))
const config = useRuntimeConfig()
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a href="#">
              <div class=" font-medium leading-[32px] not-italic relative shrink-0 text-[#07564d] text-[20px] text-center text-nowrap tracking-[-0.24px] whitespace-pre">
                 <ULink to="/"><img src="~/assets/img/logo/logo.svg" alt="" /></ULink>
              </div>
              <div class="flex flex-col gap-0.5 leading-none">
                 <ULink to="/"><span class="font-bold text-lg text-[#07564D]">{{ config.public.appName }}</span></ULink>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
