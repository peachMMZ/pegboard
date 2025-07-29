<template>
  <div class="flex justify-between items-center">
    <div class="basis-1/4">
      <Weather />
    </div>
    <div class="basis-1/2"></div>
    <div class="basis-1/4 flex justify-end">
      <NButton v-if="isHomePage()" quaternary :render-icon="renderIcon(Columns)" @click="openMiniView"></NButton>
      <NButton quaternary :render-icon="renderIcon(ShoppingBag)" @click="goMarketplace"></NButton>
      <NButton quaternary :render-icon="renderIcon(Settings)"></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton
} from 'naive-ui'
import { Settings, ShoppingBag, Columns } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { useRouter } from 'vue-router'
import { usePegboardStore } from '@/store/pegboard'
import Weather from './Weather.vue'

const router = useRouter()
const pegboardStore = usePegboardStore()

const goMarketplace = () => {
  router.push({ name: 'marketplace' })
}
const isHomePage = () => {
  return router.currentRoute.value.name === 'home'
}
const openMiniView = () => {
  pegboardStore.miniViewVisible = true
}
</script>
<style scoped></style>
