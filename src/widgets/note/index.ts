import '@/store/types/pegboard.d'
import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

declare module '@/store/types/pegboard' {
  export interface PegboardItemTypeMap {
    note: 'note'
  }
}

const plugin: WidgetPlugin = {
  key: 'note',
  type: 'note',
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '便签',
    defaultSize: { w: 4, h: 2 },
    props: {
      text: { label: '文本', type: 'text', value: '这是一个便签', editable: true },
      fontSize: { label: '字体大小', type: 'number', value: 20, editable: true },
      fontWeight: { label: '字体粗细', type: 'number', value: 400, editable: true, min: 100, max: 900, step: 100 },
    }
  }
}

export default plugin
