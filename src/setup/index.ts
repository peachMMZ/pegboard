import { getCurrentWindow, PhysicalPosition, currentMonitor } from '@tauri-apps/api/window'
import { isRegistered, register } from '@tauri-apps/plugin-global-shortcut'

export async function setupWindow() {
  const monitor = await currentMonitor()
  if (!monitor) {
    return
  }
  const currentWindow = getCurrentWindow()
  if (currentWindow.label !== 'main') {
    return
  }
  const { x } = await currentWindow.outerPosition()
  const windowSize = await currentWindow.innerSize()
  const bottom = monitor.workArea.size.height - windowSize.height
  await currentWindow.setPosition(new PhysicalPosition(x, bottom))
  await currentWindow.show()
  await currentWindow.setFocus()
}

export async function setupShortcuts() {
  const toggleVisibleShortcut = 'Control+Alt+Space'
  const registered = await isRegistered(toggleVisibleShortcut)
  if (!registered) {
    await register(toggleVisibleShortcut, async (event) => {
      if (event.state === 'Released') {
        const currentWindow = getCurrentWindow()
        const visible = await currentWindow.isVisible()
        if (visible) {
          currentWindow.hide()
        } else {
          await currentWindow.show()
          currentWindow.setFocus()
        }
      }
    })
  }
}

export function disableBorwserFeatures() {
  // 禁用浏览器默认的右键菜单
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
  })
  // 禁用浏览器默认的拖拽行为
  document.addEventListener('dragstart', (event) => {
    event.preventDefault()
  })
}
