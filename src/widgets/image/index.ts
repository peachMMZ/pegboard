import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  key: 'image',
  type: 'image',
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '图片',
    defaultSize: { w: 4, h: 2 },
    resizable: true,
    props: {
      path: { label: '图片路径', type: 'file', editable: true, value: undefined },
      rotate: {
        label: '旋转角度',
        type: 'number',
        editable: true,
        value: 0,
        min: 0,
        max: 360,
      },
      dynamicScale: { label: '动态缩放', type: 'boolean', editable: true, value: true },
    }
  }
}

export default plugin
