import { PegboardItem } from '@/store/pegboard'

export type TabKey = 'builtin' | 'official' | 'community'

export interface MarketplaceItem extends PegboardItem {
  tab: TabKey
  label: string
}

export interface MarketplaceTab {
  label: string
  key: TabKey
}

export const widgetMetadataList: MarketplaceItem[] = [
  {
    tab: 'builtin',
    id: 'builtin-clock',
    label: '基础时钟',
    type: 'clock',
    component: '/clock/Clock.vue',
    x: 0,
    y: 0,
    w: 4,
    h: 2,
  },
  {
    tab: 'builtin',
    id: 'builtin-image',
    label: '图片',
    type: 'image',
    x: 4,
    y: 0,
    w: 4,
    h: 2,
    props: {
      path: { label: '图片路径', type: 'file', editable: true, value: undefined },
      rotate: {
        label: '旋转角度',
        type: 'number',
        editable: true,
        value: 0,
        min: 0,
        max: 360,
      },
      dynamicScale: { label: '动态缩放', type: 'boolean', editable: true, value: true },
    },
  },
]

export function getTabItems(tab: string) {
  return widgetMetadataList.filter((item) => item.tab === tab)
}

export const tabs: MarketplaceTab[] = [
  {
    label: '内置',
    key: 'builtin',
  },
  { label: '官方', key: 'official' },
  { label: '社区', key: 'community' }
]
