<template>
  <div ref="containerRef" class="pegboard-grid">
    <div v-for="(item, index) in items" :key="item.id" class="grid-item" :class="itemClass" :style="getItemStyle(item)">
      <slot name="item" :item="item" :index="index">
        <!-- 默认内容 -->
        <div class="resize-handle"></div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import interact from 'interactjs'
import { GridLayoutProps, GridLayoutItem } from './types'

const {
  gridSize = 100,
  minHeight = 100,
  minWidth = 100,
  collision = false,
  gapX = 0,
  gapY = 0,
  itemClass = undefined
} = defineProps<GridLayoutProps>()

const items = defineModel<Array<GridLayoutItem & Record<string, unknown>>>('value', { default: [] })
const emits = defineEmits<{ (e: 'update', item: GridLayoutItem): void }>()

const containerRef = ref<HTMLElement | null>(null)

const getItemStyle = (item: GridLayoutItem) => ({
  transform: `translate(${item.x * (gridSize + gapX)}px, ${item.y * (gridSize + gapY)}px)`,
  width: `${item.w * gridSize + (item.w - 1) * gapX}px`,
  height: `${item.h * gridSize + (item.h - 1) * gapY}px`,
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

  const unitX = gridSize + gapX
  const unitY = gridSize + gapY

  return {
    x: Math.round(x / unitX),
    y: Math.round(y / unitY),
    w: Math.max(1, Math.round((w + gapX) / unitX)),
    h: Math.max(1, Math.round((h + gapY) / unitY))
  }
}

function applyItemToDOM(target: HTMLElement, item: GridLayoutItem) {
  const { x, y, w, h } = item
  const translateX = x * (gridSize + gapX)
  const translateY = y * (gridSize + gapY)
  const width = w * gridSize + (w - 1) * gapX
  const height = h * gridSize + (h - 1) * gapY

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
}

watchEffect(() => {
  if (!containerRef.value) return
  const gridItems = containerRef.value.querySelectorAll('.grid-item')
  gridItems.forEach((el, index) => {
    const item = items.value[index]
    if (item && el instanceof HTMLElement) {
      applyItemToDOM(el, item)
    }
  })
})

onMounted(() => {
  interact('.grid-item')
    .draggable({
      inertia: false,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: containerRef.value!,
          endOnly: true
        })
      ],
      listeners: {
        move(event) {
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
          const target = event.target
          const index = Array.from(target.parentNode.children).indexOf(target)
          updateItem(target, index)
        }
      }
    })
    .resizable({
      edges: { left: false, top: false, right: true, bottom: true },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: containerRef.value!
        }),
        interact.modifiers.restrictSize({
          min: { width: minWidth, height: minHeight },
          max: {
            width: containerRef.value?.offsetWidth || Infinity,
            height: containerRef.value?.offsetHeight || Infinity
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
