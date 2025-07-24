<template>
  <div class="flex justify-between items-center">
    <div class="basis-1/4">
      <Weather />
    </div>
    <div class="basis-1/2"></div>
    <div class="basis-1/4 flex justify-end">
      <NButton quaternary :render-icon="renderIcon(LayoutDashboard)" @click="goMarketplace"></NButton>
      <NButton quaternary :render-icon="renderIcon(Settings)"></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton
} from 'naive-ui'
import { Settings, LayoutDashboard } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { useRouter } from 'vue-router'
import Weather from './Weather.vue'

const router = useRouter()

const goMarketplace = () => {
  router.push({ name: 'marketplace' })
}
</script>
<style scoped></style>
