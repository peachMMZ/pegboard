<template>
  <div>
    <NDropdown
     placement="bottom-start"
     trigger="manual"
     :x="position.x"
     :y="position.y"
     :options="options"
     :show="show"
     @clickoutside="emits('clickoutside')"
     @select="handleDropdownSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  NDropdown,
  type DropdownOption
} from 'naive-ui'
import { usePegboardStore, PegboardItem } from '@/repository/pegboard'
import { renderIcon } from '@/utils/renderer'
import { Play, Trash } from 'lucide-vue-next'

const show = defineModel('show', { default: false })
const props = defineProps<{
  item?: PegboardItem
  position: { x: number; y: number }
}>()
const emits = defineEmits<{
  (e: 'clickoutside'): void
}>()

const pegboardStore = usePegboardStore()

const options = ref<DropdownOption[]>([
  {
    label: '启动',
    key: 'launch',
    icon: renderIcon(Play),
    action: () => {
      if (props.item) {
        pegboardStore.openApp(props.item)
      }
    }
  },
  { type: 'divider' },
  {
    label: '删除',
    key: 'delete',
    icon: renderIcon(Trash),
    action: () => {
      if (props.item) {
        pegboardStore.removeItem(props.item)
      }
    }
  }
])

function handleDropdownSelect(_key: string, option: DropdownOption) {
  if (option.action && typeof option.action === 'function') {
    option.action()
    show.value = false
  }
}

</script>
<style scoped></style>
