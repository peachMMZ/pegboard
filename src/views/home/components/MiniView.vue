<template>
  <div>
    <NDrawer
      v-model:show="pegboardStore.miniViewVisible"
      placement="bottom"
      :to="to"
      :height="200"
    >
      <NDrawerContent class="p-0">
        <template #header>
          <div class="flex justify-between items-center px-2">
            <span></span>
            <div class="flex justify-end items-center gap-x-4">
              <NButton text :render-icon="renderIcon(Pencil)"></NButton>
              <NButton text :render-icon="renderIcon(Trash)" @click="removePegboard"></NButton>
            </div>
          </div>
        </template>
        <!-- 横向滚动容器 -->
        <div class="h-full flex items-center justify-center gap-x-2">
          <div
            v-for="(pegboard, index) in pegboardStore.pegboardList"
            :key="pegboard.id"
            class="h-full w-20"
            :style="getPanelStyle(index)"
            @click="pegboardStore.goToIndex(index)"
          >
            <div class="h-full flex items-center justify-center">
              <span class="text-lg">{{ pegboard.name }}</span>
            </div>
          </div>
          <div
            class="h-full w-20 flex justify-center items-center"
            :style="getPanelStyle(-1)"
          >
            <NButton
              text
              :render-icon="renderIcon(Plus, { size: 32 })"
              @click="pegboardStore.newPegboard()"
            ></NButton>
          </div>
        </div>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'
import {
  NDrawer,
  NDrawerContent,
  type DrawerProps,
  NButton,
  useThemeVars,
  useMessage
} from 'naive-ui'
import { Plus, Pencil, Trash } from 'lucide-vue-next'
import { usePegboardStore } from '@/store/pegboard'
import { renderIcon } from '@/utils/renderer';

defineProps<{
  to: DrawerProps['to']
}>()

const pegboardStore = usePegboardStore()
const themeVars = useThemeVars()
const message = useMessage()

function getPanelStyle(index: number): CSSProperties {
  const borderColor = index === pegboardStore.currentIndex ? themeVars.value.primaryColor : themeVars.value.borderColor
  return {
    border: `2px solid ${borderColor}`,
    borderRadius: themeVars.value.borderRadius,
    backgroundColor: '#f0f0f0',
    cursor: 'pointer'
  }
}

function removePegboard() {
  try {
    pegboardStore.removePegboard(pegboardStore.currentPegboard.id)
  } catch (err: any) {
    message.error(err.message)
  }
}
</script>
<style scoped></style>
