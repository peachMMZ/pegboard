<template>
  <component :is="widgetComponent" :item="item" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PegboardItem } from '@/store/pegboard'
import { resolveWidgetComponent } from '.'

const props = defineProps<{
  item: PegboardItem
}>()

const widgetComponent = computed(() => resolveWidgetComponent(props.item))
</script>
<style scoped></style>
