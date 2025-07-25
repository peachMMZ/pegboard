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
