<template>
  <div>
    <NDrawer
      v-model:show="pegboardStore.miniViewVisible"
      placement="bottom"
      :to="to"
      :height="200"
      @update-show="handleUpdateShow"
    >
      <NDrawerContent class="p-0">
        <template #header>
          <div class="flex justify-between items-center px-2">
            <span></span>
            <div class="flex justify-end items-center gap-x-2">
              <NButton type="primary" size="small" secondary :disabled="moving" :render-icon="renderIcon(Pencil)" @click="editVisible = !editVisible"></NButton>
              <NButton type="error" size="small" secondary :disabled="moving" :render-icon="renderIcon(Trash)" @click="removePegboard"></NButton>
            </div>
          </div>
        </template>
        <div class="h-full flex overflow-hidden">
          <NScrollbar x-scrollable content-class="h-full">
            <div class="h-full flex-1 flex items-center justify-center gap-x-2">
              <div
                v-for="(pegboard, index) in pegboardStore.pegboardList"
                :key="pegboard.id"
                class="h-full w-20"
                :style="getPanelStyle(index)"
                @click="handlePanelClick(pegboard, index)"
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
          </NScrollbar>
          <Transition name="slide">
            <NDivider v-if="editVisible && !moving" vertical style="height: 100%;" />
          </Transition>
          <Transition name="slide">
            <div v-if="editVisible && !moving" class="basis-2/5 h-full p-2">
              <NForm size="small" label-placement="left">
                <NFormItem label="名称" path="name">
                  <NInput v-model:value="pegboardStore.currentPegboard.name" />
                </NFormItem>
                <NFormItem label="排序">
                  <NInputNumber v-model:value="pegboardStore.currentPegboard.sort" @change="pegboardStore.sortPegboard()" />
                </NFormItem>
              </NForm>
            </div>
          </Transition>
        </div>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, CSSProperties, computed } from 'vue'
import {
  NDrawer,
  NDrawerContent,
  type DrawerProps,
  NButton,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NScrollbar,
  useThemeVars,
  useMessage
} from 'naive-ui'
import { Plus, Pencil, Trash } from 'lucide-vue-next'
import { Pegboard, usePegboardStore } from '@/store/pegboard'
import { renderIcon } from '@/utils/renderer'

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
    backgroundColor: themeVars.value.baseColor,
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

function handleUpdateShow(val: boolean) {
  if (!val) {
    pegboardStore.movingItems = []
  }
}

const moving = computed(() => pegboardStore.movingItems && pegboardStore.movingItems.length > 0)
function handlePanelClick(pegboard: Pegboard, index: number) {
  if (moving.value) {
    pegboardStore.moveItemToPegboard(pegboard.id)
    pegboardStore.miniViewVisible = false
  }
  pegboardStore.goToIndex(index)
}

const editVisible = ref(false)
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
