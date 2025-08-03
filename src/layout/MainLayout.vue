<template>
  <div class="h-full">
    <NLayout class="h-full">
      <NLayoutHeader class="h-12 p-2" :style="{ backgroundColor: backgroundColor.header }">
        <Header></Header>
      </NLayoutHeader>
      <NLayoutContent
        class="h-[calc(100%-6rem)]"
        content-class="h-full"
        :content-style="{ backgroundColor: backgroundColor.content }"
        :native-scrollbar="false"
      >
        <RouterView #default="{ Component }">
          <KeepAlive>
            <Transition name="fade">
              <component :is="Component" />
            </Transition>
          </KeepAlive>
        </RouterView>
      </NLayoutContent>
      <NLayoutFooter class="h-12 p-2" :style="{ backgroundColor: backgroundColor.footer }">
        <Footer></Footer>
      </NLayoutFooter>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  useThemeVars
} from 'naive-ui'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useThemeStore } from '@/store/theme'

const themeVars = useThemeVars()
const themeStore = useThemeStore()

const backgroundColor = computed(() => {
  return {
    header: themeStore.colorfulBackground ? themeVars.value.primaryColorHover : undefined,
    content: themeStore.colorfulBackground ? themeVars.value.primaryColorSuppl : undefined,
    footer: themeStore.colorfulBackground ? themeVars.value.primaryColorHover : undefined,
  }
})
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
