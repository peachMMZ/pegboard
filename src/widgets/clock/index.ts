import Clock from './Clock.vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  type: 'clock',
  component: Clock,
  meta: {
    title: '基础时钟',
    defaultSize: { w: 4, h: 2 }
  }
}

export default plugin
