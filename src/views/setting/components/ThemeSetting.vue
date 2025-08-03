<template>
  <div class="h-full px-32 py-4">
    <NForm>
      <NFormItem label="主题">
        <div class="flex items-center gap-x-2">
          <div
            v-for="theme in [lightTheme, darkTheme]" :key="theme.name"
            class="w-32 h-36 flex flex-col justify-center items-center gap-y-2 font-bold cursor-pointer hover:scale-102"
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
              border: `2px solid ${themeVars.borderColor}`,
              backgroundColor: themeVars.baseColor
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
        <div class="grid grid-cols-12 gap-2">
          <div v-for="item in presetColors" :key="item.color">
            <NTooltip>
              <template #trigger>
                <div
                  class="w-10 h-10 cursor-pointer hover:scale-102"
                  :style="{
                    border: item.color == themeVars.primaryColor ? `2px solid ${themeVars.textColor1}` : undefined,
                    borderRadius: themeVars.borderRadius,
                    backgroundColor: item.color
                  }"
                  @click="onSelectPresetColor(item)"
                ></div>
              </template>
              <span>{{ item.name }}</span>
            </NTooltip>
          </div>
          <NPopover class="w-64">
            <template #trigger>
              <div
                class="w-10 h-10 cursor-pointer hover:scale-102 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
                :style="{ borderRadius: themeVars.borderRadius }"
              >
              </div>
            </template>
            <div>
              <span>自定义</span>
              <NColorPicker :show-alpha="false" :value="themeVars.primaryColor" @update:value="themeStore.setPrimaryColor" />
            </div>
          </NPopover>
        </div>
      </NFormItem>
      <NFormItem label="背景">
        <SettingOption label="彩色背景" tooltip="dark模式下不可用">
          <NSwitch v-model:value="themeStore.colorfulBackground" :disabled="themeStore.theme === 'dark'" size="small" />
        </SettingOption>
      </NFormItem>
      <NFormItem label="字体大小">
        <div class="w-full flex items-center gap-x-4">
          <NSlider
            class="flex-1"
            :value="fontSizeValue"
            :min="10"
            :max="24"
            @update:value="themeStore.setFontSize"
          />
          <div class="min-w-16 text-center flex flex-col">
            <NText strong>Aa</NText>
            <NText depth="3" :style="{ fontSize: themeVars.fontSizeMini }">{{ fontSizeValue }}px</NText>
          </div>
        </div>
        <NCard embedded>
          <p class="mb-2">这是一段正文文本示例，展示当前字体大小的阅读效果。</p>
        </NCard>
      </NFormItem>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NForm,
  NFormItem,
  NIcon,
  NSwitch,
  NTooltip,
  NPopover,
  NColorPicker,
  NSlider,
  NText,
  NCard,
  lightTheme,
  darkTheme,
  useThemeVars,
} from 'naive-ui'
import { Computer } from 'lucide-vue-next'
import { SettingOption } from '@/components/SettingOption'
import { useThemeStore, Theme } from '@/store/theme'

const themeVars = useThemeVars()
const themeStore = useThemeStore()

const presetColors = [
  { name: 'Slate', color: '#94a3b8', hover: '#cbd5e1', pressed: '#64748b', suppl: '#e2e8f0' },
  { name: 'Gray', color: '#9ca3af', hover: '#d1d5db', pressed: '#6b7280', suppl: '#e5e7eb' },
  { name: 'Zinc', color: '#a1a1aa', hover: '#d4d4d8', pressed: '#71717a', suppl: '#e4e4e7' },
  { name: 'Neutral', color: '#a3a3a3', hover: '#d4d4d4', pressed: '#737373', suppl: '#e5e5e5' },
  { name: 'Stone', color: '#a8a29e', hover: '#d6d3d1', pressed: '#78716c', suppl: '#e7e5e4' },
  { name: 'Red', color: '#f87171', hover: '#fca5a5', pressed: '#ef4444', suppl: '#fecaca' },
  { name: 'Orange', color: '#fb923c', hover: '#fdb74a', pressed: '#f97316', suppl: '#fed7aa' },
  { name: 'Amber', color: '#fbbf24', hover: '#fcd34d', pressed: '#f59e0b', suppl: '#fde68a' },
  { name: 'Yellow', color: '#facc15', hover: '#fde047', pressed: '#eab308', suppl: '#fef08a' },
  { name: 'Lime', color: '#a3e635', hover: '#bef264', pressed: '#84cc16', suppl: '#d9f99d' },
  { name: 'Green', color: '#4ade80', hover: '#86efac', pressed: '#22c55e', suppl: '#bbf7d0' },
  { name: 'Emerald', color: '#34d399', hover: '#6ee7b7', pressed: '#10b981', suppl: '#a7f3d0' },
  { name: 'Teal', color: '#2dd4bf', hover: '#5eead4', pressed: '#14b8a6', suppl: '#99f6e4' },
  { name: 'Cyan', color: '#22d3ee', hover: '#67e8f9', pressed: '#06b6d4', suppl: '#a5f3fc' },
  { name: 'Sky', color: '#38bdf8', hover: '#7dd3fc', pressed: '#0ea5e9', suppl: '#bae6fd' },
  { name: 'Blue', color: '#60a5fa', hover: '#93c5fd', pressed: '#3b82f6', suppl: '#bfdbfe' },
  { name: 'Indigo', color: '#818cf8', hover: '#a5b4fc', pressed: '#6366f1', suppl: '#c7d2fe' },
  { name: 'Violet', color: '#a78bfa', hover: '#c4b5fd', pressed: '#8b5cf6', suppl: '#ddd6fe' },
  { name: 'Purple', color: '#c084fc', hover: '#d8b4fe', pressed: '#a855f7', suppl: '#e9d5ff' },
  { name: 'Fuchsia', color: '#e879f9', hover: '#f0abfc', pressed: '#d946ef', suppl: '#f5d0fe' },
  { name: 'Pink', color: '#f472b6', hover: '#f9a8d4', pressed: '#ec4899', suppl: '#fbcfe8' },
  { name: 'Rose', color: '#fb7185', hover: '#fda4af', pressed: '#f43f5e', suppl: '#fecdd3' }
]

function setTheme(theme: string) {
  if (theme === themeStore.theme) {
    return
  } else {
    themeStore.followOsTheme = false
    themeStore.theme = theme as Theme
  }
}

function onSelectPresetColor(colorStatus: typeof presetColors[0]) {
  if (!themeStore.themeOverride.common) {
    themeStore.themeOverride.common = {}
  }
  themeStore.themeOverride.common.primaryColor = colorStatus.color
  themeStore.themeOverride.common.primaryColorHover = colorStatus.hover
  themeStore.themeOverride.common.primaryColorPressed = colorStatus.pressed
  themeStore.themeOverride.common.primaryColorSuppl = colorStatus.suppl
}

const fontSizeValue = computed(() => parseInt(themeVars.value.fontSize.replace('px', '')))
</script>
<style scoped></style>
