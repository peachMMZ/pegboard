import { Component } from 'vue'
import { PegboardItemType, PegboardItemProp } from '../store/pegboard'

export interface WidgetMeta {
  title: string
  icon?: Component
  defaultSize: { w: number, h: number }
  props?: PegboardItemProp
}

export interface WidgetPlugin {
  type: PegboardItemType
  hide?: boolean
  component: Component
  meta: WidgetMeta
}
