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
            <DynamicPropEditor :prop="val" />
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
} from 'naive-ui'
import { PegboardItem } from '@/store/pegboard'
import { DynamicPropEditor } from '@/components/DynamicPropEditor'

const show = defineModel('show', { default: false })
defineProps<{
  item?: PegboardItem
}>()

</script>
<style scoped></style>
