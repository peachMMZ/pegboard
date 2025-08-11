import { PegboardItem } from '@/store/pegboard'
import { cloneDeep } from 'es-toolkit'

export function useArrowKeySelect(event: KeyboardEvent, items: PegboardItem[], selectedItem?: PegboardItem, cols = 12) {
  let newSelectedItem: PegboardItem | undefined

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    if (!selectedItem && items.length > 0) {
      newSelectedItem = items[0]
    }

    const sortedItems = cloneDeep(items)
    sortedItems.sort((a, b) => {
      const aIndex = a.x + a.y * cols
      const bIndex = b.x + b.y * cols
      return aIndex - bIndex
    })

    const selectedIndex = sortedItems.findIndex(item => item.id === selectedItem?.id)
    if (selectedIndex !== -1) {
      if (event.key === 'ArrowUp') {
        if (selectedIndex >= cols) {
          newSelectedItem = sortedItems[selectedIndex - cols]
        }
      } else if (event.key === 'ArrowDown') {
        if (selectedIndex < items.length - cols) {
          newSelectedItem = sortedItems[selectedIndex + cols]
        }
      } else if (event.key === 'ArrowLeft') {
        if (selectedIndex % cols !== 0) {
          newSelectedItem = sortedItems[selectedIndex - 1]
        }
      } else if (event.key === 'ArrowRight') {
        if (selectedIndex % cols !== cols - 1) {
          newSelectedItem = sortedItems[selectedIndex + 1]
        }
      }
    }
  }

  return {
    newSelectedItem
  }

}
