<template>
  <div>
    <NModal
      v-model:show="show"
      class="max-w-1/2"
      preset="card"
      title="组件设置"
    >
      <div v-if="item && item.props">
        <NForm>
          <NFormItem v-for="(val, key) in item.props" :key="key" :label="val.label">
            <component :is="getComponentByType(val.type)" v-model:value="val.value"></component>
          </NFormItem>
        </NForm>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NInputNumber
} from 'naive-ui'
import { PegboardItem, PegboardItemPropType } from '@/store/pegboard'

const show = defineModel('show', { default: false })
defineProps<{
  item?: PegboardItem
}>()

function getComponentByType(type: PegboardItemPropType) {
  switch (type) {
    case 'string':
      return NInput
    case 'number':
      return NInputNumber
    default:
      return NInput
  }
}
</script>
<style scoped></style>
