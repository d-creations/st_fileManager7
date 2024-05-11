const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  getFilesInFolder: (filepath) => ipcRenderer.invoke('getFilesInFolder', filepath),
  openFolder:  () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  getFileText: (filepath) => ipcRenderer.invoke('getFileText',filepath),
  saveFile: (filepath,text) => ipcRenderer.invoke('saveFile',filepath,text)

})

