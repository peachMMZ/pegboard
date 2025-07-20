import { NIcon, IconProps } from 'naive-ui'
import { type Component, h } from 'vue'

export function renderIcon(icon?: Component, options?: IconProps) {
  if (!icon) return () => null
  else return () => h(NIcon, options, { default: () => h(icon) })
}
