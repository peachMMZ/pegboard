import { Component } from 'vue'
import { PegboardItemType, PegboardItemProps } from '../store/pegboard'

export interface WidgetMeta {
  title: string
  icon?: Component
  defaultSize: { w: number, h: number }
  minSize?: { w: number, h: number }
  maxSize?: { w: number, h: number }
  resizable?: boolean
  props?: PegboardItemProps
}

export interface WidgetPlugin {
  key: string
  type: PegboardItemType
  hide?: boolean
  component: Component
  meta: WidgetMeta
}
