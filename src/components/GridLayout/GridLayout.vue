<template>
  <div ref="containerRef" class="pegboard-grid" :style="containerStyle">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="grid-item"
      :class="itemClass"
      :style="getItemStyle(item)"
      @mousedown="startLongPress"
      @mouseup="cancelLongPress"
    >
      <slot name="item" :item="item" :index="index">
        <!-- 默认内容 -->
        <div v-if="resizable" class="resize-handle"></div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends GridLayoutItem">
import { ref, computed, onMounted, watchEffect, nextTick } from 'vue'
import interact from 'interactjs'
import { Interactable } from '@interactjs/core/Interactable'
import { GridLayoutProps, GridLayoutItem } from './types'

const {
  cols = 12,
  rows = 6,
  minHeight = 100,
  minWidth = 100,
  collision = false,
  gapX = 0,
  gapY = 0,
  dragTimeout = 200,
  draggable = true,
  resizable = true
} = defineProps<GridLayoutProps>()

const items = defineModel<T[]>('value', { default: [] })
const emits = defineEmits<{
  (e: 'update', item: GridLayoutItem): void,
  (e: 'drag-start', item: GridLayoutItem, index: number): void,
  (e: 'drag-end'): void,
  (e: 'drag-cancel'): void,
}>()

const containerRef = ref<HTMLElement | null>(null)
const gridSize = computed(() => {
  const width = containerRef.value?.offsetWidth || 0
  const height = containerRef.value?.offsetHeight || 0
  return {
    width: Math.floor(width / cols - gapX),
    height: Math.floor(height / rows - gapY)
  }
})
const containerStyle = computed(() => {
  const width = containerRef.value?.offsetWidth || 0
  const height = containerRef.value?.offsetHeight || 0
  const gridTotalWidth = gridSize.value.width * cols + gapX * (cols - 1)
  const gridTotalHeight = gridSize.value.height * rows + gapY * (rows - 1)
  const paddingX = (width - gridTotalWidth) / 2
  const paddingY = (height - gridTotalHeight) / 2
  return {
    paddingLeft: `${paddingX}px`,
    paddingRight: `${paddingX}px`,
    paddingTop: `${paddingY}px`,
    paddingBottom: `${paddingY}px`,
  }
})

const getItemStyle = (item: GridLayoutItem) => ({
  transform: `translate(${item.x * (gridSize.value.width + gapX)}px, ${item.y * (gridSize.value.height + gapY)}px)`,
  width: `${item.w * gridSize.value.width + (item.w - 1) * gapX}px`,
  height: `${item.h * gridSize.value.height + (item.h - 1) * gapY}px`,
})

const isColliding = (item: GridLayoutItem, index: number) => {
  const { x: x1, y: y1, w: w1, h: h1 } = item
  return items.value.some((other, i) => {
    if (i === index) return false
    const { x: x2, y: y2, w: w2, h: h2 } = other
    return !(x1 + w1 <= x2 || x1 >= x2 + w2 || y1 + h1 <= y2 || y1 >= y2 + h2)
  })
}

function getSnappedItemBounds(target: HTMLElement) {
  const x = parseFloat(target.getAttribute('data-x') || '0')
  const y = parseFloat(target.getAttribute('data-y') || '0')
  const w = parseFloat(target.style.width || '0')
  const h = parseFloat(target.style.height || '0')

  const unitX = gridSize.value.width + gapX
  const unitY = gridSize.value.height + gapY

  return {
    x: Math.round(x / unitX),
    y: Math.round(y / unitY),
    w: Math.max(1, Math.round((w + gapX) / unitX)),
    h: Math.max(1, Math.round((h + gapY) / unitY))
  }
}

function applyItemToDOM(target: HTMLElement, item: GridLayoutItem) {
  const { x, y, w, h } = item
  const translateX = x * (gridSize.value.width + gapX)
  const translateY = y * (gridSize.value.height + gapY)
  const width = w * gridSize.value.width + (w - 1) * gapX
  const height = h * gridSize.value.height + (h - 1) * gapY

  target.setAttribute('data-x', translateX + '')
  target.setAttribute('data-y', translateY + '')
  target.style.transform = `translate(${translateX}px, ${translateY}px)`
  target.style.width = `${width}px`
  target.style.height = `${height}px`
}

