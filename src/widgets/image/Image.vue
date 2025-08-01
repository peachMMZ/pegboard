<template>
  <div class="h-full w-full overflow-hidden" :style="containerStyle">
    <img
      :src="src"
      alt=""
      class="w-full h-full object-cover"
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'
import { convertFileSrc } from '@tauri-apps/api/core'

const props = defineProps<{
  item: PegboardItem,
}>()

const themeVars = useThemeVars()

const containerStyle = computed(() => ({
  borderRadius: themeVars.value.borderRadius,
}))
const src = computed(() => {
  if (props.item.props && props.item.props.path.value) {
    return convertFileSrc(props.item.props.path.value)
  } else {
    return '/image/Luffy.png'
  }
})
</script>
<style scoped>
</style>
