<template>
  <div class="h-full">
    <NTabs class="h-full" placement="left" type="line">
      <NTabPane class="h-full" v-for="item in paneList" :key="item.name" :tab="item.tab" :name="item.name">
        <NScrollbar class="h-full">
          <component :is="item.component"></component>
        </NScrollbar>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import {
  NTabs,
  NTabPane,
  NScrollbar,
} from 'naive-ui'
import ThemeSetting from './components/ThemeSetting.vue'
import About from './components/About.vue'

const paneList = [
  { tab: '外观', name: 'theme', component: ThemeSetting },
  { tab: '快捷键', name: 'shortcut', component: null },
  { tab: '窗口', name: 'window', component: null },
  { tab: '其他', name: 'other', component: null },
  { tab: '关于', name: 'about', component: About },
]
</script>
<style scoped></style>
