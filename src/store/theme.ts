import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useOsTheme, type GlobalThemeOverrides } from 'naive-ui'
import { LazyStore } from '@tauri-apps/plugin-store'
import { setTheme } from '@tauri-apps/api/app'

export type Theme = 'light' | 'dark'

const defaultThemeOverride = (): GlobalThemeOverrides => {
  return {
    common: {
      primaryColor: '#6366F1',
      primaryColorHover: '#7C7FF5',
      primaryColorPressed: '#4F52D1',
      primaryColorSuppl: '#8A8CF7',
    }
  }
}

export const useThemeStore = defineStore('theme', () => {
  const store = new LazyStore('theme.json')
  const theme = ref<Theme>('light')
  const osTheme = useOsTheme()
  const followOsTheme = ref(true)
  const themeOverride = ref<GlobalThemeOverrides>(defaultThemeOverride())

  const init = async () => {
    theme.value = (await store.get<Theme>('theme')) || 'light'
    followOsTheme.value = (await store.get<boolean>('followOsTheme')) ?? true
    themeOverride.value = (await store.get<GlobalThemeOverrides>('themeOverride')) || defaultThemeOverride()
    watch(() => ({
      theme: theme.value,
      osTheme: osTheme.value,
      followOsTheme: followOsTheme.value,
      themeOverride: themeOverride.value
    }), async (val) => {
      if (val.followOsTheme && val.osTheme) {
        theme.value = val.osTheme
      }
      setTheme(val.followOsTheme ? null : val.theme)
      await store.set('theme', val.theme)
      await store.set('followOsTheme', val.followOsTheme)
      await store.set('themeOverride', val.themeOverride)
    }, { deep: true })
  }

  return {
    theme,
    osTheme,
    followOsTheme,
    themeOverride,
    init
  }
})
