import { PegboardItemType } from '@/store/pegboard'
import { Component, defineAsyncComponent } from 'vue'

export { default as Widget } from './Widget.vue'

export const widgetTypeMapping: Record<PegboardItemType, Component | null> = {
  launcher: defineAsyncComponent(() => import('@/widgets/launcher/Launcher.vue')),
  folder: null,
  file: null,
  clock: defineAsyncComponent(() => import('@/widgets/clock/Clock.vue')),
  image: null,
}
