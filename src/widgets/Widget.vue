<template>
  <component :is="widgetComponent" :item="item" v-bind="item.props" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PegboardItem } from '@/store/pegboard'
import { widgetTypeMapping, getWidgetComponent } from '.'

const props = defineProps<{
  item: PegboardItem
}>()

const widgetComponent = computed(() => {
  if (props.item.component) {
    return getWidgetComponent(props.item.component)
  } else if (props.item.type) {
    return widgetTypeMapping[props.item.type]
  }
})
</script>
<style scoped></style>
