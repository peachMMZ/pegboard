import { CSSProperties } from 'vue'
import { GridLayoutItem } from '@/components/GridLayout'

export interface Pegboard {
  id: number
  name: string
  sort?: number
  items: PegboardItem[]
}

export type PegboardBaseItemType = 'launcher' | 'folder' | 'file' | 'clock' | 'image'
export interface PegboardItemTypeMap {
  base: PegboardBaseItemType
}
export type PegboardItemType = PegboardItemTypeMap[keyof PegboardItemTypeMap]

export type PegboardItemPropType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'file'
  | 'slider'
  | 'undefined'
export interface PegboardItemProp<K extends PegboardItemPropType = PegboardItemPropType> {
  label: string
  hide?: boolean
  editable?: boolean
  min?: number
  max?: number
  step?: number
  type: K
  value: any
}
export interface PegboardItemProps<K extends PegboardItemPropType = PegboardItemPropType> {
  [key: string]: PegboardItemProp
}

export interface PegboardItemStyle extends CSSProperties {
  iconSize?: number
}

export interface PegboardItem extends GridLayoutItem {
  name?: string
  widgetKey: string
  type: PegboardItemType
  component?: string
  props?: PegboardItemProps
  iconPath?: string
  iconUrl?: string
  color?: string
  path?: string
  style?: PegboardItemStyle
}
