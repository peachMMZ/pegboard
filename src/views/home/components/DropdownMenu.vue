<template>
  <div>
    <NDropdown
     placement="bottom-start"
     trigger="manual"
     size="small"
     :x="position.x"
     :y="position.y"
     :options="options"
     :show="show"
     @clickoutside="show = false"
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
import { usePegboardStore, PegboardItem } from '@/store/pegboard'
import { renderIcon } from '@/utils/renderer'
import { Play, Trash, Palette, Move } from 'lucide-vue-next'
import { randomColor } from '@/utils/color'

const show = defineModel('show', { default: false })
const props = defineProps<{
  item?: PegboardItem
  position: { x: number; y: number }
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
    label: '个性化',
    key: 'style',
    icon: renderIcon(Palette),
    action: () => {
      if (props.item) {
        props.item.color = randomColor('hex')
      }
    }
  },
  {
    label: '移动到',
    key: 'move',
    icon: renderIcon(Move),
    action: () => {

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
