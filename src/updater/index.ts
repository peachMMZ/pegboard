import { h } from 'vue'
import { NCard, NTag, createDiscreteApi } from 'naive-ui'
import { check, Update } from '@tauri-apps/plugin-updater'
import { useThemeStore } from '@/store/theme'

const updateNoticeContent = (update: Update) => {
  return h('div', [
    h(
      NCard,
      {
        title: '更新内容',
        size: 'small',
        headerExtra: () => h(NTag, { type: 'primary', size: 'tiny' }, { default: () => `v${update.version}` }),
        embedded: true
      },
      { default: () => update.body }
    )
  ])
}

export async function checkUpdate(options?: { showNoUpdatePrompt?: boolean }) {
  try {
    const update = await check()
    const themeStore = useThemeStore()
    const { dialog } = createDiscreteApi(['dialog'], { configProviderProps: { themeOverrides: themeStore.themeOverride } })
    if (update) {
      const dialogRef = dialog.create({
        title: '发现新版本( •̀ ω •́ )✧',
        content: () => updateNoticeContent(update),
        draggable: true,
        positiveText: '立即更新',
        onPositiveClick: async () => {
          dialogRef.loading = true
          dialogRef.negativeText = undefined
          dialogRef.closable = false
          dialogRef.maskClosable = false
          let downloaded = 0
          let contentLength = 0
          await update.downloadAndInstall((e) => {
            switch(e.event) {
              case 'Started':
                contentLength = e.data.contentLength || 0
                break
              case 'Progress':
                downloaded += e.data.chunkLength
                const percent = Math.round((downloaded / contentLength) * 100)
                dialogRef.positiveText = `${percent}%`
                break
              case 'Finished':
                break
            }
          })
        },
        negativeText: '稍后再说'
      })
    } else {
      if (options?.showNoUpdatePrompt) {
        dialog.create({
          title: '没有发现新版本(*￣3￣)╭',
          content: '当前版本已最新，无需更新',
        })
      }
    }
  } catch (error) {
    throw error
  }
}
