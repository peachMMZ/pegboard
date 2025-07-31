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
import { computed, watchEffect } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'
import { convertFileSrc } from '@tauri-apps/api/core'

const props = defineProps<{
  item: T,
}>()

const themeVars = useThemeVars()

const containerStyle = computed(() => ({
  borderRadius: themeVars.value.borderRadius,
}))

watchEffect(() => {
  if (props.item.props && props.item.props.path) {
    props.item.props.src.value = convertFileSrc(props.item.props.path.value)
  }
})
</script>
<style scoped>
</style>
