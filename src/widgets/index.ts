import { PegboardItemType } from '@/store/pegboard'
import { Component, defineAsyncComponent } from 'vue'

export { default as Widget } from './Widget.vue'

export const widgetTypeMapping: Record<PegboardItemType, Component | null> = {
  launcher: defineAsyncComponent(() => import('@/widgets/launcher/Launcher.vue')),
  folder: null,
  file: null,
  clock: defineAsyncComponent(() => import('@/widgets/clock/Clock.vue')),
  image: defineAsyncComponent(() => import('@/widgets/image/Image.vue')),
}

const widgets = import.meta.glob('@/widgets/**/*.vue')
export function getWidgetComponent(path: string) {
  const getter = widgets[`/src/widgets${path}`] as () => Promise<Component>
  return defineAsyncComponent(getter)
}
