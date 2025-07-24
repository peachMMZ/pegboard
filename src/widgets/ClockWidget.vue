<template>
  <div class="cyber-clock-container">
    <!-- 故障效果遮罩层 -->
    <div class="glitch-overlay"></div>

    <!-- 主时钟显示 -->
    <div class="clock-display">
      <div class="time-wrapper">
        <div class="time" :class="{ glitch: glitchEffect }">
          {{ formattedTime }}
          <span class="colon" :class="{ blink: showColon }"></span>
        </div>
        <div class="date">{{ formattedDate }}</div>
      </div>
    </div>

    <!-- 赛博朋克装饰元素 -->
    <div class="cyber-decoration top-left"></div>
    <div class="cyber-decoration top-right"></div>
    <div class="cyber-decoration bottom-left"></div>
    <div class="cyber-decoration bottom-right"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { PegboardItem } from '@/repository/pegboard'

defineProps<{ item: PegboardItem }>()

// 时间状态
const currentTime = ref(new Date())
const glitchEffect = ref(false)
const showColon = ref(true)
let timeUpdateTimer: number
let glitchTimer: number
let colonTimer: number

// 格式化时间 (HH:MM:SS)
const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/:/g, ' ')
})

// 格式化日期
const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short'
  }).replace(/\//g, '-')
})

// 赛博朋克故障效果
const triggerGlitch = () => {
  glitchEffect.value = true
  setTimeout(() => {
    glitchEffect.value = false
  }, 150)
}

onMounted(() => {
  // 更新时间
  timeUpdateTimer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)

  // 随机故障效果
  glitchTimer = window.setInterval(() => {
    if (Math.random() > 0.7) triggerGlitch()
  }, 5000)

  // 冒号闪烁
  colonTimer = window.setInterval(() => {
    showColon.value = !showColon.value
  }, 500)
})

onUnmounted(() => {
  clearInterval(timeUpdateTimer)
  clearInterval(glitchTimer)
  clearInterval(colonTimer)
})
</script>

<style scoped>
.cyber-clock-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #0d0221;
  border: 1px solid #ff2a6d;
  border-radius: 8px;
  padding: 1.5rem;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(255, 42, 109, 0.5), 0 0 30px rgba(52, 152, 219, 0.3);
}

/* 故障效果遮罩 */
.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(52, 152, 219, 0.1) 51%,
    transparent 52%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 2;
}

.clock-display {
  position: relative;
  z-index: 1;
}

.time-wrapper {
  text-align: center;
}

.time {
  font-family: 'Digital-1', monospace;
  font-size: 3.2rem;
  color: #05d9e8;
  letter-spacing: 4px;
  text-shadow: 0 0 5px rgba(5, 217, 232, 0.7), 0 0 10px rgba(5, 217, 232, 0.5);
  position: relative;
}

/* 故障效果动画 */
.glitch {
  animation: glitch 0.3s linear infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

/* 冒号闪烁效果 */
.colon {
  opacity: 1;
  transition: opacity 0.3s;
}

.blink {
  opacity: 0;
}

.date {
  font-family: 'Digital-1', monospace;
  font-size: 0.9rem;
  color: #ff2a6d;
  margin-top: 0.8rem;
  text-shadow: 0 0 3px rgba(255, 42, 109, 0.6);
  letter-spacing: 1px;
}

/* 赛博朋克边角装饰 */
.cyber-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #ff2a6d;
  border-style: solid;
}

.top-left {
  top: 10px;
  left: 10px;
  border-width: 2px 0 0 2px;
}

.top-right {
  top: 10px;
  right: 10px;
  border-width: 2px 2px 0 0;
}

.bottom-left {
  bottom: 10px;
  left: 10px;
  border-width: 0 0 2px 2px;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
  border-width: 0 2px 2px 0;
}
</style>
