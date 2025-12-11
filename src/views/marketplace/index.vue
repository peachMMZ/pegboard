<template>
  <NElement class="h-full p-2 flex flex-col">
    <NTabs v-model:value="activeTab" class="h-full flex-1" placement="left" type="line">
      <NTabPane class="h-full" v-for="tab in tabs" :tab="tab.label" :name="tab.key">
        <div class="h-full">
          <GridLayout v-model:value="widgetList" :draggable="false" :resizable="false">
            <template #item="{ item }">
              <Widget
                :item="item"
                @mouseenter="() => moreVisibles[item.widgetKey] = true"
                @mouseleave="() => moreVisibles[item.widgetKey] = false"
              />
              <div class="absolute right-2 bottom-2">
                <NTooltip v-if="moreVisibles[item.widgetKey]">
                  <template #trigger>
                    <NButton
                      v-if="moreVisibles[item.widgetKey]"
                      class="shadow-lg hover:shadow-xl transition-all duration-300"
                      type="primary"
                      size="small"
                      :render-icon="renderIcon(Plus)"
                      circle
                      @click="addItem(item)"
                      @mouseenter="() => moreVisibles[item.widgetKey] = true"
                    />
                  </template>
                  <span>{{ item.label }}</span>
                </NTooltip>
              </div>
            </template>
          </GridLayout>
        </div>
      </NTabPane>
    </NTabs>
  </NElement>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NElement,
  NTabs,
  NTabPane,
  NButton,
  NTooltip,
} from 'naive-ui'
import { Plus } from 'lucide-vue-next'
import { GridLayout } from '@/components/GridLayout'
import { renderIcon } from '@/utils/renderer'
import { Widget } from '@/widgets'
import { tabs } from './data'
import { cloneDeep } from 'es-toolkit/object'
import { useRouter } from 'vue-router'
import { usePegboardStore, PegboardItem } from '@/store/pegboard'
import { getTabItems } from './data'

const router = useRouter()
const pegboardStore = usePegboardStore()

const activeTab = ref(tabs[0].key)

function addItem(item: PegboardItem) {
  const newItem = cloneDeep(item)
  newItem.id = Date.now()
  router.push({ name: 'home' }).then(() => {
    pegboardStore.movingItems.push(newItem)
    pegboardStore.miniViewVisible = true
  })
}

const moreVisibles = ref<Record<string, boolean>>({})
const widgetList = computed(() => {
  const items = getTabItems(activeTab.value)
  items.forEach(item => {
    moreVisibles.value[item.widgetKey] = false
  })
  return items
})
</script>
<style scoped></style>
