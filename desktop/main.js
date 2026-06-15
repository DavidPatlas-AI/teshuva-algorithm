const { app, BrowserWindow, screen, ipcMain, Menu, Tray, nativeImage } = require('electron')
const path = require('path')

let win
let tray

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win = new BrowserWindow({
    width: 340,
    height: 340,
    x: width - 360,
    y: height - 360,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile(path.join(__dirname, 'index.html'))
  win.setIgnoreMouseEvents(true, { forward: true })

  ipcMain.on('mouse-enter-clippy', () => win.setIgnoreMouseEvents(false))
  ipcMain.on('mouse-leave-clippy', () => win.setIgnoreMouseEvents(true, { forward: true }))
  ipcMain.on('start-drag',         () => win.setIgnoreMouseEvents(false))
  ipcMain.on('move-window', (_, { deltaX, deltaY }) => {
    const [x, y] = win.getPosition()
    win.setPosition(x + deltaX, y + deltaY)
  })
}

app.whenReady().then(() => {
  createWindow()

  const img = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABnSURBVFiF7c0xCsAgEAXRt3j/K3sUi4VNQnbBZCEDA8/iBiIiIiIiIiIiIiIiIiIiIiIiIiIi4gMAfgBSSu0AAADgn3POOVFKMSIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIuINPwMHCBJPfgAAAABJRU5ErkJggg=='
  )
  tray = new Tray(img)
  tray.setToolTip('האלגוריתם שחזר בתשובה — לחץ לאפשרויות')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'הצג / הסתר', click: () => win.isVisible() ? win.hide() : win.show() },
    { type: 'separator' },
    { label: 'יציאה', click: () => app.quit() }
  ]))
  tray.on('double-click', () => win.isVisible() ? win.hide() : win.show())
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
