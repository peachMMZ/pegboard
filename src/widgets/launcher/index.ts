import Launcher from './Launcher.vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  type: 'launcher',
  hide: true,
  component: Launcher,
  meta: {
    title: '启动器',
    defaultSize: { w: 2, h: 2 }
  }
}

export default plugin
