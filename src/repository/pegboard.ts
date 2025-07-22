import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GridLayoutItem } from '@/components/GridLayout'

export interface Pegboard {
  id: number
  name?: string
  items: PegboardItem[]
}

export interface PegboardItem extends GridLayoutItem {
  name?: string
  icon?: string
  color?: string
  path?: string
}

export const usePegboardStore = defineStore('pegboard', () => {
  const pegboardList = ref<Pegboard[]>([
    {
      id: 1,
      name: '默认',
      items: [
        {
          id: 1,
          name: 'Bilibili',
          x: 1,
          y: 1,
          w: 2,
          h: 2,
          icon: '/icon/icon_bilibili.png',
          color: '#ff789f',
          path: 'C:\\Users\\Public\\Desktop\\哔哩哔哩.lnk'
        },
        {
          id: 2,
          name: 'QQ',
          x: 2,
          y: 0,
          w: 1,
          h: 1,
          icon: '/icon/icon_qq.png',
          color: '#e0d5d2',
          path: 'C:\\Users\\Public\\Desktop\\QQ.lnk'
        },
      ],
    },
    {
      id: 2,
      name: '自定义',
      items: [
        { id: 3, name: '自定义', x: 0, y: 0, w: 2, h: 2 },
        { id: 4, name: '自定义', x: 6, y: 0, w: 2, h: 2 },
      ],
    },
  ])

  return {
    pegboardList,
  }
})
