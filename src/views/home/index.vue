<template>
  <div id="pegboard-container" class="h-full w-full flex flex-col p-2 overflow-hidden">
    <Transition :name="`slide-${currentDirection}`" mode="out-in" :duration="150">
      <div v-if="currentPegboard" :key="currentPegboard.id" class="flex-1 w-full overflow-hidden">
        <GridLayout
          v-model:value="currentPegboard.items"
          :gap-x="2"
          :gap-y="2"
          collision
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-cancel="handleDragEnd"
        >
          <template #item="{ item, index }">
            <AppWidget v-if="item.type === 'app'" :class="getItemClass(index)" :item="item" @contextmenu="(e: MouseEvent) => handleTileContextMenu(e, item)" />
            <ClockWidget v-else-if="item.type === 'clock'" :class="getItemClass(index)" :item="item" />
          </template>
        </GridLayout>
      </div>
    </Transition>
    <div v-if="pegboardStore.pegboardList.length > 0" class="h-6 w-full flex justify-center">
      <NPagination
        :current="currentIndex + 1"
        :page-count="pegboardStore.pegboardList.length"
        @update:page="(page) => pegboardStore.goToIndex(page - 1)"
      >
        <template #prev></template>
        <template #label="{ type, active }">
          <div v-if="type === 'page'">
            <div class="w-6 h-1 rounded-full" :style="{ backgroundColor: active ? themeVars.primaryColor : themeVars.textColor3 }"></div>
          </div>
        </template>
        <template #next></template>
      </NPagination>
    </div>
    <MiniView to="#pegboard-container" />
    <DropdownMenu
      v-model:show="dropdownShow"
      :item="selectedItem"
      :position="dropdownPosition"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  NPagination,
  useMessage,
  useThemeVars
} from 'naive-ui'
import { PegboardItem, usePegboardStore } from '@/store/pegboard'
import { GridLayout } from '@/components/GridLayout'
import { getCurrentWindow, DragDropEvent } from '@tauri-apps/api/window'
import { Event } from '@tauri-apps/api/event'
import { storeToRefs } from 'pinia'
import MiniView from './components/MiniView.vue'
import AppWidget from '@/widgets/AppWidget.vue'
import ClockWidget from '@/widgets/ClockWidget.vue'
import DropdownMenu from './components/DropdownMenu.vue'

const message = useMessage()
const themeVars = useThemeVars()

const pegboardStore = usePegboardStore()
const { currentIndex, currentPegboard, currentDirection } = storeToRefs(pegboardStore)

const dragStates = ref<{ [key: number]: boolean }>({})
function handleDragStart(_item: unknown, index: number) {
  dragStates.value[index] = true
}
function handleDragEnd() {
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
        pegboardStore.newAppItem(currentPegboard.value.id, path).then((item) => {
          pegboardStore.addItem(currentPegboard.value.id, item)
        }).catch((err) => {
          message.error(err)
        })
      })
    }
  }
}

const selectedItem = ref<PegboardItem>()
const dropdownPosition = ref({ x: 0, y: 0 })
const dropdownShow = ref(false)
function handleTileContextMenu(e: MouseEvent, item: PegboardItem) {
  e.preventDefault()
  selectedItem.value = item
  dropdownShow.value = false
  nextTick(() => {
    dropdownPosition.value = { x: e.clientX, y: e.clientY }
    dropdownShow.value = true
  })
}

let unListen: () => void
onMounted(async () => {
  const window = getCurrentWindow()
  unListen = await window.onDragDropEvent(onDragDrop)
})

onUnmounted(() => {
  if (unListen) {
    unListen()
  }
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
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.active-effect {
  transform-origin: center center;
  scale: 0.98;
  transition: all 0.2s ease-in-out;
}
</style>
