import { PegboardItem } from '@/store/pegboard'
import { Component, defineAsyncComponent } from 'vue'
import { WidgetPlugin, WidgetMeta } from './index.d'

export { default as Widget } from './Widget.vue'

export const plugins = import.meta.glob('@/widgets/*/index.ts', { eager: true }) as Record<string, { default: WidgetPlugin }>

export const widgetComponentMap: Record<string, Component> = {} as any
export const widgetMetaMap: Record<string, WidgetMeta> = {} as any

for (const path in plugins) {
  const module = plugins[path]
  const plugin = module.default
  widgetComponentMap[plugin.key] = plugin.component
  widgetMetaMap[plugin.key] = plugin.meta
}

const widgets = import.meta.glob('@/widgets/**/*.vue')
export function getWidgetComponent(path: string) {
  const getter = widgets[`/src/widgets${path}`] as () => Promise<Component>
  return defineAsyncComponent(getter)
}

export function resolveWidgetComponent(item: PegboardItem) {
  if (item.component) {
    return getWidgetComponent(item.component)
  }
  return widgetComponentMap[item.widgetKey]
}
