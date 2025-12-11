import '@/store/types/pegboard.d'
import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

declare module '@/store/types/pegboard' {
  export interface PegboardItemTypeMap {
    webLink: 'web-link'
  }
}


const plugin: WidgetPlugin = {
  key: 'webLink',
  type: 'web-link',
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '网页链接',
    defaultSize: { w: 2, h: 1 },
    resizable: true,
    props: {

    }
  }
}

export default plugin
