import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  key: 'launcher',
  type: 'launcher',
  hide: true,
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '启动器',
    defaultSize: { w: 2, h: 2 }
  }
}

export default plugin
