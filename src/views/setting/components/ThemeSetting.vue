<template>
  <div class="h-full px-32 py-4">
    <NForm>
      <NFormItem label="主题">
        <div class="flex items-center gap-x-2">
          <div
            v-for="theme in [lightTheme, darkTheme]" :key="theme.name"
            class="w-32 h-36 flex flex-col justify-center items-center gap-y-2 text-xl font-bold cursor-pointer hover:scale-102"
            :style="{
              backgroundColor: theme.common.bodyColor,
              borderRadius: theme.common.borderRadius,
              color: theme.common.textColor1,
              border: theme.name === themeStore.theme ? `2px solid ${themeVars.primaryColor}` : '0px'
            }"
            @click="setTheme(theme.name)"
          >
            <div class="w-28 h-4" :style="{ backgroundColor: theme.common.successColor }"></div>
            <div class="w-28 h-4" :style="{ backgroundColor: theme.common.infoColor }"></div>
            <div class="w-28 h-4" :style="{ backgroundColor: theme.common.warningColor }"></div>
            <div class="w-28 h-4" :style="{ backgroundColor: theme.common.errorColor }"></div>
            <span>{{ theme.name }}</span>
          </div>
          <div
            class="w-32 h-36 flex flex-col justify-center items-center gap-y-2 text-xl font-bold"
            :style="{
              borderRadius: themeVars.borderRadius,
              border: `2px solid ${themeVars.borderColor}`
            }"
          >
            <NIcon :component="Computer" :size="48"></NIcon>
            <NTooltip>
              <template #trigger>
                <NSwitch v-model:value="themeStore.followOsTheme" size="small" />
              </template>
              <span>跟随系统主题</span>
            </NTooltip>
          </div>
        </div>
      </NFormItem>
      <NFormItem label="颜色">

      </NFormItem>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NIcon,
  NSwitch,
  NTooltip,
  lightTheme,
  darkTheme,
  useThemeVars,
} from 'naive-ui'
import { Computer } from 'lucide-vue-next'
import { useThemeStore, Theme } from '@/store/theme'

const themeVars = useThemeVars()
const themeStore = useThemeStore()

function setTheme(theme: string) {
  if (theme === themeStore.theme) {
    return
  } else {
    themeStore.followOsTheme = false
    themeStore.theme = theme as Theme
  }
}
</script>
<style scoped></style>
