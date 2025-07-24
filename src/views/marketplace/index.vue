<template>
  <div class="h-full p-2">
    <NTabs class="h-full" placement="left">
      <NTabPane v-for="tab in tabs" :tab="tab.label" :name="tab.key">
        <div v-if="tab.components">
          <NGrid :gutter="12">
            <NGridItem v-for="component in tab.components" :span="8">
              <NCard :title="component.label" :bordered="false">
                <component :is="component.component" v-bind="component.props"></component>
              </NCard>
            </NGridItem>
          </NGrid>
        </div>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import {
  NTabs,
  NTabPane,
  NGrid,
  NGridItem,
  NCard
} from 'naive-ui'

const tabs = [
  {
    label: '内置',
    key: 'builtin',
    components: [
      {
        label: '基础时钟',
        key: 'builtin-clock',
        component: defineAsyncComponent(() => import('@/widgets/ClockWidget.vue')),
        props: {
          item: {
            id: 'builtin-clock',
            type: 'clock' as any,
            x: 0,
            y: 0,
            w: 1,
            h: 1
          }
        }
      }
    ]
  },
  { label: '官方', key: 'official' },
  { label: '时钟', key: 'clock' }
]
</script>
<style scoped></style>
