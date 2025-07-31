import { PegboardItemPropType } from "@/store/pegboard"

export interface DynamicPropEditorProps<K extends PegboardItemPropType = PegboardItemPropType> {
  prop: {
    label: string
    editable?: boolean
    type: K
    value: any
  }
}
