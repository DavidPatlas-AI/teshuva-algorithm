const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktopAPI', {
  mouseEnter:     () => ipcRenderer.send('mouse-enter-clippy'),
  mouseLeave:     () => ipcRenderer.send('mouse-leave-clippy'),
  moveWindow:     (deltaX, deltaY) => ipcRenderer.send('move-window', { deltaX, deltaY }),
  startDrag:      () => ipcRenderer.send('start-drag'),
  getBrainState:  () => ipcRenderer.invoke('get-brain-state'),
})
