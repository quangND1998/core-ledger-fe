<script setup lang="ts">
// @ts-ignore
import Toaster from '~/components/ui/sonner/Sonner.vue'
</script>

<template>
  <main className="flex bg-[#f2f5f3]" >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </main>
</template>
