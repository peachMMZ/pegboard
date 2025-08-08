<template>
  <div class="h-full p-2 flex flex-col">
    <NTabs v-model:value="activeTab" class="h-full flex-1" placement="left" type="line">
      <NTabPane class="h-full" v-for="tab in tabs" :tab="tab.label" :name="tab.key">
        <div class="h-full">
          <GridLayout v-model:value="widgetList" :draggable="false" :resizable="false">
            <template #item="{ item }">
              <Widget :item="item" />
              <div class="flex justify-between items-center mt-2">
                <span>{{ item.label }}</span>
                <div>
                  <NButton
                    type="primary"
                    quaternary
                    size="small"
                    :render-icon="renderIcon(Plus)"
                    @click="addItem(item)"
                  >添加</NButton>
                </div>
              </div>
            </template>
          </GridLayout>
        </div>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  NTabs,
  NTabPane,
  NButton,
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

const widgetList = computed(() => getTabItems(activeTab.value))
</script>
<style scoped></style>
