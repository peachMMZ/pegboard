<template>
  <NConfigProvider :theme-overrides="themeStore.themeOverride" :theme="naiveTheme" :locale="zhCN">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
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
  NGlobalStyle,
  NMessageProvider,
  lightTheme,
  darkTheme,
  zhCN
} from 'naive-ui'
import { usePegboardStore } from '@/store/pegboard'
import { useThemeStore } from '@/store/theme'

const pegboardStore = usePegboardStore()
const themeStore = useThemeStore()

const naiveTheme = computed(() => themeStore.theme === 'dark' ? darkTheme : lightTheme)

onMounted(async () => {
  await pegboardStore.init()
  await themeStore.init()
})
</script>
<style scoped></style>
