<script setup lang="ts">

import Sidebar from './sidebar.vue'
const { t, setLocale } = useI18n()
const config = useRuntimeConfig()

const leftPanelRef = ref()
</script>

<template>
  <Sidebar/>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #888888;
}
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
</style>
