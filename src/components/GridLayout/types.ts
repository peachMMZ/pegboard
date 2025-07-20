export interface GridLayoutProps {
  gridSize?: number
  minWidth?: number
  minHeight?: number
  collision?: boolean
  gapX?: number
  gapY?: number
  border?: number
  itemClass?: string
}

export interface GridLayoutItem {
  id: number | string
  x: number
  y: number
  w: number
  h: number
}
