<template>
  <div class="w-fit flex items-center">
    <img class="w-6 cursor-pointer mx-2" :src="imgSrc" alt="weather icon" @mouseenter="dataVisible = true" @mouseleave="dataVisible = false">
    <Transition name="slide">
      <div v-show="dataVisible" class="h-full flex justify-start items-center gap-x-2">
        <div class="flex items-center gap-1">
          <NIcon :component="MapPin" :size="12"></NIcon>
          <span class="text-sm">{{ weatherData.location?.name }}</span>
        </div>
        <span class="text-sm">{{ weatherData.now?.text }}</span>
        <span :class="['text-sm', 'font-bold', temperatureColor]">{{ weatherData.now?.temperature }}°</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOsTheme, NIcon } from 'naive-ui'
import { MapPin } from 'lucide-vue-next'
import { fetch } from '@tauri-apps/plugin-http'
import { buildQueryParams } from '@/utils/http'

const osTheme = useOsTheme()

const weatherData = ref<any>({})
const loading = ref(false)
const dataVisible = ref(false)
const imgSrc = computed(() => {
  if (weatherData.value.now?.code) {
    return `/src/assets/image/weather/${osTheme.value === 'dark' ? 'white' : 'black'}/${weatherData.value.now?.code}@1x.png`
  } else {
    return '/src/assets/image/weather/white/99@1x.png'
  }
})
const temperatureColor = computed(() => {
  const temperature = weatherData.value.now?.temperature
  if (!temperature) {
    return ''
  }
  // 0-10 10-20 20-30 30-40
  if (temperature > 0 && temperature <= 10) {
    return 'text-cyan-400'
  } else if (temperature > 10 && temperature <= 20) {
    return 'text-blue-400'
  } else if (temperature > 20 && temperature <= 30) {
    return 'text-yellow-400'
  } else if (temperature > 30 && temperature <= 40) {
    return 'text-orange-400'
  } else if (temperature > 40) {
    return 'text-red-400'
  }
})

async function fetchWeatherData() {
  const params = buildQueryParams({
    key: import.meta.env.VITE_WEATHER_API_KEY,
    location: 'ip',
    language: 'zh-Hans',
    unit: 'c'
  })
  loading.value = true
  const res = await fetch(`${import.meta.env.VITE_WEATHER_API_URL}?${params}`)
  if (res.status === 200) {
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      weatherData.value = data.results[0]
    }
  }
  loading.value = false
}

onMounted(() => {
  fetchWeatherData()
  setInterval(() => {
    fetchWeatherData()
  }, 1000 * 60 * 5)
})
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
