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
import {
  NDropdown,
  type DropdownOption
} from 'naive-ui'

const show = defineModel('show', { default: false })
defineProps<{
  options: DropdownOption[]
  position: { x: number; y: number }
}>()

function handleDropdownSelect(_key: string, option: DropdownOption) {
  if (option.action && typeof option.action === 'function') {
    option.action()
    show.value = false
  }
}

</script>
<style scoped></style>
