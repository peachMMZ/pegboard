<template>
  <div class="h-full">
    <NTabs class="h-full" placement="left">
      <NTabPane v-for="item in paneList" :key="item.name" :tab="item.tab" :name="item.name">
        <component :is="item.component"></component>
      </NTabPane>
    </NTabs>
  </div>
</template>

<script setup lang="ts">
import {} from 'vue'
import {
  NTabs,
  NTabPane
} from 'naive-ui'
import ThemeSetting from './components/ThemeSetting.vue'

const paneList = [
  { tab: '外观', name: 'theme', component: ThemeSetting },
  { tab: '其他', name: 'other', component: null }
]
</script>
<style scoped></style>
