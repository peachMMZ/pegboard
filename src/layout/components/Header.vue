<template>
  <div class="flex justify-between items-center">
    <div class="basis-1/4">
      <NButton quaternary :render-icon="renderIcon(ChevronLeft)" @click="$router.back()"></NButton>
    </div>
    <div class="basis-1/2 flex justify-center">
      <NInput size="small">
        <template #suffix>
          <NIcon :component="Search"></NIcon>
        </template>
      </NInput>
    </div>
    <div class="basis-1/4 flex justify-end items-center">
      <NButton type="primary" quaternary :render-icon="renderIcon(PlusCircle)"></NButton>
      <NButton
        type="primary"
        quaternary
        :render-icon="renderIcon(ChevronDownCircle, { color: themeVars.warningColor })"
        @click="hide"
      ></NButton>
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
import { Search, ChevronDownCircle, PlusCircle, ChevronLeft } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { getAllWindows } from '@tauri-apps/api/window'

async function hide() {
  const windows = await getAllWindows()
  windows.forEach((window) => {
    window.hide()
  })
}

const themeVars = useThemeVars()
</script>
<style scoped></style>
