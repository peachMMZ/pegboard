<template>
  <div>
    <NModal
      v-model:show="show"
      class="max-w-1/2"
      preset="card"
      title="组件设置"
      draggable
    >
      <div v-if="item && item.props">
        <NForm label-placement="left" label-width="80px">
          <template v-for="(val, key) in item.props" :key="key">
            <NFormItem v-if="!val.hide" :label="val.label">
              <DynamicPropEditor :prop="val" />
            </NFormItem>
          </template>
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
