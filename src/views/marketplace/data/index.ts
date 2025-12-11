import { PegboardItem } from '@/store/pegboard'
import { findSlot } from '@/utils/layout'
import { plugins } from '@/widgets'

export type TabKey = 'builtin' | 'official' | 'community'

export interface MarketplaceItem extends PegboardItem {
  tab: TabKey
  label: string
}

export interface MarketplaceTab {
  label: string
  key: TabKey
}

export const itemList: MarketplaceItem[] = []

function getBuiltinItems() {
  const items: MarketplaceItem[] = []
  for (const path in plugins) {
    const module = plugins[path]
    const plugin = module.default
    if (plugin.hide) {
      continue
    }
    const { w, h } = plugin.meta.defaultSize
    const { x, y } = findSlot(items, w, h)
    items.push({
      tab: 'builtin',
      id: `builtin${plugin.type}`,
      widgetKey: plugin.key,
      label: plugin.meta.title,
      type: plugin.type,
      x,
      y,
      w,
      h,
      minH: plugin.meta.minSize?.h,
      minW: plugin.meta.minSize?.w,
      maxH: plugin.meta.maxSize?.h,
      maxW: plugin.meta.maxSize?.w,
      props: plugin.meta.props,
      resizable: plugin.meta.resizable
    })
  }
  return items
}

export function getTabItems(tab: TabKey) {
  if (tab === 'builtin') {
    return getBuiltinItems()
  }
  return itemList.filter((item) => item.tab === tab)
}

export const tabs: MarketplaceTab[] = [
  {
    label: '内置',
    key: 'builtin',
  },
  { label: '官方', key: 'official' },
  { label: '社区', key: 'community' }
]
