<script setup lang="ts">
import 'vue-sonner/style.css'
// @ts-ignore
import Toaster from '~/components/ui/sonner/Sonner.vue'
import { CommonLanguage } from './types/common'
const { locale, setLocale } = useI18n()
setLocale(CommonLanguage.VI)
</script>

<template>
  <main className="flex bg-[#f2f5f3]">
    <NuxtLayout>
       <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </main>
</template>
