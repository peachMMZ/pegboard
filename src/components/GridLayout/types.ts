export interface GridLayoutProps {
  cols?: number
  rows?: number
  minWidth?: number
  minHeight?: number
  collision?: boolean
  gapX?: number
  gapY?: number
  border?: number
  itemClass?: string
  dragTimeout?: number
}

export interface GridLayoutItem {
  id: number | string
  x: number
  y: number
  w: number
  h: number
}
