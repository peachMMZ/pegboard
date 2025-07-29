import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { GridLayoutItem } from '@/components/GridLayout'
import { convertFileSrc } from '@tauri-apps/api/core'
import { join, appDataDir, sep } from '@tauri-apps/api/path'
import { icon } from 'tauri-plugin-fs-pro-api'
import { FastAverageColor } from 'fast-average-color'
import { LazyStore } from '@tauri-apps/plugin-store'
import { openPath } from '@tauri-apps/plugin-opener'
import { remove } from '@tauri-apps/plugin-fs'

export interface Pegboard {
  id: number
  name: string
  sort?: number
  items: PegboardItem[]
}

export type PegboardItemType = 'launcher' | 'folder' | 'file' | 'clock' | 'image'

export interface PegboardItem extends GridLayoutItem {
  name?: string
  type: PegboardItemType
  iconPath?: string
  iconUrl?: string
  color?: string
  path?: string
}

export const usePegboardStore = defineStore('pegboard', () => {
  const store = new LazyStore('pegboard.json')
  const pegboardList = ref<Pegboard[]>([])
  const currentIndex = ref(0)
  const currentPegboard = computed(() => {
    return pegboardList.value[currentIndex.value]
  })
  const currentDirection = ref<'prev' | 'next'>('next')
  const miniViewVisible = ref(false)
  const movingItems = ref<PegboardItem[]>([])

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

  const sortPegboard = (direction: 'asc' | 'desc' = 'asc') => {
    const preId = currentPegboard.value.id
    pegboardList.value.sort((a, b) => {
      return direction === 'asc' ? (a.sort ?? Infinity) - (b.sort ?? Infinity) : (b.sort ?? Infinity) - (a.sort ?? Infinity)
    })
    const index = pegboardList.value.findIndex((p) => p.id === preId)
    if (index !== -1) {
      currentIndex.value = index
    }
  }

  const goToIndex = (index: number) => {
    // 记录当前导航方向
    currentDirection.value = index > currentIndex.value ? 'next' : 'prev'
    const maxIndex = pegboardList.value.length - 1
    if (index === 0) {
      currentIndex.value = Math.max(index, 0)
    } else {
      currentIndex.value = Math.min(index, maxIndex)
    }
  }

  const newPegboard = (name?: string) => {
    pegboardList.value.push({
      id: Date.now(),
      name: name || `新建${pegboardList.value.length + 1}`,
      sort: pegboardList.value.length + 1,
      items: []
    })
  }

  const removePegboard = (id: Pegboard['id']) => {
    const index = pegboardList.value.findIndex((p) => p.id === id)
    const result = pegboardList.value.filter((p) => p.id !== id)
    if (result.length === 0) {
      throw new Error('至少保留一个')
    }
    pegboardList.value = result
    currentIndex.value = index - 1
  }

  const moveItemToPegboard = (targetPegboardId: Pegboard['id']) => {
    if (movingItems.value.length === 0) {
      return
    }
    const targetPegboard = pegboardList.value.find((p) => p.id === targetPegboardId)
    if (!targetPegboard) {
      return
    }
    movingItems.value.forEach((item) => {
      try {
        const { x, y } = findAvaiablePosition(targetPegboardId, item.w, item.h)
        item.x = x
        item.y = y
        targetPegboard.items.push(item)
        if (targetPegboardId !== currentPegboard.value.id) {
          currentPegboard.value.items = currentPegboard.value.items.filter((i) => i.id !== item.id)
        }
      } catch (error) {
        console.error('移动项目失败', error)
      }
    })
    movingItems.value = []
  }

  const findAvaiablePosition = (pegboardId: number, w: number, h: number, cols = 12, rows = 6) => {
    const existingItems = pegboardList.value.find((p) => p.id === pegboardId)?.items || []
    const totalArea = cols * rows
    const usedArea = existingItems.reduce((acc, item) => acc + item.w * item.h, 0)
    const availableArea = totalArea - usedArea
    if (availableArea < w * h) {
      throw new Error('无可用位置')
    }
    let x = 0
    let y = 0
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
        if (x + w > cols) {
          x = 0
          y += h
        }
      }
    }
    return { x, y }
  }

  const newAppItem = async (pegboardId: number, path: string) => {
    const existingItems = pegboardList.value.flatMap((p) => p.items)
    if (existingItems.some((i) => i.path === path)) {
      return Promise.reject('已存在')
    }

    // 找到可用的位置
    const w = 1
    const h = 1
    let posX = 0
    let posY = 0

    try {
      const { x, y } = findAvaiablePosition(pegboardId, w, h)
      posX = x
      posY = y
    } catch (error) {
      return Promise.reject(error)
    }
    const name = path.split('\\').pop()?.split('.')[0] || 'unknown'
    const fastAverageColor = new FastAverageColor()
    const iconDir = await join(await appDataDir(), 'icon', name)
    const iconPath = await icon(path, { size: 256, savePath: iconDir })
    const iconSrc = convertFileSrc(iconPath)
    const color = (await fastAverageColor.getColorAsync(iconSrc)).hex
    const item: PegboardItem = {
      id: Date.now(),
      name,
      type: 'launcher',
      x: posX,
      y: posY,
      w,
      h,
      path,
      color,
      iconPath,
      iconUrl: iconSrc
    }
    return item
  }

  const addItem = (pegboardId: number, item: PegboardItem) => {
    const pegboard = pegboardList.value.find((p) => p.id === pegboardId)
    if (pegboard) {
      pegboard.items.push(item)
    }
  }

  const removeItem = (item: PegboardItem) => {
    const pegboard = pegboardList.value.find((p) => p.items.some((i) => i.id === item.id))
    if (pegboard) {
      const itemToRemove = pegboard.items.find((i) => i.id === item.id)
      if (itemToRemove && itemToRemove.iconPath) {
        const iconDirPath = itemToRemove.iconPath.split(sep()).slice(0, -1).join(sep())
        remove(iconDirPath, { recursive: true })
      }
      pegboard.items = pegboard.items.filter((i) => i.id !== item.id)
    }
  }

  const openApp = async (item: PegboardItem) => {
    if (item.type === 'launcher' && item.path) {
      await openPath(item.path)
    }
  }

  return {
    pegboardList,
    currentIndex,
    currentPegboard,
    currentDirection,
    miniViewVisible,
    movingItems,
    init,
    sortPegboard,
    goToIndex,
    newPegboard,
    removePegboard,
    moveItemToPegboard,
    newAppItem,
    addItem,
    removeItem,
    openApp
  }
})
