import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  key: 'clock',
  type: 'clock',
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '基础时钟',
    defaultSize: { w: 4, h: 2 }
  }
}

export default plugin
