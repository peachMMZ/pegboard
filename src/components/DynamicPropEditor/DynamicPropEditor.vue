<template>
  <NInput
    v-if="prop.type === 'string'"
    v-model:value="prop.value"
    :disabled="!prop.editable"
  />
  <NInput
    v-if="prop.type === 'text'"
    v-model:value="prop.value"
    :disabled="!prop.editable"
    type="textarea"
    :autosize="{ minRows: 2, maxRows: 4 }"
  />
  <NSlider
    v-if="prop.type === 'number'"
    v-model:value="prop.value"
    :disabled="!prop.editable"
    :min="prop.min"
    :max="prop.max"
    :step="prop.step"
  />
  <NSwitch
    v-if="prop.type === 'boolean'"
    v-model:value="prop.value"
    :disabled="!prop.editable"
  />
  <FileSelector
    v-if="prop.type === 'file'"
    v-model:value="prop.value"
  />
</template>

<script setup lang="ts">
import { NInput, NSlider, NSwitch } from 'naive-ui'
import { FileSelector } from '@/components/FileSelector'
import { DynamicPropEditorProps } from './types'

defineProps<DynamicPropEditorProps>()

</script>
<style scoped></style>
