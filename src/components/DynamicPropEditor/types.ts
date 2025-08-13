import { PegboardItemPropType } from "@/store/pegboard"

export interface DynamicPropEditorProps<K extends PegboardItemPropType = PegboardItemPropType> {
  prop: {
    label: string
    editable?: boolean
    min?: number
    max?: number
    step?: number
    options?: { label: string, value: string | number }[]
    type: K
    value: any
  }
}
