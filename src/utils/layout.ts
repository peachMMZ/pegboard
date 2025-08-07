import { PegboardItem } from '@/store/pegboard'

export const findSlot = (existingItems: PegboardItem[], w: number, h: number, cols = 12, rows = 6) => {
  const totalArea = cols * rows
  const usedArea = existingItems.reduce((acc, item) => acc + item.w * item.h, 0)
  const availableArea = totalArea - usedArea
  if (availableArea < w * h) {
    throw new Error('没有空位了(┬┬﹏┬┬)')
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
        if (y + h > rows) {
          throw new Error('没有空位了(┬┬﹏┬┬)')
        }
      }
    }
  }
  return { x, y }
}
