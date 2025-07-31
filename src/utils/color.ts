export function lighten(hex: string, percent = 20) {
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)
  r = Math.min(255, Math.round(r + (255 - r) * percent / 100))
  g = Math.min(255, Math.round(g + (255 - g) * percent / 100))
  b = Math.min(255, Math.round(b + (255 - b) * percent / 100))
  return `rgb(${r},${g},${b})`
}

export function randomColor(type: 'rgb' | 'rgba' | 'hex' = 'rgb') {
  if (type === 'rgb') {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
  }
  if (type === 'rgba') {
    return `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${Math.random()})`
  }
  if (type === 'hex') {
    return `#${Math.random().toString(16).slice(2, 8)}`
  }
}

export function rgbToHex(rgb: [number, number, number]) {
  const [r, g, b] = rgb
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

export function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

export function offsetBrightness(hex: string, percent: number) {
  const [r, g, b] = hexToRgb(hex)
  if (percent > 0) {
    return rgbToHex([
      Math.min(255, Math.round(r + (255 - r) * percent / 100)),
      Math.min(255, Math.round(g + (255 - g) * percent / 100)),
      Math.min(255, Math.round(b + (255 - b) * percent / 100))
    ])
  } else {
    return rgbToHex([
      Math.max(0, Math.round(r + r * percent / 100)),
      Math.max(0, Math.round(g + g * percent / 100)),
      Math.max(0, Math.round(b + b * percent / 100))
    ])
  }
}

export function isHex(color: string) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color)
}

export interface ColorStatus {
  base: string
  hover: string
  pressed: string
  suppl: string
}
export function deriveColorStates(hex: string): ColorStatus {
  if (!isHex(hex)) {
    throw new Error('无效的Hex颜色格式')
  }
  const normalizedHex = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex.toUpperCase()
  return {
    base: normalizedHex,
    hover: offsetBrightness(normalizedHex, 20),
    pressed: offsetBrightness(normalizedHex, -20),
    suppl: offsetBrightness(normalizedHex, 40)
  }
}
