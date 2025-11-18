<script setup lang="ts">
import { useCoaAccountStore } from '~/stores/coaAccount'

definePageMeta({
  layout: 'sidebar',
})
const store = useCoaAccountStore()
onMounted(() => {
  console.log('COA Account Page Mounted')
   store.getCardList({
    page: 1,
    limit: 10
  })
})
</script>

<template>
  <div >
    <h1 class="text-2xl font-bold text-center mt-10">COA Account</h1>
  </div>
</template>