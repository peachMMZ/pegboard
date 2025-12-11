<template>
  <NConfigProvider :theme-overrides="themeStore.themeOverride" :theme="naiveTheme" :locale="zhCN">
    <NGlobalStyle />
    <NMessageProvider placement="bottom">
      <NDialogProvider>
        <div class="h-screen" tabindex="0" @keydown="handleKeyDown" @keyup="handleKeyUp">
          <RouterView />
        </div>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NDialogProvider,
  lightTheme,
  darkTheme,
  zhCN
} from 'naive-ui'
import { usePegboardStore } from '@/store/pegboard'
import { useThemeStore } from '@/store/theme'
import { emit } from '@tauri-apps/api/event'

const pegboardStore = usePegboardStore()
const themeStore = useThemeStore()

const naiveTheme = computed(() => themeStore.theme === 'dark' ? darkTheme : lightTheme)

function keyboardEventPayload(event: KeyboardEvent) {
  return {
    type: event.type,
    code: event.code,
    key: event.key,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey
  }
}
function handleKeyDown(event: KeyboardEvent) {
  emit('pegboard://key-down', keyboardEventPayload(event))
}
function handleKeyUp(event: KeyboardEvent) {
  emit('pegboard://key-up', keyboardEventPayload(event))
}

onMounted(async () => {
  await pegboardStore.init()
  await themeStore.init()
})
</script>
<style scoped></style>
