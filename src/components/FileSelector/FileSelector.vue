<template>
  <div class="w-full">
    <NInput :value="filePath" disabled>
      <template #suffix>
        <NButton type="primary" text size="small" @click="openFileSelector">选择文件</NButton>
      </template>
    </NInput>
  </div>
</template>

<script setup lang="ts">
import { NInput, NButton } from 'naive-ui'
import { open } from '@tauri-apps/plugin-dialog'
import { FileSelectorProps } from './types'

const filePath = defineModel<string>('value', { required: false })
const props = defineProps<FileSelectorProps>()

function openFileSelector() {
  open(props.dialogOptions).then((selected) => {
    if (selected) {
      filePath.value = selected
    }
  })
}
</script>
<style scoped></style>
