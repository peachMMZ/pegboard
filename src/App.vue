<template>
  <NConfigProvider :theme-overrides="themeOverride" :theme="naiveTheme" :locale="zhCN">
    <NMessageProvider>
      <div class="h-screen">
        <RouterView />
      </div>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  type GlobalThemeOverrides,
  lightTheme,
  darkTheme,
  useOsTheme,
  zhCN
} from 'naive-ui'
import { setTheme } from '@tauri-apps/api/app'
import { usePegboardStore } from '@/store/pegboard'

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

const pegboardStore = usePegboardStore()

onMounted(async () => {
  setTheme(null)
  await pegboardStore.init()
})
</script>
<style scoped></style>