function updateItem(target: HTMLElement, index: number) {
  const item = items.value[index]
  const { x, y, w, h } = getSnappedItemBounds(target)

  const old = { ...item }

  item.x = x
  item.y = y
  item.w = w
  item.h = h

  if (collision && isColliding(item, index)) {
    // 碰撞还原
    Object.assign(item, old)
    applyItemToDOM(target, old)
  } else {
    applyItemToDOM(target, item)
  }

  emits('update', item)
  isDraggable.value = false
}

let longPressTimer: NodeJS.Timeout | null = null
let isDraggable = ref(false)

const startLongPress = (e: MouseEvent) => {
  if (!draggable) return
  if (longPressTimer) {
    clearTimeout(longPressTimer)
  }
  longPressTimer = setTimeout(() => {
    const gridItem = (e.target as HTMLElement).closest('.grid-item')
    if (gridItem) {
      const index = Array.from(gridItem.parentNode?.children || []).indexOf(gridItem)
      const item = items.value[index]
      emits('drag-start', item, index)
    }
    isDraggable.value = true
  }, dragTimeout)
}
const cancelLongPress = () => {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  emits('drag-cancel')
}

const interactables = new Map<HTMLElement, Interactable>()
function setInteractable() {
  if (!containerRef.value) return
  const gridItems = containerRef.value.querySelectorAll('.grid-item')
  gridItems.forEach((el, index) => {
    const item = items.value[index]
    if (!item || !(el instanceof HTMLElement)) return

    const interactable = interact(el)
    interactables.set(el, interactable)

    if (draggable) {
      interactable.draggable({
        inertia: false,
        cursorChecker: () => '',
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: containerRef.value!,
            endOnly: true
          })
        ],
        listeners: {
          move(event) {
            if (!isDraggable.value) return
            const target = event.target
            const dx = event.dx
            const dy = event.dy

            const prevX = parseFloat(target.getAttribute('data-x') || '0')
            const prevY = parseFloat(target.getAttribute('data-y') || '0')
            const newX = prevX + dx
            const newY = prevY + dy

            target.style.transform = `translate(${newX}px, ${newY}px)`
            target.setAttribute('data-x', newX)
            target.setAttribute('data-y', newY)
          },
          end(event) {
            if (!isDraggable.value) return
            const target = event.target
            const index = Array.from(target.parentNode.children).indexOf(target)
            updateItem(target, index)
            isDraggable.value = false
            emits('drag-end')
          }
        }
      })
    } else {
      interactable.draggable({
        enabled: false
      })
    }

    if (resizable && item.resizable) {
      const minWidthValue = item.minW ? item.minW * gridSize.value.width : minWidth
      const minHeightValue = item.minH ? item.minH * gridSize.value.height : minHeight
      const maxWidthValue = (item.maxW || cols) * gridSize.value.width
      const maxHeightValue = (item.maxH || rows) * gridSize.value.height

      interactable.resizable({
        edges: { left: false, top: false, right: true, bottom: true },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: containerRef.value!
          }),
          interact.modifiers.restrictSize({
            min: { width: minWidthValue, height: minHeightValue },
            max: {
              width: maxWidthValue || gridSize.value.width * cols,
              height: maxHeightValue || gridSize.value.height * rows
            }
          })
        ],
        listeners: {
          move(event) {
            const { width, height } = event.rect
            const target = event.target
            target.style.width = `${width}px`
            target.style.height = `${height}px`
          },
          end(event) {
            const target = event.target
            const index = Array.from(target.parentNode.children).indexOf(target)
            updateItem(target, index)
          }
        }
      })
    } else {
      interactable.resizable({
        enabled: false
      })
    }
  })
}

onMounted(() => {
  watchEffect(() => {
    if (items.value.length > 0) {
      nextTick(setInteractable)
    }
    // 容器尺寸改变时，重新计算布局
    if (!containerRef.value) return
    const gridItems = containerRef.value.querySelectorAll('.grid-item')
    gridItems.forEach((el, index) => {
      const item = items.value[index]
      if (item && el instanceof HTMLElement) {
        applyItemToDOM(el, item)

        const interactable = interactables.get(el)
        if (!interactable) return

        interactable.draggable({ enabled: draggable })
        interactable.resizable({ enabled: resizable && item.resizable })
      }
    })
  })
})

</script>

<style scoped>
.pegboard-grid {
  position: relative;
  width: 100%;
  height: 100%;
}

.grid-item {
  position: absolute;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
  padding: 2px;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  background: #555;
  cursor: se-resize;
}
</style>
