import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { GridLayoutItem } from '@/components/GridLayout'
import { convertFileSrc } from '@tauri-apps/api/core'
import { join, appDataDir } from '@tauri-apps/api/path'
import { icon } from 'tauri-plugin-fs-pro-api'
import { FastAverageColor } from 'fast-average-color'
import { LazyStore } from '@tauri-apps/plugin-store'

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
  const store = new LazyStore('pegboard.json')
  const pegboardList = ref<Pegboard[]>([])

  const init = async () => {
    const data = await store.get<Pegboard[]>('pegboardList')
    if (data) {
      pegboardList.value = data
    }
    if (pegboardList.value.length === 0) {
      pegboardList.value.push({
        id: Date.now(),
        name: '默认',
        items: []
      })
    }
    watch(pegboardList, async (val) => {
      await store.set('pegboardList', val)
    }, { deep: true })
  }

  const newItem = async (path: string, gridSize = 12) => {
    const existingItems = pegboardList.value.flatMap((p) => p.items)
    if (existingItems.some((i) => i.path === path)) {
      return Promise.reject('已存在')
    }

    // 找到可用的位置
    const w = 1
    const h = 1
    let x = 0
    let y = 0

    const findAvaiablePosition = () => {
      let found = false
      while(!found) {
        const overlap = existingItems.some((existing) => {
          return !(x + w <= existing.x ||
                x >= existing.x + existing.w ||
                y + h <= existing.y ||
                y >= existing.y + existing.h)
        })
        if (!overlap) {
          found = true
        } else {
          x += w
          if (x + w > gridSize) {
            x = 0
            y += h
          }
        }
      }
      return { x, y }
    }
    const { x: posX, y: posY } = findAvaiablePosition()
    const name = path.split('\\').pop()?.split('.')[0] || 'unknown'
    const fastAverageColor = new FastAverageColor()
    const iconDir = await join(await appDataDir(), 'icon', name)
    const iconPath = await icon(path, { size: 256, savePath: iconDir })
    const iconSrc = convertFileSrc(iconPath)
    const color = (await fastAverageColor.getColorAsync(iconSrc)).hex
    const item: PegboardItem = {
      id: Date.now(),
      name,
      x: posX,
      y: posY,
      w,
      h,
      path,
      color,
      icon: iconSrc
    }
    return item
  }

  const addItem = (pegboardId: number, item: PegboardItem) => {
    const pegboard = pegboardList.value.find((p) => p.id === pegboardId)
    if (pegboard) {
      pegboard.items.push(item)
    }
  }

  const removeItem = (pegboardId: number, itemId: number) => {
    const pegboard = pegboardList.value.find((p) => p.id === pegboardId)
    if (pegboard) {
      pegboard.items = pegboard.items.filter((i) => i.id !== itemId)
    }
  }

  return {
    pegboardList,
    init,
    newItem,
    addItem,
    removeItem,
  }
})
