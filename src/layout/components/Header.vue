<template>
  <div class="flex justify-between items-center">
    <div class="basis-1/4">
      <NButton type="primary" quaternary :render-icon="renderIcon(ChevronLeft)" @click="$router.back()"></NButton>
      <NButton type="primary" quaternary :render-icon="renderIcon(Search)"></NButton>
    </div>
    <div class="basis-1/2 flex justify-center">
    </div>
    <div class="basis-1/4 flex justify-end items-center">
      <NButton type="primary" quaternary :render-icon="renderIcon(PlusCircle)" @click="addItem"></NButton>
      <NButton
        type="warning"
        quaternary
        :render-icon="renderIcon(ChevronDownCircle)"
        @click="hide"
      ></NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  useMessage
} from 'naive-ui'
import { Search, ChevronDownCircle, PlusCircle, ChevronLeft } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { getAllWindows } from '@tauri-apps/api/window'
import { usePegboardStore } from '@/store/pegboard'
import { open } from '@tauri-apps/plugin-dialog'

const message = useMessage()
const pegboardStore = usePegboardStore()

async function hide() {
  const windows = await getAllWindows()
  windows.forEach((window) => {
    window.hide()
  })
}

function addItem() {
  open().then((selected) => {
    if (selected) {
      const currentPegboardId = pegboardStore.currentPegboard.id
      pegboardStore.newAppItem(currentPegboardId, selected)
      .then((newItem) => {
        pegboardStore.addItem(currentPegboardId, newItem)
        message.success('添加成功')
      })
      .catch((error: Error) => {
        message.error(error.message)
      })
    }
  })
}
</script>
<style scoped></style>
