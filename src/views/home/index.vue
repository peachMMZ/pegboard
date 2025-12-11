<template>
  <div ref="pegboardContainer" class="h-full w-full flex flex-col p-2 overflow-hidden">
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
            <Widget :item="item" :class="getItemClass(item, index)" @contextmenu="(e: MouseEvent) => handleTileContextMenu(e, item)" />
          </template>
        </GridLayout>
      </div>
    </Transition>
    <div v-if="pegboardStore.pegboardList.length > 0" class="h-6 w-full flex justify-center">
      <NPagination
        :page="currentIndex + 1"
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
    <MiniView v-if="pegboardContainer" :to="pegboardContainer" />
    <DropdownMenu
      v-model:show="dropdownShow"
      :options="dropdownOptions"
      :position="dropdownPosition"
    />
    <WidgetSetting
      v-model:show="settingVisible"
      :item="selectedItem"
      @update:show="(show) => {
        if (!show) selectedItem = undefined
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, useTemplateRef } from 'vue'
import {
  NPagination,
  useMessage,
  useThemeVars
} from 'naive-ui'
import { PegboardItem, usePegboardStore } from '@/store/pegboard'
import { GridLayout, GridLayoutItem } from '@/components/GridLayout'
import { getCurrentWindow, DragDropEvent } from '@tauri-apps/api/window'
import { listen } from '@tauri-apps/api/event'
import { Event } from '@tauri-apps/api/event'
import { storeToRefs } from 'pinia'
import { useDropdownMenu } from './composables/useDropdownMenu'
import { useArrowKeySelect } from './composables/useArrowKeySelect'
import MiniView from './components/MiniView.vue'
import { Widget } from '@/widgets'
import DropdownMenu from './components/DropdownMenu.vue'
import WidgetSetting from './components/WidgetSetting.vue'

const message = useMessage()
const themeVars = useThemeVars()

const pegboardStore = usePegboardStore()
const { currentIndex, currentPegboard, currentDirection } = storeToRefs(pegboardStore)

const pegboardContainer = useTemplateRef<HTMLDivElement>('pegboardContainer')

const dragStates = ref<{ [key: number]: boolean }>({})
function handleDragStart(_item: unknown, index: number) {
  dragStates.value[index] = true
}
function handleDragEnd() {
  dragStates.value = {}
}
function getItemClass(item: GridLayoutItem, index: number) {
  const classList = []
  if (dragStates.value[index]) {
    classList.push('active-effect')
  }
  if (item.id === selectedItem.value?.id) {
    classList.push('selected')
  }
  return classList
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
function listenArrowKeySelect() {
  listen<KeyboardEvent>('pegboard://key-down', (event) => {
    if (currentPegboard.value.items) {
      if (event.payload.key === 'Enter' && selectedItem.value) {
        pegboardStore.openApp(selectedItem.value)
        return
      }
      const { newSelectedItem } = useArrowKeySelect(event.payload, currentPegboard.value.items, selectedItem.value)
      selectedItem.value = newSelectedItem
    }
  })
}
function handleTileContextMenu(e: MouseEvent, item: PegboardItem) {
  e.preventDefault()
  selectedItem.value = item
  dropdownShow.value = false
  nextTick(() => {
    dropdownPosition.value = { x: e.clientX, y: e.clientY }
    dropdownShow.value = true
  })
}

const { options: dropdownOptions, settingVisible } = useDropdownMenu(selectedItem)

let unListen: () => void
onMounted(async () => {
  listenArrowKeySelect()
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

.selected {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(-2px);
  background-color: v-bind('themeVars.primaryColor');
  box-shadow:
    0 0 0 2px v-bind('themeVars.primaryColor'),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
