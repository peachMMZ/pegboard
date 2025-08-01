<template>
  <div class="tile" :style="tileStyle" @dblclick="openApp">
    <div class="tile-bg"></div>
    <div :class="['tile-icon', { 'tile-icon-mini': isMini }]">
      <NSpin :show="openning">
        <img :src="item.iconUrl || DefaultIcon" :alt="item.name" />
      </NSpin>
    </div>
    <div v-if="!isMini" class="tile-title">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, CSSProperties } from 'vue'
import {
  NSpin,
  useThemeVars
} from 'naive-ui'
import { usePegboardStore, PegboardItem } from '@/store/pegboard'
import { lighten } from '@/utils/color'
import DefaultIcon from '@/assets/vue.svg'

const props = defineProps<{ item: PegboardItem }>()

const themeVars = useThemeVars()
const pegboardStore = usePegboardStore()

const tileStyle = computed<CSSProperties>(() => {
  const c1 = props.item.color || themeVars.value.primaryColor || '#2196f3'
  const c2 = lighten(c1, 30)
  return {
    background: 'none',
    boxShadow: themeVars.value.boxShadow1,
    borderRadius: themeVars.value.borderRadius,
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.18s, box-shadow 0.18s',
    ['--tile-c1']: c1,
    ['--tile-c2']: c2
  }
})

const isMini = computed(() => {
  // 只要 w 或 h 不为 1 就显示 title
  return props.item.w === 1 && props.item.h === 1
})

const openning = ref(false)
function openApp() {
  openning.value = true
  pegboardStore.openApp(props.item).finally(() => {
    openning.value = false
  })
}

</script>

<style scoped>
.tile {
  user-select: none;
  will-change: transform, box-shadow;
}
.tile:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.16);
}
.tile-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(120deg, var(--tile-c1, #2196f3) 60%, var(--tile-c2, #6ec6ff) 100%);
}
.tile-icon {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 2;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.13);
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
.tile-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.tile-icon-mini {
  position: absolute;
  left: 50%;
  top: 50%;
  right: auto;
  transform: translate(-50%, -50%);
}
.tile-title {
  position: absolute;
  left: 14px;
  bottom: 12px;
  z-index: 2;
  text-shadow: 0 1px 2px rgba(0,0,0,0.10);
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}
</style>
