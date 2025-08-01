import { CSSProperties } from 'vue'
import { GridLayoutItem } from '@/components/GridLayout'

export interface Pegboard {
  id: number
  name: string
  sort?: number
  items: PegboardItem[]
}

export type PegboardItemType = 'launcher' | 'folder' | 'file' | 'clock' | 'image'

export type PegboardItemPropType = 'string' | 'number' | 'boolean' | 'file' | 'undefined'

export interface PegboardItemProp<K extends PegboardItemPropType = PegboardItemPropType> {
  [key: string]: {
    label: string
    hide?: boolean
    editable?: boolean
    type: K
    value: any
  }
}

export interface PegboardItemStyle extends CSSProperties {
  iconSize?: number
}

export interface PegboardItem extends GridLayoutItem {
  name?: string
  type: PegboardItemType
  component?: string
  props?: PegboardItemProp<PegboardItemPropType>
  iconPath?: string
  iconUrl?: string
  color?: string
  path?: string
  style?: PegboardItemStyle
}
