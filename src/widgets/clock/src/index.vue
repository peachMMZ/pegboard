<template>
  <div
    class="w-full h-full p-4 flex items-center justify-center text-xl font-bold"
    :style="containerStyle">
    <!-- 主时钟显示 -->
    <div class="text-center">
      <div class="time">
        <!-- 将每个字符包裹在固定宽度的span中 -->
        <span v-for="(char, index) in timeChars" :key="index" class="w-8 text-center inline-block">{{ char }}</span>
      </div>
      <div class="date">{{ formattedDate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useThemeVars } from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'

const props = defineProps<{ item: PegboardItem }>()

const themeVars = useThemeVars()

const containerStyle = computed(() => ({
  backgroundColor: themeVars.value.primaryColor,
  borderRadius: themeVars.value.borderRadius,
  color: themeVars.value.textColor1,
}))

// 时间状态
const currentTime = ref(new Date())
let timeUpdateTimer: number

const format = computed(() => props.item.props?.format.value || 'HH:mm')
const hour12 = computed(() => props.item.props?.hour12?.value ?? false)
const showDate = computed(() => props.item.props?.showDate?.value ?? true)
const showWeekday = computed(() => props.item.props?.showWeekday?.value ?? true)

const timeFormats = computed<Record<string, Intl.DateTimeFormatOptions>>(() => ({
  'HH:mm': { hour: '2-digit', minute: '2-digit', hour12: hour12.value },
  'HH:mm:ss': { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: hour12.value }
}))
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('zh-CN', timeFormats.value[format.value]).replace(/上午|下午/g, '').trim()
})

// 拆分时间字符为数组
const timeChars = computed(() => {
  return formattedTime.value.split('')
})

// 格式化日期
const formattedDate = computed(() => {
  const date = showDate.value ? currentTime.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-') : ''
  const weekday = showWeekday.value ? currentTime.value.toLocaleDateString('zh-CN', {
    weekday: 'short'
  }) : ''
  return `${date} ${weekday}`
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
  font-family: 'Digital-1';
  font-size: 4rem;
  letter-spacing: 2px;
}

.date {
  font-family: 'Digital-1';
  margin-top: 0.5rem;
  letter-spacing: 1px;
}
</style>
