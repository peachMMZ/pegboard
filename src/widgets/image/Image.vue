<template>
  <div ref="containerRef" class="h-full w-full overflow-hidden" :style="containerStyle">
    <img
      :src="src"
      alt=""
      :style="imgStyle"
    >
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, type CSSProperties } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'
import { convertFileSrc } from '@tauri-apps/api/core'

const props = defineProps<{
  item: PegboardItem,
}>()

const themeVars = useThemeVars()

const containerRef = useTemplateRef('containerRef')
const containerStyle = computed<CSSProperties>(() => ({
  borderRadius: themeVars.value.borderRadius,
}))
const imgStyle = computed<CSSProperties>(() => {
  const dynamicScale = props.item.props?.dynamicScale?.value ?? true
  let scale = 1
  if (dynamicScale) {
    const width = containerRef.value?.clientWidth || 0
    const height = containerRef.value?.clientHeight || 0
    const rotation = props.item.props?.rotate?.value || 0
    const radians = rotation * Math.PI / 180
    const cos = Math.abs(Math.cos(radians))
    const sin = Math.abs(Math.sin(radians))
    const rotatedWidth = width * cos + height * sin
    const rotatedHeight = width * sin + height * cos
    const scaleX = rotatedWidth / width
    const scaleY = rotatedHeight / height
    scale = Math.max(scaleX, scaleY)
  }
  return {
    rotate: props.item.props && props.item.props.rotate ? `${props.item.props.rotate.value}deg` : '0deg',
    scale: scale,
    objectFit: 'cover',
    width: '100%',
    height: 'auto',
    transition: 'all 0.3s ease-in-out'
  }
})

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
