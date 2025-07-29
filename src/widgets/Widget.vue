<template>
  <component :is="widgetTypeMapping[type]" />
</template>

<script setup lang="ts">
import { PegboardItemType } from '@/store/pegboard'
import { widgetTypeMapping } from '.'

defineProps<{
  type: PegboardItemType
}>()
</script>
<style scoped></style>
