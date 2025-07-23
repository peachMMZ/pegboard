<template>
  <div class="h-full w-full flex flex-col p-2 overflow-hidden">
    <Transition :name="`slide-${currentDirection}`" mode="out-in" :duration="150">
      <div v-if="currentPegboard" :key="currentPegboard.id" class="flex-1 w-full overflow-hidden">
        <GridLayout
          v-model:value="currentPegboard.items"
          :gap-x="2"
          :gap-y="2"
          collision
          @drag-active="handleDragActive"
          @drag-cancel="handleDragCancel"
        >
          <template #item="{ item, index }">
            <Tile :class="getItemClass(index)" :item="item" />
          </template>
        </GridLayout>
      </div>
    </Transition>
    <div v-if="pegboardStore.pegboardList.length > 0" class="h-6 w-full flex justify-center">
      <NPagination
        :current="currentIndex + 1"
        :page-count="pegboardStore.pegboardList.length"
        @update:page="(page) => goToIndex(page - 1)"
      >
        <template #prev>
          <NButton text :render-icon="renderIcon(ChevronLeft)"></NButton>
        </template>
        <template #label="{ type }">
          <span v-if="type === 'page'">●</span>
        </template>
        <template #next>
          <NButton text :render-icon="renderIcon(ChevronRight)"></NButton>
        </template>
      </NPagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  NButton,
  NPagination,
  useMessage
} from 'naive-ui'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePegboardStore } from '@/repository/pegboard'
import { GridLayout } from '@/components/GridLayout'
import { renderIcon } from '@/utils/renderer'
import { getCurrentWindow, DragDropEvent } from '@tauri-apps/api/window'
import { Event } from '@tauri-apps/api/event'
import Tile from './components/Tile.vue'

const message = useMessage()

const pegboardStore = usePegboardStore()

const currentIndex = ref(0)
const currentDirection = ref<'prev' | 'next'>('next')
const currentPegboard = computed(() => {
  return pegboardStore.pegboardList[currentIndex.value]
})

function goToIndex(index: number) {
  // 记录当前导航方向
  currentDirection.value = index > currentIndex.value ? 'next' : 'prev'
  const maxIndex = pegboardStore.pegboardList.length - 1
  if (index === 0) {
    currentIndex.value = Math.max(index, 0)
  } else {
    currentIndex.value = Math.min(index, maxIndex)
  }
}

const dragStates = ref<{ [key: number]: boolean }>({})
function handleDragActive(_item: unknown, index: number) {
  dragStates.value[index] = true
}
function handleDragCancel() {
  dragStates.value = {}
}
function getItemClass(index: number) {
  if (dragStates.value[index]) {
    return 'active-effect'
  }
}

async function onDragDrop(event: Event<DragDropEvent>) {
  if (event.event === 'tauri://drag-drop' && event.payload.type === 'drop') {
    const paths = event.payload.paths
    if (paths && paths.length > 0) {
      paths.forEach((path) => {
        pegboardStore.newItem(path).then((item) => {
          pegboardStore.addItem(currentPegboard.value.id, item)
        }).catch((err) => {
          message.error(err)
        })
      })
    }
  }
}

let unListen: () => void
onMounted(async () => {
  const window = getCurrentWindow()
  unListen = await window.onDragDropEvent(onDragDrop)
})

onUnmounted(() => {
  unListen()
})
</script>
<style scoped>
:deep(.n-pagination-item.n-pagination-item--active.n-pagination-item--clickable) {
  border: none;
}
/* 向右导航动画（next） */
.slide-next-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-next-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 向左导航动画（prev） */
.slide-prev-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-prev-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 通用过渡属性 */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.active-effect {
  transform-origin: center center;
  scale: 0.98;
  transition: all 0.2s ease-in-out;
}
</style>
