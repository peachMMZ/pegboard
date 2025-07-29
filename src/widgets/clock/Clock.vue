<template>
  <div
    class="w-full h-full p-4 rounded-lg flex items-center justify-center text-xl font-bold"
    :style="containerStyle"><!-- 使用Tailwind布局和主题背景色 -->
    <!-- 主时钟显示 -->
    <div class="text-center">
      <div class="time">
        {{ formattedTime }}
      </div>
      <div class="date">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'

defineProps<{ item: PegboardItem }>()

const themeVars = useThemeVars()

const containerStyle = computed(() => ({
  backgroundColor: themeVars.value.primaryColor,
  color: themeVars.value.textColor1,
}))

// 时间状态
const currentTime = ref(new Date())
let timeUpdateTimer: number

// 格式化时间 (HH:MM:SS)
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

// 格式化日期
const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\//g, '-')
})

onMounted(() => {
  // 更新时间
  timeUpdateTimer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timeUpdateTimer)
})
</script>

<style scoped>
.time {
  font-family: 'Digital-1', monospace;
  font-size: 2.5rem;
  letter-spacing: 2px;
}

.date {
  font-family: 'Digital-1', monospace;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  letter-spacing: 1px;
}
</style>
