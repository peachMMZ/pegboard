<template>
  <NElement
    class="w-full h-full p-2 overflow-hidden relative"
    style="border-radius: var(--border-radius);background-color: var(--primary-color);"
  >
    <div class="absolute top-0 left-0 w-full h-4" style="background-color: var(--primary-color-pressed);"></div>
    <NScrollbar class="h-full">
      <div
        class="whitespace-pre-wrap w-full h-full mt-2 leading-relaxed tracking-wide"
        :style="textStyle"
      >
        {{ item.props?.text.value }}
      </div>
    </NScrollbar>
  </NElement>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NElement, NScrollbar } from 'naive-ui'
import type { PegboardItem } from '@/store/pegboard'

const props = defineProps<{
  item: PegboardItem
}>()

const textStyle = computed(() => {
  if (props.item.props?.fontSize.value) {
    return {
      fontSize: props.item.props?.fontSize.value + 'px',
      fontWeight: props.item.props?.fontWeight.value
    }
  }
})

</script>
