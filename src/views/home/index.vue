<template>
  <div class="h-full w-full flex flex-col p-2 overflow-hidden">
    <Transition :name="`slide-${currentDirection}`" mode="out-in" :duration="150">
      <div v-if="currentPegboard" :key="currentPegboard.id" class="flex-1 w-full overflow-hidden">
        <GridLayout
          v-model:value="currentPegboard.items"
          :gap-x="5"
          :gap-y="5"
          collision
          @drag-active="handleDragActive"
          @drag-cancel="handleDragCancel"
        >
          <template #item="{ item, index }">
            <div
              class="p-2 w-full h-full flex flex-col justify-around border-1"
              :class="dragStates[index] ? 'active-effect' : ''"
            >
              <div class="flex justify-center">
                <img class="w-2/3" src="/icon/icon_bilibili.png" alt="" style="object-fit: cover;">
              </div>
              <div class="flex justify-center items-center">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
        </GridLayout>
      </div>
    </Transition>
    <div class="h-6 w-full flex justify-center">
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
import { ref, onMounted, computed } from 'vue'
import {
  NButton,
  NPagination,
} from 'naive-ui'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { usePegboardStore } from '@/repository/pegboard'
import { GridLayout } from '@/components/GridLayout'
import { renderIcon } from '@/utils/renderer'

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

onMounted(() => {
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease-in-out;
}
</style>
