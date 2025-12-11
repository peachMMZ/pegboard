<template>
  <div class="w-full flex pr-2">
    <div :style="leftStyle" class="basis-1/3 flex justify-center items-center">
      <img class="w-40" src="/logo.svg" alt="Logo">
    </div>
    <div class="basis-2/3 p-8 flex flex-col justify-center">
      <div class="space-y-6">
        <div class="flex items-center gap-x-2">
          <h1 class="text-3xl font-bold">{{ appInfo.name }}</h1>
          <NTag type="primary" round>{{ appInfo.version }}</NTag>
        </div>

        <div class="space-y-4">
          <p>Pegboard 是一款可定制的桌面挂件应用，让你可以在桌面上创建和组织各种实用的小部件。</p>
        </div>

        <div class="pt-4">
          <NButton
            type="primary"
            :render-icon="renderIcon(RefreshCcw)"
            :loading="checking"
            @click="onCheckUpdate"
            round
            size="large"
          >
            检查更新
          </NButton>
        </div>

        <div class="pt-8 text-sm">
          <p>© {{ new Date().getFullYear() }} {{ appInfo.name }}. 保留所有权利。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, CSSProperties } from 'vue'
import { NButton, NTag, useDialog, useThemeVars } from 'naive-ui'
import { RefreshCcw } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { getName, getVersion } from '@tauri-apps/api/app'
import { checkUpdate } from '@/updater'

const dialog = useDialog()
const themeVars = useThemeVars()

const appInfo = ref({
  name: '',
  version: ''
})

const leftStyle = computed<CSSProperties>(() => {
  const scrollbarEl = document.querySelector('.n-scrollbar')
  const height = scrollbarEl ? scrollbarEl.clientHeight : undefined
  return {
    backgroundColor: themeVars.value.primaryColor,
    height: height + 'px'
  }
})

const checking = ref(false)
function onCheckUpdate() {
  checking.value = true
  checkUpdate({ showNoUpdatePrompt: true })
    .catch(() => {
      dialog.error({
        title: '检查失败(┬┬﹏┬┬)',
        content: '请检查网络连接'
      })
    })
    .finally(() => checking.value = false)
}

onMounted(async () => {
  appInfo.value.name = (await getName()).toUpperCase()
  appInfo.value.version = `v ${await getVersion()}`
})
</script>
<style scoped>
</style>
