<template>
  <div class="h-full">
    <NLayout class="h-full">
      <NLayoutHeader class="h-12 p-2">
        <Header></Header>
      </NLayoutHeader>
      <NLayoutContent class="h-[calc(100%-6rem)]" content-class="h-full" :native-scrollbar="false">
        <RouterView #default="{ Component }">
          <KeepAlive>
            <Transition name="fade">
              <component :is="Component" />
            </Transition>
          </KeepAlive>
        </RouterView>
      </NLayoutContent>
      <NLayoutFooter class="h-12 p-2">
        <Footer></Footer>
      </NLayoutFooter>
    </NLayout>
  </div>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
} from 'naive-ui'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
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
