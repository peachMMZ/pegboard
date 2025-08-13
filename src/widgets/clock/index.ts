import { defineAsyncComponent } from 'vue'
import type { WidgetPlugin } from '@/widgets/index.d'

const plugin: WidgetPlugin = {
  key: 'clock',
  type: 'clock',
  component: defineAsyncComponent(() => import('./src/index.vue')),
  meta: {
    title: '基础时钟',
    resizable: true,
    defaultSize: { w: 4, h: 2 },
    minSize: { w: 3, h: 2 },
    props: {
      format: {
        label: '时间格式',
        type: 'select',
        value: 'HH:mm',
        options: [
          { label: '时分', value: 'HH:mm' },
          { label: '时分秒', value: 'HH:mm:ss' },
        ],
        editable: true
      },
      hour12: {
        label: '12小时制',
        type: 'boolean',
        value: false,
        editable: true
      },
      showDate: {
        label: '显示日期',
        type: 'boolean',
        value: true,
        editable: true
      },
      showWeekday: {
        label: '显示星期',
        type: 'boolean',
        value: true,
        editable: true
      }
    }
  }
}

export default plugin
