import { moveWindow, Position } from '@tauri-apps/plugin-positioner'
import { getCurrentWindow, LogicalPosition } from '@tauri-apps/api/window'
import { isRegistered, register } from '@tauri-apps/plugin-global-shortcut'

export async function setupWindow() {
  await moveWindow(Position.BottomCenter)
  const currentWindow = getCurrentWindow()
  const { x, y } = await currentWindow.outerPosition()
  await currentWindow.setPosition(new LogicalPosition(x, y - 50))
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
