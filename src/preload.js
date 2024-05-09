const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  getFilesInFolder: (filepath) => ipcRenderer.invoke('getFilesInFolder', filepath),
  openFolder:  () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile')
})

