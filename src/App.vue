<template>
  <NConfigProvider :theme-overrides="themeOverride" :theme="naiveTheme">
    <div class="h-screen">
      <RouterView />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  NConfigProvider,
  type GlobalThemeOverrides,
  lightTheme,
  darkTheme,
  useOsTheme
} from 'naive-ui'
import { setTheme } from '@tauri-apps/api/app'

const osTheme = useOsTheme()
const naiveTheme = computed(() => osTheme.value === 'dark' ? darkTheme : lightTheme)

const themeOverride: GlobalThemeOverrides = {
  common: {
    // primaryColor: '#6366f1',
    // primaryColorHover: '#8b5cf6',
    // primaryColorPressed: '#4f46e5',
    // primaryColorSuppl: '#818cf8'
  }
}

onMounted(() => {
  setTheme(null)
})
</script>
<style scoped></style>
