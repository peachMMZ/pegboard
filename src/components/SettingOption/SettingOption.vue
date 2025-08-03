<template>
  <div class="w-full h-full">
    <NCard size="small" embedded content-class="">
      <div class="flex justify-between items-center">
        <div class="basis-1/3 flex items-center gap-x-2">
          <span>{{ label }}</span>
          <NTooltip v-if="tooltip">
            <template #trigger>
              <NIcon :component="CircleQuestionMark" />
            </template>
            <span>{{ tooltip }}</span>
          </NTooltip>
        </div>
        <div class="basis-1/3 flex justify-end">
          <slot></slot>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import {
  NCard,
  NIcon,
  NTooltip
} from 'naive-ui'
import { CircleQuestionMark } from 'lucide-vue-next'
import { SettingOptionProps } from './types'

defineProps<SettingOptionProps>()
</script>
<style scoped></style>
