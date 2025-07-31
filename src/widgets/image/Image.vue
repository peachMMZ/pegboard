<template>
  <div class="h-full w-full overflow-hidden" :style="containerStyle">
    <img
      v-if="item.props && item.props.src"
      :src="item.props.src.value"
      alt=""
      class="w-full h-full object-cover"
    >
  </div>
</template>

<script setup lang="ts" generic="T extends PegboardItem">
import { computed } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'

defineProps<{
  item: T,
}>()

const themeVars = useThemeVars()

const containerStyle = computed(() => ({
  borderRadius: themeVars.value.borderRadius,
}))
</script>
<style scoped>
</style>
