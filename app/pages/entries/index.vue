<script setup lang="ts">
import { useCoaAccountStore } from '~/stores/coaAccount'

definePageMeta({
  layout: 'sidebar',
})
const store = useCoaAccountStore()
onMounted(() => {
 
})
</script>

<template>
  <div >
    <h1 class="text-2xl font-bold text-center mt-10">COA Account</h1>
  </div>
</template>