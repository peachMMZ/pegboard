<template>
  <div class="flex justify-between items-center">
    <div></div>
    <div class="basis-1/2">
      <NInput size="small">
        <template #suffix>
          <NIcon :component="Search"></NIcon>
        </template>
      </NInput>
    </div>
    <div class="flex items-center">
      <NButton type="primary" quaternary :render-icon="renderIcon(ChevronDown)"></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NInput,
  NButton,
  NIcon
} from 'naive-ui'
import { Search, ChevronDown } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
</script>
<style scoped></style>
