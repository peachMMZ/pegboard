<template>
  <NInput v-if="prop.type === 'string'" v-model:value="prop.value" :disabled="!prop.editable"></NInput>
  <NInputNumber v-if="prop.type === 'number'" v-model:value="prop.value" :disabled="!prop.editable"></NInputNumber>
  <NSwitch v-if="prop.type === 'boolean'" v-model:value="prop.value" :disabled="!prop.editable"></NSwitch>
  <FileSelector v-if="prop.type === 'file'" v-model:value="prop.value"></FileSelector>
</template>

<script setup lang="ts">
import { NInput, NInputNumber, NSwitch } from 'naive-ui'
import { FileSelector } from '@/components/FileSelector'
import { DynamicPropEditorProps } from './types'

defineProps<DynamicPropEditorProps>()

</script>
<style scoped></style>
