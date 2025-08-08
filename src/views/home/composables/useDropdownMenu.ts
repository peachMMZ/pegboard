import { ref, watchEffect,  MaybeRefOrGetter, toValue } from 'vue'
import { type DropdownOption } from 'naive-ui'
import { usePegboardStore } from '@/store/pegboard'
import { PegboardItem } from '@/store/pegboard'
import { renderIcon } from '@/utils/renderer'
import { Move, Palette, Play, Trash, Settings2 } from 'lucide-vue-next'
import { randomColor } from '@/utils/color'

export function useDropdownMenu(item?: MaybeRefOrGetter<PegboardItem | undefined>) {
  const pegboardStore = usePegboardStore()

  const options = ref<Array<DropdownOption & { action?: () => void }>>([])
  const settingVisible = ref(false)

  const getOptions = () => {
    const itemValue = toValue(item)
    options.value = [
      {
        label: '启动',
        key: 'launch',
        show: itemValue?.type === 'launcher',
        icon: renderIcon(Play),
        action: () => {
          if (itemValue) {
            pegboardStore.openApp(itemValue)
          }
        },
      },
      { type: 'divider', show: itemValue?.type === 'launcher' },
      {
        label: '设置',
        key: 'setting',
        show: itemValue?.props !== undefined && Object.keys(itemValue.props).length > 0,
        icon: renderIcon(Settings2),
        action: () => {
          const activeEl = document.activeElement as HTMLElement | null
          if (activeEl) {
            activeEl.blur()
          }
          settingVisible.value = true
        }
      },
      {
        label: '个性化',
        key: 'style',
        icon: renderIcon(Palette),
        action: () => {
          if (itemValue) {
            itemValue.color = randomColor('hex')
          }
        },
      },
      {
        label: '移动到',
        key: 'move',
        icon: renderIcon(Move),
        action: () => {
          if (itemValue) {
            pegboardStore.movingItems.push(itemValue)
            pegboardStore.miniViewVisible = true
          }
        },
      },
      { type: 'divider' },
      {
        label: '删除',
        key: 'delete',
        icon: renderIcon(Trash),
        action: () => {
          if (itemValue) {
            pegboardStore.removeItem(itemValue)
          }
        },
      },
    ]
  }

  watchEffect(() => {
    getOptions()
  })

  return {
    options,
    settingVisible,
  }
}
