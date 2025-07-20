import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
// 等宽字体
import 'vfonts/FiraCode.css'
import { createPinia } from 'pinia'
import router from './router'
import { setupWindow, setupShortcuts, disableBorwserFeatures } from '@/setup'

async function setup() {
  const startTime = Date.now()

  await setupWindow()
  await setupShortcuts()
  disableBorwserFeatures()

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  app.mount('#app')

  console.log(`App loaded in ${Date.now() - startTime}ms`)
}

setup()
