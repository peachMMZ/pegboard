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
      <NButton type="primary" quaternary :render-icon="renderIcon(PlusCircle)"></NButton>
      <NButton type="primary" quaternary :render-icon="renderIcon(ChevronDownCircle, { color: themeVars.warningColor })"></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NInput,
  NButton,
  NIcon,
  useThemeVars
} from 'naive-ui'
import { Search, ChevronDownCircle, PlusCircle } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'

const themeVars = useThemeVars()
</script>
<style scoped></style>
