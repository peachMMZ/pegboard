import { PegboardItem } from '@/store/pegboard'

interface MarketplaceItem extends PegboardItem {
  label: string
  key: string
}

interface MarketplaceTab {
  label: string
  key: string
  items: MarketplaceItem[]
}

export const tabs: MarketplaceTab[] = [
  {
    label: '内置',
    key: 'builtin',
    items: [
      {
        id: 'builtin-clock',
        label: '基础时钟',
        key: 'builtin-clock',
        type: 'clock',
        component: '/clock/Clock.vue',
        x: 0,
        y: 0,
        w: 4,
        h: 2,
      },
    ]
  },
  { label: '官方', key: 'official', items: [] },
  { label: '社区', key: 'community', items: [] }
]
